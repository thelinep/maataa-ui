#!/usr/bin/env node
/**
 * Refresh root's installed copies of the fused-organism packages.
 *
 * With install-links=true, file: dependencies are installed as copies, and
 * npm does not re-copy them when only their contents change (the version in
 * package.json is the same). Removing the copies first makes `npm install`
 * copy the freshly built packages again.
 *
 * This only refreshes installed copies; it never changes dependencies. Newer
 * npm releases than the one CI uses rewrite package-lock.json on install (for
 * example, pruning optional peer entries), which left every branch with an
 * uncommitted lockfile and blocked rebases. So the lockfile is put back
 * byte-for-byte afterwards. To change dependencies on purpose, run
 * `npm install` yourself and commit the lockfile.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scope = join(root, 'node_modules', '@maataa');
const lockfile = join(root, 'package-lock.json');

const lockBefore = existsSync(lockfile) ? readFileSync(lockfile) : null;

if (existsSync(scope)) {
  rmSync(scope, { recursive: true, force: true });
  console.log('fused:sync: removed stale node_modules/@maataa copies');
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['install', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit' });

if (lockBefore && existsSync(lockfile) && !readFileSync(lockfile).equals(lockBefore)) {
  writeFileSync(lockfile, lockBefore);
  console.log('fused:sync: kept package-lock.json unchanged (npm rewrote it; sync does not change dependencies)');
}

process.exit(result.status ?? 1);
