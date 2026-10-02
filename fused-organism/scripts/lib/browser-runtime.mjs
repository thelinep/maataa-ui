import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function findBrowserExecutable() {
  const candidates = [process.env.MAATAA_BROWSER, "/usr/lib/chromium/chromium", "/usr/bin/chromium", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export function findXvfbExecutable() {
  const candidates = [process.env.MAATAA_XVFB, "/usr/bin/Xvfb"].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function chooseDisplay() {
  for (let n = 90; n < 120; n++) if (!fs.existsSync(`/tmp/.X11-unix/X${n}`)) return `:${n}`;
  throw new Error("NO_FREE_XVFB_DISPLAY");
}

export async function inspectBrowserVersion(executable = findBrowserExecutable()) {
  if (!executable) throw new Error("CHROMIUM_NOT_FOUND");
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(executable, ["--version"], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`BROWSER_VERSION_FAILED:${result.stderr || result.stdout}`);
  const text = (result.stdout || result.stderr).trim();
  const match = text.match(/(Chromium|Chrome)\s+(\d+\.\d+\.\d+\.\d+)/i);
  return { executable, versionText: text, family: match?.[1] ?? null, version: match?.[2] ?? null, major: match ? Number(match[2].split('.')[0]) : null };
}

export class CDPClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }
  async connect() {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      this.ws = ws;
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", () => reject(new Error("CDP_WEBSOCKET_OPEN_FAILED")), { once: true });
      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id) {
          const p = this.pending.get(msg.id);
          if (!p) return;
          this.pending.delete(msg.id);
          if (msg.error) p.reject(new Error(`CDP:${msg.error.message}`)); else p.resolve(msg.result ?? {});
          return;
        }
        const list = this.listeners.get(msg.method);
        if (list) for (const fn of [...list]) fn(msg.params ?? {});
      });
    });
    return this;
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  waitEvent(method, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const list = this.listeners.get(method) ?? new Set();
      const timer = setTimeout(() => { list.delete(handler); reject(new Error(`CDP_EVENT_TIMEOUT:${method}`)); }, timeoutMs);
      const handler = (params) => { clearTimeout(timer); list.delete(handler); resolve(params); };
      list.add(handler); this.listeners.set(method, list);
    });
  }
  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(`EVALUATE_FAILED:${result.exceptionDetails.text ?? "unknown"}`);
    return result.result?.value;
  }
  close() { try { this.ws?.close(); } catch {} }
}

export async function launchBrowser() {
  const browser = await inspectBrowserVersion();
  const xvfb = findXvfbExecutable();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-browser-"));
  const profile = path.join(temp, "profile");
  fs.mkdirSync(profile, { recursive: true });
  let xvfbProcess = null;
  let display = process.env.DISPLAY;
  if (xvfb) {
    display = chooseDisplay();
    xvfbProcess = spawn(xvfb, [display, "-screen", "0", "1440x1000x24", "-nolisten", "tcp"], { stdio: "ignore" });
    const socket = `/tmp/.X11-unix/X${display.slice(1)}`;
    for (let i = 0; i < 50 && !fs.existsSync(socket); i++) await sleep(50);
    if (!fs.existsSync(socket)) throw new Error("XVFB_START_FAILED");
  }
  const args = [
    "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-first-run", "--disable-default-apps", "--disable-extensions",
    "--allow-file-access-from-files", "--disable-web-security", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"
  ];
  if (!xvfb && !display) args.unshift("--headless=new");
  const browserProcess = spawn(browser.executable, args, { env: { ...process.env, ...(display ? { DISPLAY: display } : {}) }, stdio: ["ignore", "ignore", "ignore"] });
  const activePort = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 160 && !fs.existsSync(activePort); i++) {
    if (browserProcess.exitCode != null) throw new Error(`BROWSER_EXITED:${browserProcess.exitCode}`);
    await sleep(50);
  }
  if (!fs.existsSync(activePort)) throw new Error("DEVTOOLS_PORT_TIMEOUT");
  const [portLine] = fs.readFileSync(activePort, "utf8").trim().split(/\r?\n/);
  const port = Number(portLine);
  const version = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
  return {
    ...browser,
    port,
    browserProduct: version.Browser,
    async newPage(url) {
      const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" }).then((r) => r.json());
      const client = await new CDPClient(target.webSocketDebuggerUrl).connect();
      await Promise.all([client.send("Page.enable"), client.send("Runtime.enable"), client.send("Accessibility.enable")]);
      return client;
    },
    async close() {
      try { browserProcess.kill("SIGTERM"); } catch {}
      try { xvfbProcess?.kill("SIGTERM"); } catch {}
      await sleep(100);
      try { if (browserProcess.exitCode == null) browserProcess.kill("SIGKILL"); } catch {}
      try { if (xvfbProcess && xvfbProcess.exitCode == null) xvfbProcess.kill("SIGKILL"); } catch {}
      fs.rmSync(temp, { recursive: true, force: true });
    }
  };
}
