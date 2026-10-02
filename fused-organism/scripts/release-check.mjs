import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const required = [
  "README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md", "GOVERNANCE.md", "CHANGELOG.md", "ROADMAP.md",
  "BOUNDARIES.json", "package-lock.json", "certification/certification.json", "registry/components.registry.json",
  "contracts/manifest.json", "api/public-api.json", "compatibility/contracts.v1.json", "compatibility/public-api.v1.json", "compatibility/registry.v1.json", "compatibility/deprecations.json",
  "docs/M2-COMPLETION.md", "docs/M2-CLOSEOUT.md", "docs/M0R-FINDINGS.md", "docs/BROWSER-CERTIFICATION.md", "docs/REACT-CERTIFICATION.md",
  "docs/INVARIANTS.md", "docs/REACT-SURFACE.md", "docs/GATE-MATRIX.md", "docs/VISUAL-REGRESSION.md", "docs/CERTIFIED-SURFACES.md", "docs/NOT-CERTIFIED.md",
  "docs/adr/ADR-005-CDP-INSTEAD-OF-PLAYWRIGHT-AXE-IN-M2.md", "tests/browser/runtime-policy.json",
  "tests/browser/baselines/semantic-desktop.png", "tests/browser/baselines/semantic-mobile.png", "tests/browser/baselines/manifest.json"
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) { console.error("release missing:", missing.join(", ")); process.exit(1); }
if (["pnpm-workspace.yaml","turbo.json","nx.json","lerna.json"].some(f=>fs.existsSync(path.join(root,f)))) { console.error("release tree contains non-canonical workspace tooling"); process.exit(1); }
for (const command of ["npm run gate:m0","npm run gate:m2-closeout","npm run gate:version-sync","npm run gate:visual-policy","npm run check:registry-bindings","npm run check:react-policy","npm run gate:browser-runtime"]) {
  const g=spawnSync(command,{cwd:root,shell:true,stdio:"inherit"}); if(g.status!==0){console.error(`release prerequisite failed: ${command}`);process.exit(g.status??1);}
}
const compat = spawnSync("npm run check:compat", { cwd: root, shell: true, stdio: "inherit" });
if (compat.status !== 0) { console.error("release compatibility gate failed"); process.exit(compat.status ?? 1); }
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const cert = JSON.parse(fs.readFileSync(path.join(root, "certification/certification.json"), "utf8"));
if (cert.status !== "PASS") { console.error("canonical certification is not PASS"); process.exit(1); }
if (cert.version !== pkg.version) { console.error(`certification version ${cert.version} does not match package version ${pkg.version}`); process.exit(1); }
for(const name of ["m2-closeout","visual-policy","browser-runtime","browser-certification","react-adapter","ui-typescript","ui-lint","ui-format","ui-vitest","ui-product-smoke"]){const gate=cert.gates?.find(g=>g.name===name);if(!gate||gate.status!=="PASS"){console.error(`required fused-product certification gate missing or not PASS: ${name}`);process.exit(1);}}
console.log("release:check PASS (M0R + M1 compatibility + M2 closeout/browser/React evidence present; external publication remains disabled)");
