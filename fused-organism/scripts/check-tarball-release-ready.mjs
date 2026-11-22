import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packagesRoot = path.join(root, "packages");
const errors = [];
const changesetDir = path.join(root, ".changeset");
const activeChangesets = fs.readdirSync(changesetDir).filter((file) => file.endsWith(".md") && file !== "README.md");
if (activeChangesets.length) errors.push("unreleased Changesets remain: " + activeChangesets.join(", "));

const origin = spawnSync("git", ["remote", "get-url", "origin"], { cwd: root, encoding: "utf8" });
if (origin.status !== 0) errors.push("origin repository URL is unavailable");
const normalizedOrigin = (origin.stdout ?? "").trim().replace(/\.git$/, "").replace(/^git@github\.com:/, "https://github.com/");
const packages = [];
for (const directory of fs.readdirSync(packagesRoot).sort()) {
  const manifestPath = path.join(packagesRoot, directory, "package.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  packages.push(manifest);
  if (manifest.private !== true) errors.push(manifest.name + " must remain private for the tarball channel");
  const packageRepo = manifest.repository?.url?.replace(/\.git$/, "");
  if (normalizedOrigin && packageRepo !== normalizedOrigin) errors.push(manifest.name + " repository field does not match origin");
}
if (packages.length !== 21) errors.push("expected 21 private packages; found " + packages.length);

const status = spawnSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
if (status.status !== 0 || status.stdout.trim()) errors.push("release source tree must be clean");

if (errors.length) {
  console.error("tarball release readiness FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log(`tarball release readiness PASS (${packages.length} packages remain private; repository metadata matches origin; no pending changesets)`);
