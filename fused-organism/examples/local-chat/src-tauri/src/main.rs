//! MAATAA Chat: the local chat app in its own window.
//!
//! The app's pages are built into this program. On start it runs a small web
//! server on 127.0.0.1:41730 (see `bind_listener`) that serves those pages and
//! forwards /ollama, /lmstudio and /nova to Ollama, LM Studio and Maataa
//! Workstation, exactly like the dev server does, then opens a window on it.
//! So the web app runs unchanged and no CORS setup is needed. The pages get no
//! access to Tauri's own APIs.
//!
//! Addresses can be changed with OLLAMA_URL, LMSTUDIO_URL and NOVA_URL.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use axum::{
    body::Body,
    extract::{Request, State},
    http::{header, Method, Response, StatusCode},
    Router,
};
use tauri::{
    webview::{DownloadEvent, NewWindowResponse},
    AppHandle, Manager, Url, WebviewUrl, WebviewWindowBuilder,
};

/// Where the app's local server listens. Fixed so saved data survives restarts.
const DEFAULT_PORT: u16 = 41730;

/// Largest request forwarded to a model server (pictures make requests big).
const MAX_BODY: usize = 64 * 1024 * 1024;

/// Content Security Policy for the app's pages. `connect-src 'self'` means the
/// app, and any artifact page shown inside it, can only talk to this local
/// server, never to the internet.
const CSP: &str = "default-src 'self'; script-src 'self' 'unsafe-inline'; \
style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; \
font-src 'self' data:; connect-src 'self'; frame-src 'self' blob: data:; \
object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'";

#[derive(Clone)]
struct AppState {
    app: AppHandle,
    client: reqwest::Client,
    /// (path prefix, upstream base URL)
    upstreams: Arc<Vec<(&'static str, String)>>,
    /// "127.0.0.1:<port>", the only Host header accepted (blocks DNS rebinding).
    host: Arc<String>,
    /// "http://127.0.0.1:<port>", the only Origin accepted on forwarded calls.
    origin: Arc<String>,
}

fn env_or(name: &str, default: &str) -> String {
    std::env::var(name)
        .ok()
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| default.to_string())
}

fn plain(status: StatusCode, text: &'static str) -> Response<Body> {
    Response::builder()
        .status(status)
        .header(header::CONTENT_TYPE, "text/plain; charset=utf-8")
        .body(Body::from(text))
        .unwrap()
}

async fn handle(State(s): State<AppState>, req: Request) -> Response<Body> {
    let host = req
        .headers()
        .get(header::HOST)
        .and_then(|h| h.to_str().ok());
    if host != Some(s.host.as_str()) {
        return plain(StatusCode::FORBIDDEN, "Wrong host.");
    }
    let path = req.uri().path().to_string();
    for (prefix, base) in s.upstreams.iter() {
        if path == *prefix || path.starts_with(&format!("{prefix}/")) {
            // Only the app's own pages may use the model servers: a web page
            // open in a browser must not reach them through this port.
            let origin_ok = req
                .headers()
                .get(header::ORIGIN)
                .map_or(true, |o| o.as_bytes() == s.origin.as_bytes());
            let site_ok = req
                .headers()
                .get("sec-fetch-site")
                .map_or(true, |v| v == "same-origin" || v == "none");
            if !origin_ok || !site_ok {
                return plain(StatusCode::FORBIDDEN, "Not allowed from another site.");
            }
            let base = base.clone();
            let rest = path[prefix.len()..].to_string();
            return forward(&s, req, &base, &rest).await;
        }
    }
    if req.method() != Method::GET && req.method() != Method::HEAD {
        return plain(StatusCode::METHOD_NOT_ALLOWED, "Method not allowed.");
    }
    serve_asset(&s.app, &path)
}

fn serve_asset(app: &AppHandle, path: &str) -> Response<Body> {
    let resolver = app.asset_resolver();
    let wanted = if path == "/" { "/index.html" } else { path };
    let asset = resolver
        .get(wanted.to_string())
        .or_else(|| resolver.get("/index.html".to_string()));
    match asset {
        Some(asset) => {
            let html = asset.mime_type.starts_with("text/html");
            let mut res = Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, asset.mime_type.as_str())
                .header("x-content-type-options", "nosniff")
                .header("referrer-policy", "no-referrer")
                .header(
                    header::CACHE_CONTROL,
                    if html {
                        "no-cache"
                    } else {
                        "public, max-age=31536000, immutable"
                    },
                );
            if html {
                res = res.header("content-security-policy", CSP);
            }
            res.body(Body::from(asset.bytes)).unwrap()
        }
        None => plain(StatusCode::NOT_FOUND, "Not found."),
    }
}

async fn forward(s: &AppState, req: Request, base: &str, rest: &str) -> Response<Body> {
    let query = req
        .uri()
        .query()
        .map(|q| format!("?{q}"))
        .unwrap_or_default();
    let url = format!("{}{}{}", base.trim_end_matches('/'), rest, query);
    let Ok(method) = reqwest::Method::from_bytes(req.method().as_str().as_bytes()) else {
        return plain(StatusCode::METHOD_NOT_ALLOWED, "Method not allowed.");
    };
    let content_type = req.headers().get(header::CONTENT_TYPE).cloned();
    let authorization = req.headers().get(header::AUTHORIZATION).cloned();
    let accept = req.headers().get(header::ACCEPT).cloned();
    let body = match axum::body::to_bytes(req.into_body(), MAX_BODY).await {
        Ok(b) => b,
        Err(_) => return plain(StatusCode::PAYLOAD_TOO_LARGE, "Request too large."),
    };
    let mut upstream = s.client.request(method, &url).body(body);
    for (name, value) in [
        (header::CONTENT_TYPE, content_type),
        (header::AUTHORIZATION, authorization),
        (header::ACCEPT, accept),
    ] {
        if let Some(v) = value {
            upstream = upstream.header(name, v);
        }
    }
    match upstream.send().await {
        Ok(r) => {
            let mut res = Response::builder()
                .status(r.status().as_u16())
                .header(header::CACHE_CONTROL, "no-store");
            if let Some(ct) = r.headers().get(header::CONTENT_TYPE) {
                res = res.header(header::CONTENT_TYPE, ct.clone());
            }
            // Streams the reply through as it arrives (token by token).
            res.body(Body::from_stream(r.bytes_stream())).unwrap()
        }
        Err(e) => {
            let msg = if e.is_connect() || e.is_timeout() {
                "Can't reach that server. Is it running?"
            } else {
                "The server's reply broke off."
            };
            plain(StatusCode::BAD_GATEWAY, msg)
        }
    }
}

/// The web view keeps the app's data (projects, chats, tasks) per address, so
/// the port must stay the same between launches. Tries the fixed port, then
/// two neighbours (e.g. if a second copy is open); MAATAA_CHAT_PORT overrides.
fn bind_listener() -> std::io::Result<std::net::TcpListener> {
    let first: u16 = std::env::var("MAATAA_CHAT_PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(DEFAULT_PORT);
    let mut last_err = None;
    for port in [first, first.wrapping_add(1), first.wrapping_add(2)] {
        match std::net::TcpListener::bind(("127.0.0.1", port)) {
            Ok(l) => return Ok(l),
            Err(e) => last_err = Some(e),
        }
    }
    Err(last_err.unwrap())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let listener = bind_listener()?;
            listener.set_nonblocking(true)?;
            let port = listener.local_addr()?.port();
            let host = format!("127.0.0.1:{port}");
            let origin = format!("http://{host}");

            let state = AppState {
                app: app.handle().clone(),
                client: reqwest::Client::builder()
                    .connect_timeout(std::time::Duration::from_secs(5))
                    .build()?,
                upstreams: Arc::new(vec![
                    ("/ollama", env_or("OLLAMA_URL", "http://127.0.0.1:11434")),
                    ("/lmstudio", env_or("LMSTUDIO_URL", "http://127.0.0.1:1234")),
                    ("/nova", env_or("NOVA_URL", "http://127.0.0.1:8787")),
                ]),
                host: Arc::new(host),
                origin: Arc::new(origin.clone()),
            };
            let router = Router::new().fallback(handle).with_state(state);
            tauri::async_runtime::spawn(async move {
                match tokio::net::TcpListener::from_std(listener) {
                    Ok(l) => {
                        if let Err(e) = axum::serve(l, router).await {
                            eprintln!("MAATAA Chat: local server stopped: {e}");
                        }
                    }
                    Err(e) => eprintln!("MAATAA Chat: couldn't start the local server: {e}"),
                }
            });

            let start: Url = format!("{origin}/").parse()?;
            let own_origin = origin.clone();
            let downloads = app.path().download_dir().ok();
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(start))
                .title("MAATAA Chat")
                .inner_size(1200.0, 820.0)
                .min_inner_size(360.0, 560.0)
                .center()
                // Links to other sites open in the normal browser, not in the app.
                .on_navigation(move |url| {
                    let ours = url.origin().ascii_serialization() == own_origin;
                    if !ours && matches!(url.scheme(), "http" | "https" | "mailto") {
                        let _ = open::that_detached(url.as_str());
                    }
                    ours || url.scheme() == "about"
                        || url.scheme() == "blob"
                        || url.scheme() == "data"
                })
                // target="_blank" links (sources, links in replies) also open
                // in the normal browser.
                .on_new_window(|url, _features| {
                    if matches!(url.scheme(), "http" | "https" | "mailto") {
                        let _ = open::that_detached(url.as_str());
                    }
                    NewWindowResponse::Deny
                })
                // Artifact downloads go to the Downloads folder.
                .on_download(move |_webview, event| {
                    if let DownloadEvent::Requested { destination, .. } = event {
                        if let Some(dir) = &downloads {
                            let name = destination
                                .file_name()
                                .map(|n| n.to_owned())
                                .unwrap_or_else(|| "maataa-artifact.txt".into());
                            *destination = dir.join(name);
                        }
                    }
                    true
                })
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("MAATAA Chat couldn't start");
}
