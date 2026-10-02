import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const arch=JSON.parse(fs.readFileSync(path.join(root,'architecture.json'),'utf8'));
const s=arch.m2CertifiedSurfaces;
let lines=['# M2 Certified Surfaces','',`Generated from \`architecture.json\` for MAATAA UI ${arch.version}. Do not edit manually.`,'','## React adapter — Node-certified exports',''];
lines.push('**Constants:** '+s.reactNodeCertified.constants.map(x=>`\`${x}\``).join(', '));
lines.push('','**Functions:** '+s.reactNodeCertified.functions.map(x=>`\`${x}\``).join(', '));
lines.push('','**Primitives:** '+s.reactNodeCertified.primitives.map(x=>`\`${x}\``).join(', '));
lines.push('','**Hooks shipped in M2:** '+s.reactNodeCertified.hooks.map(x=>`\`${x}\``).join(', '));
lines.push('','## Real-browser-certified React primitives','',s.reactBrowserCertified.primitives.map(x=>`- \`${x}\``).join('\n'));
lines.push('','## Real-browser-certified behaviours','',s.reactBrowserCertified.behaviours.map(x=>`- ${x}`).join('\n'));
lines.push('','## Visual-regression-certified semantic states','',s.reactBrowserCertified.visualStates.map(x=>`- \`${x}\``).join('\n'));
lines.push('','## Fixture-only surfaces','', 'These are used to certify browser mechanics but are **not exports of `@maataa/react`**:', '', s.fixtureOnlyNotReactExports.map(x=>`- ${x}`).join('\n'), '');
fs.writeFileSync(path.join(root,'docs/CERTIFIED-SURFACES.md'),lines.join('\n'));

lines=['# React Surface — M2 shipped vs M3 deferred','',`Generated from \`architecture.json\` for MAATAA UI ${arch.version}. Do not edit manually.`,'','## Shipped and certified in M2','',s.reactNodeCertified.hooks.map(x=>`- \`${x}\``).join('\n'),'','## Deferred to M3 integration lane','',arch.m3DeferredReactHooks.map(x=>`- \`${x}\``).join('\n'),'','The deferred hooks are **not part of the 0.4.1 public API** and carry no compatibility promise until implemented, exported, and tested. They remain generic `@maataa/react` candidates; M3 camera work is the first integration pressure that may require them.',''];
fs.writeFileSync(path.join(root,'docs/REACT-SURFACE.md'),lines.join('\n'));

lines=['# Explicitly Not Certified','',`Generated from \`architecture.json\` for MAATAA UI ${arch.version}. Do not edit manually.`,''];
for(const item of arch.notCertified??[]) lines.push(`- ${item}`);
lines.push('');
fs.writeFileSync(path.join(root,'docs/NOT-CERTIFIED.md'),lines.join('\n'));
console.log('generated certified surface, React surface, and exclusions docs');
