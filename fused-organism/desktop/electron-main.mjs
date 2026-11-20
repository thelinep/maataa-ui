import { app, BrowserWindow, Menu, net, protocol, session } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

protocol.registerSchemesAsPrivileged([{
  scheme: "maataa",
  privileges: {
    standard: true,
    secure: true,
    supportFetchAPI: true,
    corsEnabled: true,
  },
}]);

const products = Object.freeze({
  maataa: {
    label: "MAATAA Control Plane",
    path: "/apps/admin-template/index.html",
    width: 1440,
    height: 960,
  },
  tlps: {
    label: "TLPS Operations Workspace",
    path: "/apps/tlps-application/index.html",
    width: 1440,
    height: 960,
  },
});

const windows = new Map();
const rendererRoot = path.join(app.getAppPath(), "dist");
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

function response(message, status) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

function registerLocalAppProtocol() {
  protocol.handle("maataa", async (request) => {
    if (request.method !== "GET" && request.method !== "HEAD") return response("Method not allowed", 405);
    const url = new URL(request.url);
    if (url.host !== "bundle") return response("Not found", 404);

    let decodedPath;
    try {
      decodedPath = decodeURIComponent(url.pathname);
    } catch {
      return response("Bad request", 400);
    }
    const requestedPath = decodedPath.endsWith("/") ? `${decodedPath}index.html` : decodedPath;
    const absolutePath = path.resolve(rendererRoot, `.${requestedPath}`);
    const relativePath = path.relative(rendererRoot, absolutePath);
    if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return response("Bad request", 400);
    }

    try {
      const fileResponse = await net.fetch(pathToFileURL(absolutePath).toString(), { method: request.method });
      if (!fileResponse.ok) return response("Not found", 404);
      const headers = new Headers(fileResponse.headers);
      headers.set("content-type", contentTypes.get(path.extname(absolutePath)) || "application/octet-stream");
      headers.set("x-content-type-options", "nosniff");
      headers.set("referrer-policy", "no-referrer");
      if (path.extname(absolutePath) === ".html") {
        headers.set(
          "content-security-policy",
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
        );
      }
      return new Response(fileResponse.body, { status: fileResponse.status, headers });
    } catch {
      return response("Not found", 404);
    }
  });
}

function productUrl(product) {
  return `maataa://bundle${product.path}`;
}

function createProductWindow(productId) {
  const product = products[productId];
  if (!product) throw new Error(`UNKNOWN_DESKTOP_PRODUCT:${productId}`);
  const existing = windows.get(productId);
  if (existing && !existing.isDestroyed()) {
    if (existing.isMinimized()) existing.restore();
    existing.focus();
    return existing;
  }

  const window = new BrowserWindow({
    title: `${product.label} · MAATAA`,
    width: product.width,
    height: product.height,
    minWidth: 1024,
    minHeight: 720,
    show: false,
    backgroundColor: "#f5f6f8",
    webPreferences: {
      preload: path.join(app.getAppPath(), "desktop", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  window.once("ready-to-show", () => window.show());
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, targetUrl) => {
    if (targetUrl !== productUrl(product)) event.preventDefault();
  });
  window.webContents.on("will-attach-webview", (event) => event.preventDefault());
  window.on("closed", () => windows.delete(productId));
  windows.set(productId, window);
  void window.loadURL(productUrl(product));
  return window;
}

function installApplicationMenu() {
  const template = [
    ...(process.platform === "darwin" ? [{
      label: app.name,
      submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
    }] : []),
    {
      label: "File",
      submenu: [
        { label: "MAATAA Control Plane", accelerator: "CmdOrCtrl+1", click: () => createProductWindow("maataa") },
        { label: "TLPS Operations Workspace", accelerator: "CmdOrCtrl+2", click: () => createProductWindow("tlps") },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  registerLocalAppProtocol();
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  installApplicationMenu();
  createProductWindow("maataa");
  app.on("activate", () => {
    if (windows.size === 0) createProductWindow("maataa");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
