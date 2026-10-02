import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";import {pathToFileURL} from "node:url";
const root=path.resolve(new URL("../..",import.meta.url).pathname);
const reg=JSON.parse(fs.readFileSync(path.join(root,"registry/components.registry.json"),"utf8"));
test("every frozen registry entry has an explicit resolvable headless binding",async()=>{
 const dirs=new Map();for(const dir of fs.readdirSync(path.join(root,"packages"))){const p=path.join(root,"packages",dir,"package.json");if(fs.existsSync(p)){const pkg=JSON.parse(fs.readFileSync(p,"utf8"));dirs.set(pkg.name,{dir,pkg});}}
 const cache=new Map();
 for(const e of reg.components){assert.equal(e.implementationStatus,"headless-bound",e.componentId);assert.equal(e.binding?.kind,"headless-factory",e.componentId);const info=dirs.get(e.binding.package);assert.ok(info,`${e.componentId}: package`);if(!cache.has(info.dir)){const target=typeof info.pkg.exports["."]==="string"?info.pkg.exports["."]:info.pkg.exports["."].import;cache.set(info.dir,await import(pathToFileURL(path.join(root,"packages",info.dir,target)).href+`?t=${Date.now()}_${info.dir}`));}const mod=cache.get(info.dir);assert.equal(typeof mod[e.binding.export],"function",`${e.componentId}: export`);const value=mod[e.binding.export](e.componentId,{});assert.equal(value.componentId,e.componentId);}
});
