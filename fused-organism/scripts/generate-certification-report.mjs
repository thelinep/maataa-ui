import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sourcePath = path.join(root, "certification", "certification.json");
if (!fs.existsSync(sourcePath)) {
  console.error("certification/certification.json is missing; run npm run certify first");
  process.exit(1);
}
const cert = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const lines = [
  "# Certification Report",
  "",
  "> GENERATED from `certification/certification.json`. Do not edit this report manually.",
  "",
  `Version: **${cert.version}**`,
  `Status: **${cert.status}**`,
  `Generated: ${cert.generatedAt}`,
  ...(cert.browserRuntime ? [`Browser: **${cert.browserRuntime.family ?? "unknown"} ${cert.browserRuntime.version ?? cert.browserRuntime.versionText ?? "unknown"}**`] : []),
  "",
  ...(cert.currentFusionChecks ? ["## Fresh fused-product checks", ""] : []),
  ...((cert.currentFusionChecks ?? []).map((check) => `- **${check.name}** — ${check.status}${check.note ? ` — ${check.note}` : ""}`)),
  ...(cert.currentFusionChecks ? ["", "## Historical kernel-only gates (not fresh evidence for this product)", ""] : ["## Gates", ""]),
  ""
];
for (const gate of cert.gates) lines.push(`- **${gate.name}** — ${gate.status} — \`${gate.command}\``);
lines.push("", "## Scope", "", cert.scope, "", "## Explicit exclusions", "");
for (const exclusion of cert.exclusions ?? []) lines.push(`- ${exclusion}`);
lines.push("");
fs.writeFileSync(path.join(root, "certification", "REPORT.md"), lines.join("\n"));
console.log("certification/REPORT.md generated from certification/certification.json");
