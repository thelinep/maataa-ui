import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const baseline = JSON.parse(fs.readFileSync(path.join(root,"compatibility/contracts.v1.json"),"utf8"));
const current = JSON.parse(fs.readFileSync(path.join(root,"contracts/manifest.json"),"utf8"));
const byName = new Map(current.contracts.map(c => [c.name,c]));
const canonical = value => JSON.stringify(value, Object.keys(value ?? {}).sort());

const errors=[];
for (const frozen of baseline.contracts) {
  const now=byName.get(frozen.name);
  if(!now){errors.push(`removed contract ${frozen.name}`);continue;}
  if(now.id!==frozen.id) errors.push(`${frozen.name} changed $id`);
  if(now.version!==frozen.version) errors.push(`${frozen.name} changed frozen v1 version ${frozen.version} -> ${now.version}; add a new version instead`);
  if(now.additionalProperties!==frozen.additionalProperties) errors.push(`${frozen.name} changed additionalProperties`);
  if(JSON.stringify([...now.required].sort())!==JSON.stringify([...frozen.required].sort())) errors.push(`${frozen.name} changed required fields`);
  const frozenKeys=Object.keys(frozen.properties).sort();
  const nowKeys=Object.keys(now.properties).sort();
  if(JSON.stringify(frozenKeys)!==JSON.stringify(nowKeys)) errors.push(`${frozen.name} changed property set; frozen v1 contracts require a new contract version for shape changes`);
  for(const key of frozenKeys){
    if(!(key in now.properties)) continue;
    const strip = s => ({type:s.type??null,enum:s.enum??null,items:s.items?strip(s.items):null,additionalProperties:s.additionalProperties??null,required:s.required?[...s.required].sort():null,properties:s.properties?Object.fromEntries(Object.entries(s.properties).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,strip(v)])):null});
    if(JSON.stringify(strip(now.properties[key]))!==JSON.stringify(strip(frozen.properties[key]))) errors.push(`${frozen.name}.${key} changed schema signature`);
  }
}
if(errors.length){console.error("contract compatibility FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`contract compatibility PASS (${baseline.contracts.length} frozen v1 contracts)`);
