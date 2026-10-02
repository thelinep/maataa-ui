import test from "node:test";import assert from "node:assert/strict";import {schemas,validateContract} from "../../packages/contracts/src/index.mjs";
test("generated contract inventory is substantive",()=>assert.ok(Object.keys(schemas).length>=20));
test("Recommendation requires id and summary",()=>{assert.equal(validateContract("Recommendation",{id:"r1",summary:"x"}).ok,true);assert.equal(validateContract("Recommendation",{id:"r1"}).ok,false);});
test("ControlCommand rejects unknown fields",()=>{const v={commandId:"c",deviceId:"d",capability:"x",status:"requested",idempotencyKey:"i",issuedAt:"t",surprise:true};assert.ok(validateContract("ControlCommand",v).errors.some(e=>e==="ADDITIONAL:surprise"));});
