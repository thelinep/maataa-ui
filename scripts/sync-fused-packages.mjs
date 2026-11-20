#!/usr/bin/env node
/**
 * Refresh root's installed copies of the fused-organism packages.
 *
 * With install-links=true, file: dependencies are installed as copies, and
 * npm does not re-copy them when only their contents change (the version in
 * package.json is the same). Removing the copies first makes `npm install`
 * copy the freshly built packages again.
 */
import { rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scope = join(root, 'node_modules', '@maataa');

if (existsSync(scope)) {
  rmSync(scope, { recursive: true, force: true });
  console.log('fused:sync: removed stale node_modules/@maataa copies');
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['install', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit' });
process.exit(result.status ?? 1);
