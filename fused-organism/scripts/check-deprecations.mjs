import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const data=JSON.parse(fs.readFileSync(path.join(root,"compatibility/deprecations.json"),"utf8"));
const errors=[];
if(!Array.isArray(data.deprecations)) errors.push("deprecations must be an array");
for(const [i,d] of (data.deprecations??[]).entries()){
  for(const key of ["kind","id","deprecatedIn","removalTarget","replacement","reason"]) if(typeof d[key]!=="string"||!d[key]) errors.push(`deprecations[${i}].${key} required`);
  if(!["contract","export","component"].includes(d.kind)) errors.push(`deprecations[${i}].kind invalid`);
}
if(errors.length){console.error("deprecation metadata FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`deprecation metadata PASS (${data.deprecations.length} active deprecations)`);
