# MAATAA local chat

A chat app that runs on your computer and talks to a local model (Ollama or LM Studio). Nothing leaves the machine unless you point it at another server.

- **Projects:** each has its own chats, instructions and text files (scripts, notes, lists). For each question the closest passages from the files are sent to the model and shown as sources. The built-in **MAATAA UI docs** project answers questions about this library.
- **Artifacts:** when a reply contains a page (` ```html `, ` ```svg `), a titled document (` ```markdown title="Shoot plan" `) or long code, it shows as a card and opens in the side panel, with versions, Copy and Download. Pages run in a sandboxed frame with no access to the app.
- **Tasks:** checklists in a reply (`- [ ] Book the van`) can be added with one tap; `/task` adds one by hand. Optionally copied to the Radheya board in Maataa Workstation.
- **Pictures:** attach, paste or drop up to 4 pictures. Needs a model that can see (gemma3, llava, qwen2.5vl).
- **Rich replies:** Markdown, tables, charts, tap-to-answer options, maps, Mermaid diagrams, maths (KaTeX), and MAATAA call sheets, shot lists, crew cards and Vikram Samvat dates.
- **Live pages:** HTML in a reply, fenced or written straight in, runs right there in a sealed frame (no access to the app, your data or the internet in the desktop app) and opens as an artifact.
- **3D scenes (Three.js):** a ` ```threejs ` block of plain JavaScript runs as a live 3D scene in the reply and in the artifact panel, with orbit, zoom and pan. three.js, a camera, controls, lights and an animation loop (`onFrame((t, dt) => …)`) are ready, and three.js is built into the app, so scenes need no internet. Download saves a single .html file that opens anywhere.
- **Compare image models:** attach a picture, say what should change, and press **Compare image models** under the reply (or type `/compare`). Maataa Workstation runs the same instruction and seed on each chosen model at light, medium and strong settings, and the side panel shows them in a grid beside the original, each marked with what its license allows. Today Workstation's image-to-image route takes SDXL-type checkpoints; instruction-editing models such as FLUX 3 Image Klein and Qwen-Image-Edit-2511 need their own Workstation workflows first.
- **Pictures, sound and video:** with Maataa Workstation running, the model can ask for a picture (ComfyUI), music, sound effects or a voice-over, or a short video (LTX-2). Each shows its description and a **Make** button (or starts by itself if you turn that on in Settings); the result plays in the chat, with Download, and is remembered.
- **Voice:** Read aloud on each reply; the microphone button types what you say (browser speech, where available).

Everything is kept in this browser (IndexedDB). Hindi and English.

```sh
ollama pull gemma3        # once; any chat model works, this one can also see pictures
npm run chat:local        # from fused-organism; opens http://127.0.0.1:5180
```

## Desktop app (Rust)

The same app in its own window, built with Rust and [Tauri](https://tauri.app). No browser, no dev server; the window uses the system's web view (WebKit on macOS and Linux, Edge WebView2 on Windows), so the app stays small.

```sh
npm run chat:desktop      # from fused-organism; needs Rust (https://rustup.rs)
```

The first build downloads and compiles the Rust parts and takes a few minutes; later starts are quick. To make installers (.dmg and .app on macOS, .msi and .exe on Windows, .deb and .AppImage on Linux):

```sh
cargo install tauri-cli --version "^2.12" --locked   # once
cd examples/local-chat/src-tauri && cargo tauri build
```

The **MAATAA Chat desktop app** workflow builds all three on GitHub (run it by hand, or push a `chat-v*` tag). The builds aren't code-signed yet: on macOS, right-click the app and choose Open the first time.

How it works: the app's pages are built into the program. On start it runs a small server on `127.0.0.1:41730` that serves them and forwards `/ollama`, `/lmstudio` and `/nova` just like the dev server, then opens a window on it. `OLLAMA_URL`, `LMSTUDIO_URL` and `NOVA_URL` work here too.

- The port stays the same between launches because the app's saved data belongs to that address. If 41730 is taken it tries 41731 and 41732 (data saved there is kept separately); `MAATAA_CHAT_PORT` picks another.
- The server answers only to `127.0.0.1:<port>`, and forwards to the model servers only for the app's own pages, so a website open in your browser can't use it.
- The pages can only connect to that server (Content Security Policy `connect-src 'self'`), so neither the app nor an artifact page can send anything to the internet. The pages have no access to Tauri's own APIs.
- Links in replies open in your normal browser. Artifact downloads go to your Downloads folder.
- Data is kept in the app's own storage, separate from the browser version.
- The microphone button appears only where the system web view supports speech recognition (not in WebKit on macOS or Linux); Read aloud works everywhere.

Optional: start Maataa Workstation (nova-console on port 8787), then turn on **Settings → Copy tasks to its Radheya board**. Use `NOVA_URL` if it runs elsewhere. Workstation has no place for projects, chats or artifacts yet, so those stay in the browser.

See [docs/LOCAL-CHAT.md](../../docs/LOCAL-CHAT.md) for options, the component API and security notes.
