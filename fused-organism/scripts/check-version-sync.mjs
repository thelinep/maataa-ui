import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
const readJson=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const rootPkg=readJson("package.json");
const expected=rootPkg.version;
const errors=[];
for(const parent of ["packages","apps"]){
  const dir=path.join(root,parent);
  for(const name of fs.readdirSync(dir)){
    const p=path.join(dir,name,"package.json"); if(!fs.existsSync(p)) continue;
    const pkg=JSON.parse(fs.readFileSync(p,"utf8"));
    if(pkg.maataaPolicy?.versioning === "independent") continue;
    if(pkg.version!==expected) errors.push(`${pkg.name} version ${pkg.version} != root ${expected}`);
  }
}
const lock=readJson("package-lock.json");
if(lock.version!==expected||lock.packages?.[""]?.version!==expected) errors.push("package-lock root version mismatch");
const api=readJson("api/public-api.json");
if(api.productVersion!==expected) errors.push(`api manifest productVersion ${api.productVersion} != ${expected}`);
const registry=readJson("registry/components.registry.json");
if(registry.version!==expected) errors.push(`registry version ${registry.version} != ${expected}`);
const architecture=readJson("architecture.json");
if(architecture.version!==expected) errors.push(`architecture version ${architecture.version} != ${expected}`);
if(errors.length){console.error("version sync FAIL\n"+errors.join("\n"));process.exit(1);}
console.log(`version sync PASS (${expected}; root/kernel workspaces/lock/API/registry/architecture; independent packages version separately)`);
