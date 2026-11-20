#!/usr/bin/env node
/**
 * postinstall guard: the app depends on fused-organism packages via file:
 * dependencies. Three of them (@maataa/tokens, @maataa/primitives, @maataa/ui)
 * ship a compiled dist/ that only exists after fused-organism's `build:ui`.
 * Without it the install "succeeds" but every import fails later, so fail
 * here with the fix instead.
 */
import { existsSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const required = ['tokens', 'primitives', 'ui'].map((name) => join(root, 'node_modules', '@maataa', name, 'dist', 'index.js'));
const missing = required.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error('\n✖ fused-organism packages are not built, so @maataa/* would be installed without dist/.');
  console.error('  Missing:\n    ' + missing.map((f) => f.replace(root + '/', '')).join('\n    '));
  console.error('\n  Fix (from the repo root):\n    npm run setup\n');
  console.error('  or step by step:\n    npm run fused:install && npm run fused:build && npm install\n');
  process.exit(1);
}

// file: deps must be installed as copies (.npmrc install-links=true). Symlinks would
// resolve React from fused-organism/node_modules and load a second React.
const linked = ['tokens', 'primitives', 'ui'].filter((name) =>
  lstatSync(join(root, 'node_modules', '@maataa', name)).isSymbolicLink()
);
if (linked.length > 0) {
  console.error(`\n✖ @maataa/${linked.join(', @maataa/')} installed as symlinks; this would load two copies of React.`);
  console.error('  The repo .npmrc must contain `install-links=true`. Restore it, then run:\n    npm install\n');
  process.exit(1);
}
