import test from "node:test";
import assert from "node:assert/strict";
import { createCommand,transition,acquireLease,executeGovernedCommand } from "../../packages/control/src/index.mjs";
import { createCameraSimulatorAdapter } from "../../packages/adapter-sdk/src/index.mjs";

function command(id="c") { return createCommand({commandId:id,deviceId:"cam-1",capability:"camera.ptz",payload:{pan:9},idempotencyKey:`idem:${id}`,issuedAt:"2026-01-01T00:00:00Z"}); }
function toDispatched(c){for(const s of ["validated","authorized","queued","dispatched"])c=transition(c,s);return c;}

test("INV-010 terminal control states cannot transition back to active states",()=>{
  for(const terminal of ["verified","denied","nack","cancelled","timed_out","failed","verification_failed"]){
    let c=command(terminal);
    if(terminal==="denied"){c=transition(c,"denied");}
    else if(terminal==="cancelled"){c=transition(transition(c,"validated"),"cancelled");}
    else if(["nack","timed_out","failed"].includes(terminal)){c=transition(toDispatched(c),terminal);}
    else {c=toDispatched(c);c=transition(c,"acknowledged");c=transition(c,"completed");c=transition(c,terminal);}
    assert.throws(()=>transition(c,"requested"),/INVALID_TRANSITION/);
  }
});

test("INV-011 NACK cannot transition to verified",()=>{const c=transition(toDispatched(command("nack")),"nack");assert.throws(()=>transition(c,"verified"),/INVALID_TRANSITION/);});
test("INV-012 cancelled commands cannot transition to completed",()=>{let c=transition(command("cancel"),"validated");c=transition(c,"cancelled");assert.throws(()=>transition(c,"completed"),/INVALID_TRANSITION/);});

test("INV-013 expired lease cannot authorize dispatch",async()=>{
  const adapter=createCameraSimulatorAdapter();await adapter.connect();
  const lease=acquireLease({leaseId:"lease-expired",resourceId:"cam-1",holderRef:"operator",now:0,ttlMs:1});
  const r=await executeGovernedCommand({input:{commandId:"expired",deviceId:"cam-1",capability:"camera.ptz",payload:{pan:1},idempotencyKey:"expired",issuedAt:"2026-01-01T00:00:00Z"},policyDecision:{id:"p",outcome:"allow",reasonCodes:[]},approvals:[],lease,adapter,verify:()=>true});
  assert.equal(r.command.status,"denied");
});

test("INV-014 verification result is derived from observed state, not ACK payload",async()=>{
  const adapter=createCameraSimulatorAdapter({pan:0,tilt:0,zoom:1,streamState:"streaming"});await adapter.connect();
  const r=await executeGovernedCommand({input:{commandId:"verify-observed",deviceId:"cam-1",capability:"camera.ptz",payload:{pan:12},idempotencyKey:"verify-observed",issuedAt:new Date().toISOString()},policyDecision:{id:"p",outcome:"allow",reasonCodes:[]},approvals:[],lease:acquireLease({leaseId:"l",resourceId:"cam-1",holderRef:"operator"}),adapter,verify:({observedState})=>observedState.pan===999});
  assert.equal(r.receipt.acknowledged,true);
  assert.equal(r.receipt.verified,false);
  assert.equal(r.command.status,"verification_failed");
});
