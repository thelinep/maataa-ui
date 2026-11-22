import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packagesRoot = path.join(root, "packages");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "maataa-consumers-"));
const cache = path.join(tempRoot, "npm-cache");
const packed = [];

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", env: { ...process.env, npm_config_cache: cache } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(command + " " + args.join(" ") + " failed in " + cwd);
}

function write(directory, filename, contents) {
  const target = path.join(directory, filename);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function packAllPackages() {
  const packages = fs.readdirSync(packagesRoot).sort();
  for (const name of packages) {
    const packageRoot = path.join(packagesRoot, name);
    const manifestPath = path.join(packageRoot, "package.json");
    if (!fs.existsSync(manifestPath)) continue;
    const pack = spawnSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", tempRoot], {
      cwd: packageRoot,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: cache },
    });
    if (pack.status !== 0) throw new Error("npm pack failed for " + packageRoot + "\n" + pack.stderr);
    const result = JSON.parse(pack.stdout);
    const metadata = Array.isArray(result) ? result[0] : Object.values(result)[0];
    if (!metadata?.filename) throw new Error("npm pack returned no filename for " + packageRoot);
    packed.push(path.join(tempRoot, metadata.filename));
  }
}

function installAllPackages(directory) {
  run("npm", [
    "install", "--no-save", "--ignore-scripts", "--no-audit", "--no-fund", "--cache", cache,
    "next@16.4.6", "react@18.3.1", "react-dom@18.3.1", "vite@5.4.21", "@vitejs/plugin-react@4.7.0",
    ...packed,
  ], directory);
}

try {
  packAllPackages();
  const vite = path.join(tempRoot, "vite-consumer");
  write(vite, "package.json", '{"name":"maataa-vite-consumer","version":"1.0.0","private":true,"type":"module"}\n');
  write(vite, "index.html", '<div id="root"></div><script type="module" src="/src/main.jsx"></script>\n');
  write(vite, "vite.config.mjs", "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n");
  write(vite, "src/main.jsx", "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { IconButton } from '@maataa/ui/actions';\nimport { Box } from '@maataa/ui/primitives';\nimport { colorTokens } from '@maataa/tokens';\ncreateRoot(document.getElementById('root')).render(<Box style={{ color: colorTokens.text.primary }}><IconButton icon=\"×\" aria-label=\"Close\" /></Box>);\n");
  installAllPackages(vite);
  run(process.execPath, ["node_modules/vite/bin/vite.js", "build"], vite);

  const next = path.join(tempRoot, "next-consumer");
  write(next, "package.json", '{"name":"maataa-next-consumer","version":"1.0.0","private":true,"type":"module"}\n');
  write(next, "next.config.mjs", "const config = {};\nexport default config;\n");
  write(next, "app/layout.jsx", "import { ThemeStyle, tlpsV2Theme } from '@maataa/ui/theme-style';\nexport default function RootLayout({ children }) { return <html lang=\"en\"><head><ThemeStyle theme={tlpsV2Theme} nonce=\"test-nonce\" /></head><body>{children}</body></html>; }\n");
  write(next, "app/page.jsx", "import { IconButton } from '@maataa/ui/actions';\nimport { Box } from '@maataa/ui/primitives';\nexport default function Page() { return <main><Box><IconButton icon=\"×\" aria-label=\"Close\" /></Box></main>; }\n");
  installAllPackages(next);
  run(process.execPath, ["node_modules/next/dist/bin/next", "build"], next);
  console.log("package consumer checks PASS (21 packed packages; Vite and Next.js production builds)");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
