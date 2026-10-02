import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";
const root=path.resolve(new URL("../..",import.meta.url).pathname);
test("@maataa/react declares React as optional host peer, not runtime dependency",()=>{const p=JSON.parse(fs.readFileSync(path.join(root,"packages/react/package.json"),"utf8"));assert.equal(p.dependencies?.react,undefined);assert.equal(p.peerDependencies?.react,">=18.2.0 <20");assert.equal(p.peerDependenciesMeta?.react?.optional,true);assert.equal(p.maataaPolicy.classification,"host-provided-peer");});
