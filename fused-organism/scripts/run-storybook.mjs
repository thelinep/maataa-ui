import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repoRoot, 'packages', 'maataa-ui');
const workspaceModules = path.join(packageRoot, 'node_modules');
const storybookCli = path.join(repoRoot, 'node_modules', 'storybook', 'bin', 'index.cjs');
const nodePath = [workspaceModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
const result = spawnSync(process.execPath, [storybookCli, ...process.argv.slice(2)], {
  cwd: packageRoot,
  env: { ...process.env, NODE_PATH: nodePath },
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
