import assert from "node:assert/strict";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 4176;
const baseUrl = `http://127.0.0.1:${port}/apps/tlps-application/`;
const server = spawn(
  process.execPath,
  [
    path.join(root, "node_modules/vite/bin/vite.js"),
    "--config",
    "apps/tlps-application/vite.config.mjs",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ],
  { cwd: root, stdio: ["ignore", "ignore", "pipe"] },
);
let browser;
let serverErrors = "";
server.stderr.on("data", (chunk) => {
  serverErrors += chunk.toString();
});

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`TLPS Vite preview did not start: ${lastError?.message ?? "timeout"}\n${serverErrors}`);
}

try {
  await waitForServer();
  browser = await chromium.launch({
    headless: true,
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader"],
  });
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await desktop.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${baseUrl}#/mobile/222/exhibition-layout`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Exhibition Layout" }).waitFor();
  await page.getByRole("button", { name: "Add shape" }).click();
  await page.getByLabel("Object name").fill("Saved visitor path");
  await page.getByText("Saved on this browser").waitFor();
  assert.equal(await page.getByRole("button", { name: "Saved visitor path, rectangle" }).count(), 1);
  console.log("PASS desktop canvas edit and local save indicator");

  await page.getByRole("tab", { name: "3D preview" }).click();
  const canvas = page.locator("canvas[aria-label='Exhibition 3D preview WebGL viewport']");
  await canvas.waitFor();
  const renderer = await canvas.evaluate((element) => {
    const gl = element.getContext("webgl");
    if (!gl) return null;
    const pixels = new Uint8Array(element.width * element.height * 4);
    gl.readPixels(0, 0, element.width, element.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    let warmPixels = 0;
    for (let index = 0; index < pixels.length; index += 16) {
      if (pixels[index] > 100 && pixels[index + 1] > 65) warmPixels += 1;
    }
    return {
      renderer: gl.getParameter(gl.RENDERER),
      width: element.width,
      height: element.height,
      warmPixels,
    };
  });
  assert.ok(
    renderer && renderer.width > 0 && renderer.height > 0,
    "headless browser must provide a live WebGL drawing buffer",
  );
  assert.ok(
    renderer.warmPixels > 10,
    "WebGL should draw colored scene geometry, not only clear the background",
  );
  assert.equal(await page.getByText("3D preview unavailable").count(), 0);
  console.log(`PASS desktop WebGL render (${renderer.width}x${renderer.height})`);
  await page.screenshot({
    path: process.env.TLPS_SPATIAL_SCREENSHOT || path.join(os.tmpdir(), "tlps-spatial-3d-desktop.png"),
    fullPage: true,
  });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save snapshot" }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "tlps-spatial-preview.png");
  const snapshot = await readFile(await download.path());
  assert.ok(
    snapshot.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && snapshot.length > 1000,
  );
  console.log("PASS WebGL PNG snapshot download");

  await page.goto(`${baseUrl}#/mobile/223/3d-cad-previz`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "3D / CAD Previz" }).waitFor();
  await page.getByText("Spatial preview sample fixture").waitFor();
  await page
    .getByText(
      "Experimental simulator status only. This does not display live video or control a physical camera.",
    )
    .waitFor();
  await page.getByText("Ready · simulator").waitFor();
  await page.getByRole("button", { name: "Disconnect simulator" }).click();
  await page.getByText("Disconnected", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Connect simulator" }).click();
  await page.getByText("Ready · simulator").waitFor();
  assert.equal(await page.locator('dl[aria-label="Simulated camera telemetry"]').count(), 1);
  console.log("PASS camera simulator adapter connect/disconnect and demo boundary");
  await page.getByRole("tab", { name: "2D layout canvas" }).click();
  assert.equal(await page.getByRole("button", { name: "Saved visitor path, rectangle" }).count(), 1);
  await page.getByRole("tab", { name: "3D preview" }).click();
  await page.locator("canvas[aria-label='Exhibition 3D preview WebGL viewport']").waitFor();
  console.log("PASS local layout survives route navigation and shares across both app-owned pages");

  const loseContext = await canvas.evaluate((element) => {
    const gl = element.getContext("webgl");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) return false;
    window.__tlpsLoseContext = extension;
    window.__tlpsRestoreEventSeen = false;
    element.addEventListener(
      "webglcontextrestored",
      () => {
        window.__tlpsRestoreEventSeen = true;
      },
      { once: true },
    );
    extension.loseContext();
    return true;
  });
  assert.ok(loseContext, "browser must expose WEBGL_lose_context for the recovery check");
  await page.getByText("3D preview unavailable").waitFor();
  await page.evaluate(() => window.__tlpsLoseContext.restoreContext());
  await page.waitForFunction(() => window.__tlpsRestoreEventSeen === true, null, { timeout: 8000 });
  await page.waitForTimeout(400);
  const restoreMessage = await page
    .locator(".tlps-scene-layout [role='status']")
    .innerText()
    .catch(() => "");
  console.log(`Context restore status: ${restoreMessage || "preview active"}`);
  assert.ok(!restoreMessage.includes("3D preview unavailable"), `scene did not recover: ${restoreMessage}`);
  const restored = await canvas.evaluate((element) => Boolean(element.getContext("webgl")));
  assert.ok(restored);
  console.log("PASS WebGL context-loss recovery");

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on("pageerror", (error) => pageErrors.push(error.message));
  await mobilePage.goto(`${baseUrl}#/mobile/223/3d-cad-previz`, { waitUntil: "networkidle" });
  await mobilePage.getByRole("heading", { name: "3D / CAD Previz" }).waitFor();
  const mobileCanvas = mobilePage.locator("canvas[aria-label='Exhibition 3D preview WebGL viewport']");
  const mobileBox = await mobileCanvas.boundingBox();
  assert.ok(mobileBox && mobileBox.width > 280);
  const overflowAt390 = await mobilePage.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  assert.ok(overflowAt390 <= 1, `mobile page overflowed by ${overflowAt390}px`);
  const cdp = await mobile.newCDPSession(mobilePage);
  const x = mobileBox.x + mobileBox.width * 0.5;
  const y = mobileBox.y + mobileBox.height * 0.5;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x + 24, y: y + 16, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await mobilePage.setViewportSize({ width: 360, height: 800 });
  await mobilePage.waitForTimeout(300);
  const afterResize = await mobileCanvas.evaluate((element) => ({
    width: element.width,
    height: element.height,
    cssWidth: element.getBoundingClientRect().width,
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert.ok(afterResize.width > 0 && afterResize.height > 0 && afterResize.cssWidth > 250);
  assert.ok(
    afterResize.pageWidth <= afterResize.viewportWidth + 1,
    "resized mobile page should not overflow horizontally",
  );
  assert.deepEqual(pageErrors, [], `browser runtime errors: ${pageErrors.join("; ")}`);
  console.log(
    `PASS mobile touch orbit + responsive resize (${afterResize.cssWidth}px stage, no horizontal overflow)`,
  );
  await mobile.close();
  await desktop.close();
  console.log("TLPS spatial browser smoke PASS");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
