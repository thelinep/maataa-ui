import test from "node:test";import assert from "node:assert/strict";import {createCommand,transition,isTerminal,acquireLease,renewLease,revokeLease,evaluateSafety} from "../../packages/control/src/index.mjs";
const base=()=>createCommand({commandId:"c1",deviceId:"cam-1",capability:"camera.ptz",idempotencyKey:"i1",issuedAt:"2026-01-01T00:00:00Z",payload:{}});
test("happy path reaches verified",()=>{let c=base();for(const s of ["validated","authorized","queued","dispatched","acknowledged","completed","verified"])c=transition(c,s);assert.equal(c.status,"verified");assert.equal(isTerminal(c),true);});
test("invalid transition is rejected",()=>assert.throws(()=>transition(base(),"verified"),/INVALID_TRANSITION/));
test("lease can renew and revoke",()=>{const l=acquireLease({leaseId:"l",resourceId:"cam-1",holderRef:"op",now:0,ttlMs:100});assert.equal(renewLease(l,200,0).status,"active");assert.equal(revokeLease(l).status,"revoked");});
test("active interlock blocks command",()=>{const c=base(),l=acquireLease({leaseId:"l",resourceId:"cam-1",holderRef:"op"});assert.equal(evaluateSafety({interlocks:[{active:true}],lease:l,command:c}).allow,false);});
