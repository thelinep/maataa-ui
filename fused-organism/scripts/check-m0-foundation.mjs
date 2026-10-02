import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const required=[
  "package.json","package-lock.json","architecture.json","BOUNDARIES.json","README.md","LICENSE","CONTRIBUTING.md","SECURITY.md","GOVERNANCE.md","RELEASE.md",
  "docs/M0-FOUNDATION-AUDIT.md","docs/M0R-FINDINGS.md","docs/adr/ADR-001-CONTRACT-AND-PLATFORM-VERSIONING.md","docs/adr/ADR-002-RUNTIME-DEPENDENCY-POLICY.md"
];
const errors=[];
for(const f of required) if(!fs.existsSync(path.join(root,f))) errors.push(`missing ${f}`);
for(const forbidden of ["pnpm-workspace.yaml","turbo.json","nx.json","lerna.json"]) if(fs.existsSync(path.join(root,forbidden))) errors.push(`non-canonical tool ${forbidden}`);
const arch=JSON.parse(fs.readFileSync(path.join(root,"architecture.json"),"utf8"));
if(arch.milestones?.M0R?.status!=="COMPLETE_RETROSPECTIVE") errors.push("M0R milestone not explicitly complete-retrospective");
if(arch.activePackages?.length!==11) errors.push(`active package count ${arch.activePackages?.length} != 11`);
if(arch.m0r?.blockingFindingsRemaining!==0) errors.push(`M0R blocking findings remain: ${arch.m0r?.blockingFindingsRemaining ?? "unreported"}`);
const findingsPath=path.join(root,"docs/M0R-FINDINGS.md");
if(fs.existsSync(findingsPath)&&!fs.readFileSync(findingsPath,"utf8").includes("Blocking findings remaining: 0"))errors.push("M0R findings do not record zero blockers");
if(errors.length){console.error("M0 foundation audit FAIL\n"+errors.join("\n"));process.exit(1);}
console.log("M0 foundation audit PASS (retrospective; zero blocking findings; deferred items explicitly published)");
