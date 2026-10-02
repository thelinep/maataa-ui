import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const baseline=JSON.parse(fs.readFileSync(path.join(root,"compatibility/registry.v1.json"),"utf8"));
const current=JSON.parse(fs.readFileSync(path.join(root,"registry/components.registry.json"),"utf8"));
const byId=new Map(current.components.map(c=>[c.componentId,c]));
const errors=[];
for(const frozen of baseline.components){
  const now=byId.get(frozen.componentId);
  if(!now){errors.push(`removed component ${frozen.componentId}`);continue;}
  for(const key of ["version","package","category","authorityClass","headless","schemaRef","a11yRole","implementationStatus","binding"]){
    const a=now[key]??null,b=frozen[key]??null;
    if(JSON.stringify(a)!==JSON.stringify(b)) errors.push(`${frozen.componentId} changed frozen ${key}: ${JSON.stringify(b)} -> ${JSON.stringify(a)}`);
  }
  const nowStates=new Set(now.states??[]);
  for(const state of frozen.states??[]) if(!nowStates.has(state)) errors.push(`${frozen.componentId} removed supported state ${state}`);
}
if(errors.length){console.error("registry compatibility FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`registry compatibility PASS (${baseline.components.length} frozen component entries with explicit bindings)`);
