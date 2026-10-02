import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const reg=JSON.parse(fs.readFileSync(path.join(root,"registry/components.registry.json"),"utf8"));
const packageDir=new Map();
for(const dir of fs.readdirSync(path.join(root,"packages"))){const p=path.join(root,"packages",dir,"package.json");if(fs.existsSync(p)){const pkg=JSON.parse(fs.readFileSync(p,"utf8"));packageDir.set(pkg.name,dir);}}
const errors=[]; const modules=new Map();
for(const e of reg.components){
  if(e.implementationStatus!=="headless-bound") {errors.push(`${e.componentId} implementationStatus=${e.implementationStatus}`);continue;}
  const b=e.binding; if(!b||b.kind!=="headless-factory"||b.componentId!==e.componentId){errors.push(`${e.componentId} invalid binding metadata`);continue;}
  const dir=packageDir.get(b.package); if(!dir){errors.push(`${e.componentId} binding package missing ${b.package}`);continue;}
  if(!modules.has(dir)){const pkg=JSON.parse(fs.readFileSync(path.join(root,"packages",dir,"package.json"),"utf8"));const target=typeof pkg.exports?.["."]==="string"?pkg.exports["."]:pkg.exports?.["."]?.import; modules.set(dir,await import(pathToFileURL(path.join(root,"packages",dir,target)).href+`?bind=${Date.now()}_${dir}`));}
  const mod=modules.get(dir); if(typeof mod[b.export]!=="function"){errors.push(`${e.componentId} missing export ${b.package}#${b.export}`);continue;}
  try{const result=mod[b.export](b.componentId,{});if(result?.componentId!==e.componentId) errors.push(`${e.componentId} factory did not resolve itself`);}catch(err){errors.push(`${e.componentId} binding invocation failed: ${err.message}`);}
}
if(errors.length){console.error("registry binding FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`registry binding PASS (${reg.components.length} entries; all explicitly headless-bound and resolvable)`);
