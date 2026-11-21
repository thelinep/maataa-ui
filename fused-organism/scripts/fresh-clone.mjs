import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-v3-fresh-"));
const checkout = path.join(temp, "repo");
fs.mkdirSync(checkout, { recursive: true });
const cacheResult = spawnSync("npm", ["config", "get", "cache"], { encoding: "utf8" });
if (cacheResult.status !== 0) {
  console.error("fresh-clone could not resolve the npm cache directory");
  process.exit(cacheResult.status ?? 1);
}
const cache = (process.env.npm_config_cache || cacheResult.stdout.trim());

const excluded = new Set(["node_modules", "dist", ".git"]);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  fs.cpSync(path.join(root, entry.name), path.join(checkout, entry.name), { recursive: true });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: checkout,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_cache: cache,
      npm_config_offline: "true",
      npm_config_audit: "false",
      npm_config_fund: "false"
    }
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run("npm", ["ci", "--ignore-scripts", "--offline", "--cache", cache, "--no-audit", "--no-fund"]);
  run("npm", ["run", "build"]);
  run("npm", ["run", "build:ui"]);
  run("npm", ["run", "certify:kernel"]);
  console.log("fresh-clone PASS (isolated checkout + offline lockfile install + package builds + kernel gates)");
} finally {
  if (process.env.MAATAA_KEEP_FRESH_CLONE !== "1") fs.rmSync(temp, { recursive: true, force: true });
  else console.log(`fresh clone retained at ${temp}`);
}
