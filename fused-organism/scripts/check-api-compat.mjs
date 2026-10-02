import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const baseline=JSON.parse(fs.readFileSync(path.join(root,"compatibility/public-api.v1.json"),"utf8"));
const current=JSON.parse(fs.readFileSync(path.join(root,"api/public-api.json"),"utf8"));
const byName=new Map(current.packages.map(p=>[p.name,p]));
const errors=[];
for(const frozen of baseline.packages){
  const now=byName.get(frozen.name);
  if(!now){errors.push(`removed package ${frozen.name}`);continue;}
  const exports=new Set(now.namedExports);
  for(const name of frozen.namedExports) if(!exports.has(name)) errors.push(`${frozen.name} removed public export ${name}`);
}
if(errors.length){console.error("public API compatibility FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`public API compatibility PASS (${baseline.packages.length} package baselines)`);
