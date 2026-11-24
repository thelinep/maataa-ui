import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Proposed acceptance contract. Missing deliverables intentionally fail.
const root = fileURLToPath(new URL('../../icon-system/', import.meta.url));
const read = name => JSON.parse(readFileSync(resolve(root,name),'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function asset(path) {
  assert.equal(typeof path,'string');
  const target = resolve(root,path);
  assert.ok(target.startsWith(root.endsWith(sep)?root:root+sep),'path escapes root');
  assert.ok(existsSync(target),'missing asset: '+path);
  assert.ok(realpathSync(target).startsWith(realpathSync(root)+sep),'symlink escapes root');
  return readFileSync(target);
}
const unique = (rows,key) => assert.equal(new Set(rows.map(x=>x[key])).size,rows.length,'duplicate '+key);
const files=['source-manifest.json','historical-crosswalk.json','icon-registry.v1.json','artwork-integrity.json','duplicate-review.json','react-packs.registry.json','theme-variants.registry.json'];
for (const name of files) test('required artifact: '+name,()=>assert.ok(existsSync(resolve(root,name)),name+' missing'));
test('source archives: minimum recovered baseline and byte integrity',()=>{
 const {archives}=read('source-manifest.json'); assert.ok(archives.length>=10); unique(archives,'path');
 for(const a of archives){assert.match(a.sha256,/^[a-f0-9]{64}$/);const bytes=asset(a.path);assert.equal(bytes.length,a.bytes);assert.equal(hash(bytes),a.sha256);}
});
test('registry: version, canonical baseline, unique stable IDs and artwork',()=>{
 const r=read('icon-registry.v1.json');assert.equal(r.schemaVersion,1);assert.ok(r.icons.length>=1602);unique(r.icons,'id');
 for(const i of r.icons){assert.ok(i.id && i.domain && i.provenance?.length);assert.match(i.sha256,/^[a-f0-9]{64}$/);assert.equal(hash(asset(i.path)),i.sha256);}
});
test('historical v2 coverage and explicit unresolved records',()=>{
 const {entries}=read('historical-crosswalk.json');const old=entries.filter(e=>e.sourceVersion==='v2');assert.equal(old.length,205);unique(old,'historicalId');
 const ids=new Set(read('icon-registry.v1.json').icons.map(i=>i.id));
 for(const e of entries){assert.ok(e.historicalId && e.sourceVersion && e.evidence?.length);assert.ok(['mapped','alias','unresolved'].includes(e.status));if(e.status==='unresolved'){assert.ok(e.reason);assert.ok(!e.canonicalId);}else assert.ok(ids.has(e.canonicalId));}
 for(const [alias,target] of [['MZ-QUOTE','NE-QUOTE'],['MZ-BOOK','NE-BOOK']]){const e=old.find(x=>x.historicalId===alias);assert.equal(e?.status,'alias');assert.equal(e?.aliasOf,target);}
});
test('artwork audit covers every canonical asset and verifies bytes',()=>{
 const {entries}=read('artwork-integrity.json');unique(entries,'id');const audit=new Map(entries.map(e=>[e.id,e]));
 for(const i of read('icon-registry.v1.json').icons){const e=audit.get(i.id);assert.ok(e,i.id);assert.equal(e.sha256,hash(asset(i.path)));assert.equal(e.status,'verified');}
});
test('duplicate audit: exact duplicate groups are recorded',()=>{
 const groups=new Map();for(const i of read('icon-registry.v1.json').icons){const a=groups.get(i.sha256)||[];a.push(i.id);groups.set(i.sha256,a);}
 const {groups:review}=read('duplicate-review.json');
 for(const [sha,ids] of groups)if(ids.length>1){const g=review.find(x=>x.sha256===sha&&x.kind==='exact');assert.ok(g,sha);assert.deepEqual([...g.ids].sort(),ids.sort());}
 for(const g of review){assert.ok(['exact','structural','visual'].includes(g.kind));assert.ok(['pending','distinct','alias-approved'].includes(g.status));if(g.status==='alias-approved')assert.ok(g.reviewEvidence);}
});
test('React pack inventory preserves 31 original packs',()=>{const {packs}=read('react-packs.registry.json');assert.ok(packs.length>=31);unique(packs,'id');for(const p of packs)assert.ok(p.provenance?.length);});
test('theme variants resolve to canonical artwork',()=>{const {variants}=read('theme-variants.registry.json');assert.ok(variants.length>0);const ids=new Set(read('icon-registry.v1.json').icons.map(i=>i.id));for(const v of variants){assert.ok(ids.has(v.canonicalId));assert.ok(v.theme);assert.equal(hash(asset(v.path)),v.sha256);}});
