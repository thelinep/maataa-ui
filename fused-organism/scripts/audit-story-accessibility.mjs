import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packageRoot = path.join(root, "packages", "maataa-ui");
const staticRoot = path.join(packageRoot, "storybook-static");
const stability = JSON.parse(fs.readFileSync(path.join(root, "api", "component-stability.json"), "utf8"));
const stableCoreNames = new Set(stability.stableSet.filter((item) => item.package === "@maataa/primitives" && item.entry === ".").map((item) => item.name));
const reportPath = process.env.MAATAA_AXE_REPORT ?? path.join(os.tmpdir(), "maataa-story-a11y.json");
const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const mime = {
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png",
  ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2",
};

function classifyStory(story) {
  const title = story.title ?? "";
  const componentName = title.split("/").at(-1);
  if (title.startsWith("Primitives/") && stableCoreNames.has(componentName)) return "stable";
  if (/^Maps\//i.test(title) || /(Web3|LogisticsComposites|CultureComposites|FinanceComposites)/i.test(title)) return "experimental";
  return "beta";
}

if (!fs.existsSync(path.join(staticRoot, "index.html"))) {
  console.error("Storybook static site missing; run the Storybook build before axe auditing");
  process.exit(1);
}

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
  const address = server.address();
  const baseUrl = "http://127.0.0.1:" + address.port;
  const indexResponse = await fetch(baseUrl + "/index.json");
  if (!indexResponse.ok) throw new Error("Storybook index unavailable: " + indexResponse.status);
  const index = await indexResponse.json();
  const stories = Object.values(index.entries ?? index.stories ?? {}).filter((entry) => entry.type === "story").sort((a, b) => a.id.localeCompare(b.id));
  if (!stories.length) throw new Error("Storybook index contains no stories");
  const browserOptions = { headless: true, args: ["--no-sandbox"] };
  if (process.env.MAATAA_BROWSER) browserOptions.executablePath = process.env.MAATAA_BROWSER;
  browser = await chromium.launch(browserOptions);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const results = [];
  for (const story of stories) {
    try {
      const url = baseUrl + "/iframe.html?id=" + encodeURIComponent(story.id) + "&viewMode=story";
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator("#storybook-root").waitFor({ state: "attached", timeout: 15000 });
      await page.waitForTimeout(100);
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () => {
        return window.axe.run(document.querySelector("#storybook-root"), {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
        });
      });
      results.push({ id: story.id, title: story.title, name: story.name, stability: classifyStory(story), violations: axe.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
      })), incomplete: axe.incomplete.length });
    } catch (error) {
      results.push({ id: story.id, title: story.title, name: story.name, stability: classifyStory(story), error: String(error) });
    }
    if (results.length % 25 === 0 || results.length === stories.length) console.log("axe stories: " + results.length + "/" + stories.length);
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ schemaVersion: 1, browser: await browser.version(), storyCount: stories.length, results }, null, 2) + "\n");
  const failed = results.filter((entry) => entry.error || entry.violations?.length);
  const stableFailed = failed.filter((entry) => entry.stability === "stable");
  const violationCount = failed.reduce((sum, entry) => sum + (entry.violations?.length ?? 0), 0);
  const stableViolationCount = stableFailed.reduce((sum, entry) => sum + (entry.violations?.length ?? 0), 0);
  console.log("axe audit: " + stories.length + " stories; " + violationCount + " total violations across beta/experimental stories; stable-set violations: " + stableViolationCount + "; report: " + reportPath);
  if (stableFailed.length || results.some((entry) => entry.error)) {
    for (const entry of stableFailed.slice(0, 15)) {
      if (entry.error) console.error(entry.id + ": " + entry.error);
      else console.error(entry.id + ": " + entry.violations.map((violation) => violation.id + " (" + violation.impact + ")").join(", "));
    }
    if (stableFailed.length || results.some((entry) => entry.error)) process.exitCode = 1;
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
