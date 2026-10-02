import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const tracked = [
  "schemas",
  "registry/components.registry.json",
  "packages/contracts/src/generated.mjs",
  "packages/contracts/src/generated.d.ts",
  "packages/registry/src/generated.mjs",
  "contracts/manifest.json",
  "api/public-api.json",
  "api/PUBLIC-API.md",
  "docs/INVARIANTS.md",
  "docs/CERTIFIED-SURFACES.md",
  "docs/REACT-SURFACE.md",
  "docs/NOT-CERTIFIED.md"
];
const before = new Map();

function collect(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const child = path.join(rel, entry.name);
      if (entry.isDirectory()) collect(child);
      else before.set(child, fs.readFileSync(path.join(root, child), "utf8"));
    }
  } else {
    before.set(rel, fs.readFileSync(p, "utf8"));
  }
}
for (const rel of tracked) collect(rel);

const result = spawnSync(process.execPath, [path.join(root, "scripts/generate.mjs")], { cwd: root, stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);

const changed = [];
for (const [rel, content] of before) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== content) changed.push(rel);
}
if (changed.length) {
  console.error("Generated drift:", changed.join(", "));
  process.exit(1);
}
console.log(`gate:drift PASS via scripts/check-drift.mjs (${before.size} generated files stable)`);
