import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
const packages = [
  "tokens",
  "primitives",
  "maataa-ui",
  "domain-primitives",
  "workflow-primitives",
  "evidence-primitives",
  "generative-primitives",
  "composites",
  "templates",
];

function makeRelativeImportsNodeCompatible(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      makeRelativeImportsNodeCompatible(filename);
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;

    const source = fs.readFileSync(filename, "utf8");
    const output = source.replace(/(["'])(\.\.?\/[^"']+)\1/g, (match, quote, specifier) => {
      if (path.extname(specifier)) return match;
      const target = path.resolve(path.dirname(filename), specifier);
      if (fs.existsSync(`${target}.js`)) return `${quote}${specifier}.js${quote}`;
      if (fs.existsSync(path.join(target, "index.js"))) {
        return `${quote}${specifier}/index.js${quote}`;
      }
      return match;
    });
    if (output !== source) fs.writeFileSync(filename, output);
  }
}

if (!fs.existsSync(tsc)) {
  console.error("build: TypeScript is unavailable; install the fused workspace dependencies first");
  process.exit(1);
}

for (const packageDirectory of packages) {
  const packageRoot = path.join(root, "packages", packageDirectory);
  const manifestPath = path.join(packageRoot, "package.json");
  const projectPath = path.join(packageRoot, "tsconfig.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const compile = spawnSync(process.execPath, [tsc, "--project", projectPath], {
    cwd: root,
    stdio: "inherit",
  });

  if (compile.error) throw compile.error;
  if (compile.status !== 0) process.exit(compile.status ?? 1);

  makeRelativeImportsNodeCompatible(path.join(packageRoot, "dist"));
  const entry = path.join(packageRoot, "dist", "index.js");
  if (!fs.existsSync(entry) || !fs.existsSync(path.join(packageRoot, "dist", "index.d.ts"))) {
    console.error(`build: ${manifest.name} did not emit its declared entry points`);
    process.exit(1);
  }
}

console.log(`build PASS: ${packages.length} canonical UI and TLPS packages`);
