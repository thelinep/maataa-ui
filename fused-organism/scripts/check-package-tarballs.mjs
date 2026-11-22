import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packagesRoot = path.join(root, "packages");
const errors = [];
let checked = 0;
const npmCache = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-npm-cache-"));

function collectTargets(value, result = []) {
  if (typeof value === "string" && value.startsWith("./")) result.push(value.slice(2));
  else if (Array.isArray(value)) value.forEach((entry) => collectTargets(entry, result));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => collectTargets(entry, result));
  return result;
}

for (const directory of fs.readdirSync(packagesRoot).sort()) {
  const packageRoot = path.join(packagesRoot, directory);
  const manifestPath = path.join(packageRoot, "package.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const packed = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: packageRoot,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: npmCache },
  });
  if (packed.status !== 0) {
    errors.push(manifest.name + ": npm pack failed\n" + (packed.stderr || packed.stdout));
    continue;
  }
  let metadata;
  try {
    const result = JSON.parse(packed.stdout);
    metadata = Array.isArray(result) ? result[0] : Object.values(result)[0];
  }
  catch { errors.push(manifest.name + ": npm pack did not return JSON metadata"); continue; }
  if (!metadata || !Array.isArray(metadata.files)) {
    errors.push(manifest.name + ": npm pack metadata is missing its file list (npm output shape: " + typeof metadata + ")");
    continue;
  }
  const files = new Set((metadata.files ?? []).map(({ path: file }) => file));
  const requiredFiles = new Set([
    ...collectTargets(manifest.exports),
    ...(manifest.files ?? []).filter((entry) => entry === "LICENSE" || entry === "NOTICE"),
  ]);
  for (const file of requiredFiles) if (!files.has(file)) errors.push(manifest.name + ": declared package file missing from tarball: " + file);
  for (const file of ["LICENSE", "NOTICE"]) {
    if (fs.existsSync(path.join(packageRoot, file)) && !files.has(file)) errors.push(manifest.name + ": " + file + " is present in the package but missing from the tarball");
  }
  checked += 1;
}

fs.rmSync(npmCache, { recursive: true, force: true });
if (errors.length) {
  console.error("package tarball check FAIL (" + errors.length + " issue(s))\n" + errors.join("\n"));
  process.exit(1);
}
console.log("package tarball check PASS (" + checked + " workspace packages; declared exports, LICENSE and NOTICE are packed)");
