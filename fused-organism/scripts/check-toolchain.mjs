import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const errors = [];
const stableJson = (value) => JSON.stringify(value, (_key, item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item;
  return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)));
});

if (pkg.packageManager !== "npm@10.9.2") errors.push(`packageManager must be npm@10.9.2, got ${pkg.packageManager}`);
if (fs.existsSync(path.join(root, "pnpm-workspace.yaml"))) errors.push("pnpm-workspace.yaml is forbidden in the npm-only certified tree");
if (fs.existsSync(path.join(root, "turbo.json"))) errors.push("turbo.json is forbidden in the npm-only certified tree");
if (lock.lockfileVersion !== 3) errors.push(`package-lock lockfileVersion must be 3, got ${lock.lockfileVersion}`);
if (lock.packages?.[""]?.version !== pkg.version) errors.push("package-lock root version does not match package.json");

const nodeParts = process.versions.node.split(".").map(Number);
if (nodeParts[0] !== 22 || nodeParts[1] < 16) errors.push(`Node must be >=22.16 and <23, got ${process.versions.node}`);
let npmVersion = "unavailable";
try {
  npmVersion = execFileSync("npm", ["--version"], { encoding: "utf8" }).trim();
} catch {
  errors.push("npm --version could not be executed");
}
const npmParts = npmVersion.split(".").map(Number);
if (npmParts[0] !== 10 || npmParts[1] < 9) errors.push(`npm must be >=10.9 and <11, got ${npmVersion}`);

const workspacePackages = fs.readdirSync(path.join(root, "packages"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    path: `packages/${entry.name}`,
    manifest: JSON.parse(fs.readFileSync(path.join(root, "packages", entry.name, "package.json"), "utf8")),
  }));
const externalRuntime = [];
for (const { path: workspacePath, manifest } of workspacePackages) {
  const allowedInternal = new Set(workspacePackages.map((item) => item.manifest.name));
  for (const [name] of Object.entries(manifest.dependencies ?? {})) {
    if (!allowedInternal.has(name)) externalRuntime.push(`${manifest.name}: ${name}`);
  }
  const lockEntry = lock.packages?.[workspacePath];
  if (!lockEntry || lockEntry.version !== manifest.version) errors.push(`${workspacePath} is missing or version-mismatched in package-lock`);
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    if (stableJson(lockEntry?.[field] ?? {}) !== stableJson(manifest[field] ?? {})) {
      errors.push(`${workspacePath} ${field} do not match package-lock`);
    }
  }
}
if (externalRuntime.length) errors.push(`workspace runtime dependencies must be local packages: ${externalRuntime.join(", ")}`);

const externalLockEntries = Object.entries(lock.packages ?? {}).filter(([name, meta]) => name.startsWith("node_modules/") && meta?.link !== true);
const uiPackage = workspacePackages.find(({ manifest }) => manifest.name === "@maataa/ui");
if (externalLockEntries.length && !Object.keys(uiPackage?.manifest.devDependencies ?? {}).length) {
  errors.push("external lockfile packages are present without an owning UI dev-toolchain manifest");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`gate:toolchain PASS (Node ${process.versions.node}; npm ${npmVersion}; kernel runtime dependencies are workspace-local)`);
