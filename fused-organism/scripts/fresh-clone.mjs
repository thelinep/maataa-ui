import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const external = Object.entries(lock.packages ?? {}).filter(([name, meta]) => name.startsWith("node_modules/") && meta?.link !== true);
if (external.length) {
  console.error("fresh-clone requires external packages and is not tree-only:", external.map(([name]) => name).join(", "));
  process.exit(1);
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-v3-fresh-"));
const checkout = path.join(temp, "repo");
const cache = path.join(temp, "empty-npm-cache");
fs.mkdirSync(checkout, { recursive: true });
fs.mkdirSync(cache, { recursive: true });

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
  run("npm", ["run", "certify:kernel"]);
  console.log("fresh-clone PASS (temporary checkout + empty npm cache + offline install)");
} finally {
  if (process.env.MAATAA_KEEP_FRESH_CLONE !== "1") fs.rmSync(temp, { recursive: true, force: true });
  else console.log(`fresh clone retained at ${temp}`);
}
