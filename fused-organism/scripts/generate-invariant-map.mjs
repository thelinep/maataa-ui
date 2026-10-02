import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const arch=JSON.parse(fs.readFileSync(path.join(root,'architecture.json'),'utf8'));
const lines=['# Architecture Invariant → Test Map','',`Generated from \`architecture.json\` for MAATAA UI ${arch.version}. Do not edit manually.`,'','| Invariant | Statement | Named test/check | File |','| --- | --- | --- | --- |'];
for(const inv of arch.invariants??[]) lines.push(`| \`${inv.id}\` | ${inv.statement.replace(/\|/g,'\\|')} | \`${inv.test}\` | \`${inv.file}\` |`);
lines.push('',`Total mapped invariants: **${arch.invariants?.length??0}**.`,'');
fs.writeFileSync(path.join(root,'docs/INVARIANTS.md'),lines.join('\n'));
console.log(`generated docs/INVARIANTS.md (${arch.invariants?.length??0} invariants)`);
