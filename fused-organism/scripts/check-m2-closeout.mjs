import fs from "node:fs";
import path from "node:path";
import { createMaataaReact } from "../packages/react/src/index.mjs";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const required=[
  "docs/INVARIANTS.md","docs/REACT-SURFACE.md","docs/GATE-MATRIX.md","docs/VISUAL-REGRESSION.md",
  "docs/CERTIFIED-SURFACES.md","docs/NOT-CERTIFIED.md","docs/M0R-FINDINGS.md","docs/M2-CLOSEOUT.md",
  "docs/adr/ADR-005-CDP-INSTEAD-OF-PLAYWRIGHT-AXE-IN-M2.md","tests/browser/runtime-policy.json"
];
const errors=[];
for(const f of required)if(!fs.existsSync(path.join(root,f)))errors.push(`missing ${f}`);
const arch=JSON.parse(fs.readFileSync(path.join(root,"architecture.json"),"utf8"));
const runtime=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/runtime-policy.json"),"utf8"));
if(arch.invariants?.length!==22)errors.push(`expected 22 invariants, got ${arch.invariants?.length}`);
for(let i=1;i<=22;i++){const id=`INV-${String(i).padStart(3,'0')}`;if(!arch.invariants.some(x=>x.id===id))errors.push(`missing ${id}`);}
if(runtime.exactVersion!=="144.0.7559.96")errors.push("M2 browser version is not pinned to 144.0.7559.96");
if(arch.m0r?.blockingFindingsRemaining!==0)errors.push("M0R still has blocking findings");
const host={createElement(){return{}},useState(v){return[v,()=>{}]},useEffect(){}};
const services={telemetry:{},control:{},approval:{},agent:{},theme:{},toast:{}};
const ui=createMaataaReact(host,services);
for(const name of arch.m2CertifiedSurfaces?.reactNodeCertified?.hooks??[])if(typeof ui[name]!=="function")errors.push(`documented shipped hook missing: ${name}`);
for(const name of arch.m3DeferredReactHooks??[])if(name in ui)errors.push(`M3-deferred hook already exported without M2 documentation update: ${name}`);
const findings=fs.readFileSync(path.join(root,"docs/M0R-FINDINGS.md"),"utf8");
if(!findings.includes("Blocking findings remaining: 0"))errors.push("M0R findings do not declare zero blocking findings");
if(errors.length){console.error("M2 closeout FAIL\n"+errors.join("\n"));process.exit(1);}
console.log("M2 closeout PASS (10 pre-M3 evidence gaps resolved or explicitly deferred)");
