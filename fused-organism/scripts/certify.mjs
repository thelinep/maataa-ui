import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inspectBrowserVersion } from "./lib/browser-runtime.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const certDir = path.join(root, "certification");
fs.mkdirSync(certDir, { recursive: true });
const sourcePath = path.join(certDir, "certification.json");
const architecture=JSON.parse(fs.readFileSync(path.join(root,"architecture.json"),"utf8"));

const gates = [
  ["m0-foundation", "npm run gate:m0"],
  ["m2-closeout", "npm run gate:m2-closeout"],
  ["toolchain", "npm run gate:toolchain"],
  ["version-sync", "npm run gate:version-sync"],
  ["drift", "npm run gate:drift"],
  ["visual-policy", "npm run gate:visual-policy"],
  ["registry-bindings", "npm run check:registry-bindings"],
  ["react-policy", "npm run check:react-policy"],
  ["compatibility", "npm run check:compat"],
  ["lint", "npm run lint"],
  ["format", "npm run format:check"],
  ["boundaries", "npm run check:boundaries"],
  ["exports", "npm run check:exports"],
  ["react-adapter", "npm run test:react"],
  ["tests", "npm test"],
  ["build", "npm run build"],
  ["ui-typescript", "npm run check:ui-types"],
  ["ui-lint", "npm run lint:ui"],
  ["ui-format", "npm run format:check:ui"],
  ["ui-vitest", "npm run test:ui"],
  ["ui-product-smoke", "npm run test:ui:smoke"],
  ["fresh-clone", "npm run fresh-clone"],
  ["browser-runtime", "npm run gate:browser-runtime"],
  ["browser-certification", "npm run certify:browser"]
];
const results = [];
let failed = false;
for (const [name, command] of gates) {
  const started = Date.now();
  const result = spawnSync(command, { cwd: root, shell: true, stdio: "inherit" });
  const status = result.status === 0 ? "PASS" : "FAIL";
  results.push({ name, command, status, durationMs: Date.now() - started });
  if (status === "FAIL") { failed = true; break; }
}

async function browserMetadata(){
  try { const b=await inspectBrowserVersion(); return { executable:b.executable, family:b.family, version:b.version, versionText:b.versionText, major:b.major }; }
  catch { return null; }
}

async function writeCertification(status, complete, extraGates = []) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const cert = {
    schemaVersion: 1,
    sourceOfTruth: true,
    product: "MAATAA UI fused organism",
    version: pkg.version,
    generatedAt: new Date().toISOString(),
    status,
    complete,
    packageManager: pkg.packageManager,
    browserRuntime: await browserMetadata(),
    scope: "Fused governed kernel plus @maataa/ui visual package. Certification requires kernel and UI package checks, host dispatch smoke coverage, clean-clone reproducibility, and pinned browser evidence. The UI adapter is a client-side guard; hosts must re-authorize actions on the server.",
    gates: [...results, ...extraGates],
    exclusions: architecture.notCertified ?? []
  };
  fs.writeFileSync(sourcePath, JSON.stringify(cert, null, 2) + "\n");
  spawnSync(process.execPath, [path.join(root, "scripts/generate-certification-report.mjs")], { cwd: root, stdio: "inherit" });
}

if (failed) { await writeCertification("FAIL", true); process.exit(1); }
await writeCertification("PASS", false);
const releaseStarted = Date.now();
const release = spawnSync("npm run release:check", { cwd: root, shell: true, stdio: "inherit" });
const releaseGate = { name: "release", command: "npm run release:check", status: release.status === 0 ? "PASS" : "FAIL", durationMs: Date.now() - releaseStarted };
await writeCertification(releaseGate.status === "PASS" ? "PASS" : "FAIL", true, [releaseGate]);
if (release.status !== 0) process.exit(release.status ?? 1);
console.log("certify PASS; certification/certification.json is the canonical M2 closeout result");
