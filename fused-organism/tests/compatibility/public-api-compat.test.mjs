import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root=path.resolve(new URL("../..",import.meta.url).pathname);
test("INV-008 public API baseline exports remain available",()=>{
  const r=spawnSync(process.execPath,[path.join(root,"scripts/check-api-compat.mjs")],{cwd:root,encoding:"utf8"});
  assert.equal(r.status,0,r.stdout+r.stderr);
});
