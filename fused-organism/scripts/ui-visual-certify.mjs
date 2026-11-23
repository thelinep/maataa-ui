import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";
import { comparePng } from "./png-diff.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packageRoot = path.join(root, "packages", "maataa-ui");
const staticRoot = path.join(packageRoot, "storybook-static");
const baselineDir = path.join(root, "tests", "browser", "ui-baselines");
const manifestPath = path.join(baselineDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const update = process.argv.includes("--update-baselines");
const updateApproved = process.env.MAATAA_VISUAL_UPDATE_APPROVED === "YES_I_AM_UPDATING_REVIEWED_BASELINES";
const errors = [];
// MAATAA_VISUAL_CURRENT_DIR keeps this run's renders (CI uploads them for human review);
// otherwise they go to a temporary folder that is removed afterwards.
const keepCurrentDir = process.env.MAATAA_VISUAL_CURRENT_DIR;
if (keepCurrentDir) fs.mkdirSync(keepCurrentDir, { recursive: true });
const currentDir = keepCurrentDir ?? fs.mkdtempSync(path.join(os.tmpdir(), "maataa-ui-visual-current-"));
const mime = {
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

if (update && !updateApproved) throw new Error("UI_VISUAL_UPDATE_NOT_APPROVED");
if (!update && process.env.MAATAA_VISUAL_UPDATE_APPROVED) throw new Error("UI_VISUAL_UPDATE_TOKEN_PRESENT_DURING_CERTIFICATION");
if (!fs.existsSync(path.join(staticRoot, "index.html"))) throw new Error("STORYBOOK_STATIC_MISSING: run npm run docs:storybook:build");
if (!process.env.MAATAA_BROWSER) throw new Error("MAATAA_BROWSER_REQUIRED");
const browserVersion = spawnSync(process.env.MAATAA_BROWSER, ["--version"], { encoding: "utf8" });
const actualVersion = (browserVersion.stdout || browserVersion.stderr).match(/(\d+\.\d+\.\d+\.\d+)/)?.[1];
if (actualVersion !== manifest.browser.exactVersion) throw new Error("UI_VISUAL_BROWSER_MISMATCH:" + actualVersion + " != " + manifest.browser.exactVersion);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  let file;
  try { file = path.resolve(staticRoot, "." + decodeURIComponent(url.pathname)); }
  catch { response.writeHead(400).end("bad path"); return; }
  if (file !== staticRoot && !file.startsWith(staticRoot + path.sep)) { response.writeHead(403).end("forbidden"); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end("not found"); return; }
  response.writeHead(200, { "content-type": mime[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});

let browser;
try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = "http://127.0.0.1:" + server.address().port;
  const indexResponse = await fetch(baseUrl + "/index.json");
  if (!indexResponse.ok) throw new Error("STORYBOOK_INDEX_UNAVAILABLE:" + indexResponse.status);
  const index = await indexResponse.json();
  const stories = new Map(Object.values(index.entries ?? {}).map((entry) => [entry.id, entry]));
  for (const baseline of manifest.baselines) if (!stories.has(baseline.storyId)) errors.push("stable story missing: " + baseline.storyId);
  if (errors.length) throw new Error(errors.join("\n"));

  browser = await chromium.launch({ executablePath: process.env.MAATAA_BROWSER, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: manifest.viewport[0], height: manifest.viewport[1] }, deviceScaleFactor: manifest.deviceScaleFactor });
  for (const baseline of manifest.baselines) {
    const url = baseUrl + "/iframe.html?id=" + encodeURIComponent(baseline.storyId) + "&viewMode=story";
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.locator("#storybook-root").waitFor({ state: "attached", timeout: 15000 });
    await page.waitForTimeout(150);
    const current = path.join(currentDir, baseline.name);
    await page.locator("#storybook-root").screenshot({ path: current, animations: "disabled" });
    const target = path.join(baselineDir, baseline.name);
    if (update) {
      fs.copyFileSync(current, target);
      console.log("UPDATED " + baseline.component + " " + baseline.storyId);
      continue;
    }
    if (!fs.existsSync(target)) { errors.push("missing baseline: " + baseline.name); continue; }
    const diff = comparePng(target, current, manifest.comparison);
    if (!diff.ok) errors.push(baseline.component + ": pixel ratio " + diff.ratio + " exceeds " + manifest.comparison.maxPixelRatio);
    else console.log("PASS " + baseline.component + " diff=" + diff.ratio);
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
  if (!keepCurrentDir) fs.rmSync(currentDir, { recursive: true, force: true });
}

if (errors.length) {
  console.error("stable UI visual certification FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("stable UI visual certification PASS (" + manifest.baselines.length + " core primitive stories; Chromium " + manifest.browser.exactVersion + ")");
