import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packagesRoot = path.join(root, "packages");
const npmCache = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-secret-scan-cache-"));
const findings = [];
const signatures = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["aws-access-key", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ["npm-token", /\bnpm_[A-Za-z0-9]{30,}\b/],
  ["google-api-key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["stripe-secret", /\b(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{16,}\b/],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["gitlab-token", /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ["npmrc-auth", /^\s*(?:_auth|_authToken|password)\s*=/im],
];

function packageDirectories() {
  return fs.readdirSync(packagesRoot).sort().filter((name) =>
    fs.existsSync(path.join(packagesRoot, name, "package.json")),
  );
}

try {
  for (const directory of packageDirectories()) {
    const packageRoot = path.join(packagesRoot, directory);
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    const packed = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
      cwd: packageRoot,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: npmCache },
    });
    if (packed.status !== 0) {
      findings.push(`${manifest.name}: npm pack failed during secret scan`);
      continue;
    }

    let metadata;
    try {
      const result = JSON.parse(packed.stdout);
      metadata = Array.isArray(result) ? result[0] : Object.values(result)[0];
    } catch {
      findings.push(`${manifest.name}: npm pack returned invalid JSON`);
      continue;
    }
    if (!Array.isArray(metadata?.files)) {
      findings.push(`${manifest.name}: npm pack metadata is missing its file list`);
      continue;
    }

    for (const entry of metadata.files) {
      const filePath = path.resolve(packageRoot, entry.path);
      if (!filePath.startsWith(packageRoot + path.sep)) {
        findings.push(`${manifest.name}: packed path escapes the package directory`);
        continue;
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        findings.push(`${manifest.name}/${entry.path}: packed file is missing during secret scan`);
        continue;
      }
      const content = fs.readFileSync(filePath);
      if (content.includes(0)) continue;
      const text = content.toString("utf8");
      for (const [kind, pattern] of signatures) {
        if (pattern.test(text)) findings.push(`${manifest.name}/${entry.path}: possible ${kind}`);
      }
    }
  }
} finally {
  fs.rmSync(npmCache, { recursive: true, force: true });
}

if (findings.length) {
  console.error(`packed-package secret scan FAIL (${findings.length} finding(s); matched values are not printed)\n${findings.join("\n")}`);
  process.exit(1);
}
console.log(`packed-package secret scan PASS (${packageDirectories().length} workspace packages; matched values are not printed)`);
