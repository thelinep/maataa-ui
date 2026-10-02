import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const runtime=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/runtime-policy.json"),"utf8"));
const manifest=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/baselines/manifest.json"),"utf8"));
const errors=[];
if(manifest.browser?.family!==runtime.browserFamily)errors.push("baseline browser family does not match runtime policy");
if(manifest.browser?.exactVersion!==runtime.exactVersion)errors.push("baseline browser version does not match pinned runtime");
if(manifest.deviceScaleFactor!==runtime.deviceScaleFactor)errors.push("baseline DPR does not match runtime policy");
if(manifest.comparison?.channelTolerance!==10)errors.push("channelTolerance must remain 10 for M2 closeout");
if(manifest.comparison?.maxPixelRatio!==0.003)errors.push("maxPixelRatio must remain 0.003 for M2 closeout");
if(manifest.updatePolicy?.certificationMayUpdate!==false)errors.push("certification must not update baselines");
for(const b of manifest.baselines??[])if(!fs.existsSync(path.join(root,"tests/browser/baselines",b.name)))errors.push(`missing baseline ${b.name}`);
if(errors.length){console.error("visual policy FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`visual policy PASS (${runtime.browserFamily} ${runtime.exactVersion}; DPR ${runtime.deviceScaleFactor}; tolerance 10; max ratio 0.003)`);
