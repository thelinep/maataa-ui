import fs from "node:fs"; import path from "node:path"; import { contracts } from "../definitions/contracts.mjs";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const schemasDir=path.join(root,"schemas"); fs.mkdirSync(schemasDir,{recursive:true}); const contractDir=path.join(root,"contracts"); fs.mkdirSync(contractDir,{recursive:true});
function tsType(s){
  if(s.enum)return s.enum.map(v=>JSON.stringify(v)).join(" | ");
  if(s.type==="string")return "string"; if(s.type==="number"||s.type==="integer")return "number"; if(s.type==="boolean")return "boolean";
  if(s.type==="array")return `Array<${tsType(s.items||{})}>`; if(s.type==="object")return "Record<string, unknown>"; return "unknown";
}
let dts="// GENERATED. DO NOT EDIT.\n";
const embedded={};
for(const c of contracts){
  fs.writeFileSync(path.join(schemasDir,`${c.file}.schema.json`),JSON.stringify(c.schema,null,2)+"\n"); embedded[c.name]=c.schema;
  const req=new Set(c.schema.required||[]); dts+=`export interface ${c.name} {\n`;
  for(const [k,s] of Object.entries(c.schema.properties||{})) dts+=`  ${JSON.stringify(k)}${req.has(k)?"":"?"}: ${tsType(s)};\n`;
  dts+="}\n\n";
}
fs.writeFileSync(path.join(root,"packages/contracts/src/generated.d.ts"),dts);
const runtime=`// GENERATED. DO NOT EDIT.\nexport const schemas = Object.freeze(${JSON.stringify(embedded,null,2)});\n\nfunction typeOk(schema,value){if(schema.enum)return schema.enum.includes(value);if(!schema.type)return true;if(schema.type===\"string\")return typeof value===\"string\";if(schema.type===\"number\"||schema.type===\"integer\")return typeof value===\"number\"&&Number.isFinite(value);if(schema.type===\"boolean\")return typeof value===\"boolean\";if(schema.type===\"array\")return Array.isArray(value)&&value.every(v=>typeOk(schema.items||{},v));if(schema.type===\"object\")return value!==null&&typeof value===\"object\"&&!Array.isArray(value);return true;}\nexport function validateContract(name,value){const s=schemas[name];if(!s)return {ok:false,errors:[\"UNKNOWN_CONTRACT\"]};if(value===null||typeof value!==\"object\"||Array.isArray(value))return {ok:false,errors:[\"OBJECT_REQUIRED\"]};const errors=[];for(const k of s.required||[])if(!(k in value))errors.push(\`REQUIRED:\${k}\`);for(const [k,ps] of Object.entries(s.properties||{}))if(k in value&&!typeOk(ps,value[k]))errors.push(\`TYPE:\${k}\`);if(s.additionalProperties===false)for(const k of Object.keys(value))if(!(k in (s.properties||{})))errors.push(\`ADDITIONAL:\${k}\`);return {ok:errors.length===0,errors};}\nexport function assertContract(name,value){const r=validateContract(name,value);if(!r.ok)throw new Error(\`CONTRACT_INVALID:\${name}:\${r.errors.join(\",\")}\`);return value;}\n`;
fs.writeFileSync(path.join(root,"packages/contracts/src/generated.mjs"),runtime);
const manifest={schemaVersion:1,generated:true,contracts:contracts.map(c=>({name:c.name,file:c.file,version:c.version,id:c.schema.$id,required:[...(c.schema.required||[])].sort(),additionalProperties:c.schema.additionalProperties,properties:c.schema.properties}))};
fs.writeFileSync(path.join(contractDir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
