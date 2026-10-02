import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname);
const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const pkg of fs.readdirSync(path.join(root, "packages"))) {
  if (pkg === "maataa-ui") continue;
  const src = path.join(root, "packages", pkg, "src");
  if (!fs.existsSync(src)) continue;
  const target = path.join(dist, "packages", pkg);
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(src, target, { recursive: true });
}
for (const app of fs.readdirSync(path.join(root, "apps"))) {
  const src = path.join(root, "apps", app);
  const target = path.join(dist, "apps", app);
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(src, target, { recursive: true, filter: (entry) => path.basename(entry) !== ".impeccable" });
}
const uiBuild = spawnSync(process.execPath, [path.join(root, "scripts", "build-ui-packages.mjs")], {
  cwd: root,
  stdio: "inherit",
});
if (uiBuild.error) throw uiBuild.error;
if (uiBuild.status !== 0) process.exit(uiBuild.status ?? 1);
for (const packageName of [
  "tokens",
  "primitives",
  "maataa-ui",
  "domain-primitives",
  "workflow-primitives",
  "evidence-primitives",
  "generative-primitives",
  "composites",
  "templates",
]) {
  const packageDist = path.join(root, "packages", packageName, "dist");
  fs.cpSync(packageDist, path.join(dist, "packages", packageName), { recursive: true });
}
const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");
for (const appName of ["admin-template", "tlps-application"]) {
  const appRoot = path.join(root, "apps", appName);
  const config = path.join(appRoot, "vite.config.mjs");
  if (!fs.existsSync(config)) continue;
  if (!fs.existsSync(vite)) {
    console.error("build: Vite is unavailable; install the fused workspace dependencies first");
    process.exit(1);
  }
  const appBuild = spawnSync(process.execPath, [vite, "build", "--config", config], {
    cwd: root,
    stdio: "inherit",
  });
  if (appBuild.error) throw appBuild.error;
  if (appBuild.status !== 0) process.exit(appBuild.status ?? 1);
}
console.log("build PASS: kernel packages, extracted MAATAA/TLPS packages, and applications built into dist/");
