import fs from "node:fs";
import path from "node:path";
import { inspectBrowserVersion, findXvfbExecutable } from "./lib/browser-runtime.mjs";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const policy=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/runtime-policy.json"),"utf8"));
try {
  const browser = await inspectBrowserVersion();
  if (browser.family !== policy.browserFamily) throw new Error(`BROWSER_FAMILY_MISMATCH:${browser.family ?? "unknown"}!=${policy.browserFamily}`);
  if (browser.version !== policy.exactVersion) throw new Error(`BROWSER_VERSION_MISMATCH:${browser.version ?? "unknown"}!=${policy.exactVersion}`);
  const xvfb = findXvfbExecutable();
  console.log(`browser runtime PASS (${browser.versionText}; exact pinned ${policy.browserFamily} ${policy.exactVersion}; DPR ${policy.deviceScaleFactor}; ${xvfb ? "Xvfb available" : "headless mode"})`);
} catch (error) {
  console.error(`browser runtime FAIL: ${error.message}`);
  process.exit(1);
}
