import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packagesRoot = path.join(root, "packages");
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="));
const separateOutputIndex = process.argv.indexOf("--output");
const outputValue = outputArgument?.slice("--output=".length)
  ?? (separateOutputIndex >= 0 ? process.argv[separateOutputIndex + 1] : undefined);
if (!outputValue) throw new Error("TARBALL_OUTPUT_REQUIRED: pass --output <empty-directory>");

const output = path.resolve(outputValue);
if (output === root || output.startsWith(root + path.sep)) throw new Error("TARBALL_OUTPUT_MUST_BE_OUTSIDE_REPOSITORY");
if (fs.existsSync(output) && fs.readdirSync(output).length) throw new Error("TARBALL_OUTPUT_NOT_EMPTY: " + output);
fs.mkdirSync(output, { recursive: true });
const npmCache = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-release-npm-cache-"));
process.on("exit", () => fs.rmSync(npmCache, { recursive: true, force: true }));

const sourceCommitResult = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
if (sourceCommitResult.status !== 0) throw new Error("SOURCE_COMMIT_UNAVAILABLE");
const gitStatus = spawnSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
if (gitStatus.status !== 0) throw new Error("SOURCE_WORKTREE_STATUS_UNAVAILABLE");
const workingTree = gitStatus.stdout.trim() ? "dirty" : "clean";
if (process.env.GITHUB_SHA && workingTree !== "clean") throw new Error("RELEASE_CHECKOUT_MUST_BE_CLEAN");
const sourceCommit = workingTree === "clean" ? (process.env.GITHUB_SHA ?? sourceCommitResult.stdout.trim()) : null;
const packages = [];

for (const directory of fs.readdirSync(packagesRoot).sort()) {
  const packageRoot = path.join(packagesRoot, directory);
  const manifestPath = path.join(packageRoot, "package.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const packed = spawnSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", output], {
    cwd: packageRoot,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: npmCache, npm_config_ignore_scripts: "true" },
  });
  if (packed.status !== 0) throw new Error("NPM_PACK_FAILED: " + manifest.name + "\n" + (packed.stderr || packed.stdout));
  let metadata;
  try {
    const parsed = JSON.parse(packed.stdout);
    metadata = Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0];
  } catch {
    throw new Error("NPM_PACK_INVALID_JSON: " + manifest.name);
  }
  if (!metadata?.filename) throw new Error("NPM_PACK_FILENAME_MISSING: " + manifest.name);
  const tarballPath = path.join(output, metadata.filename);
  const bytes = fs.readFileSync(tarballPath);
  packages.push({
    name: manifest.name,
    version: manifest.version,
    private: manifest.private === true,
    tarball: metadata.filename,
    size: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    integrity: metadata.integrity ?? null,
  });
}

if (packages.length !== 21) throw new Error("EXPECTED_21_WORKSPACE_PACKAGES; got " + packages.length);
const bundle = {
  schemaVersion: 1,
  channel: "internal-vendored-tarballs",
  sourceCommit,
  workingTree,
  createdAt: new Date().toISOString(),
  packageCount: packages.length,
  packages,
};
fs.writeFileSync(path.join(output, "release-manifest.json"), JSON.stringify(bundle, null, 2) + "\n");
fs.writeFileSync(path.join(output, "README.md"), [
  "# MAATAA UI internal package tarballs",
  "",
  `Source commit: ${sourceCommit ?? "not recorded because the local worktree was dirty"}`,
  "",
  "Install the packages needed by an app from its vendor directory with `npm install --no-save ./*.tgz`. Include the required internal dependencies in the same command. The release manifest records package versions and SHA-256 digests.",
  "",
  "These tarballs are private internal artifacts. They are not published to npm or GitHub Packages.",
  "",
].join("\n"));
console.log(`internal tarball bundle PASS (${packages.length} packages; source ${sourceCommit}; output ${output})`);
