import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const apiDir = path.join(root, "api");
fs.mkdirSync(apiDir, { recursive: true });

const packages = [];
for (const dir of fs.readdirSync(path.join(root, "packages")).sort()) {
  const pkgPath = path.join(root, "packages", dir, "package.json");
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.maataaPolicy?.apiManifest === "separate-typescript-package") continue;
  const rootExport = pkg.exports?.["."];
  const target = typeof rootExport === "string" ? rootExport : rootExport?.import;
  if (!target) throw new Error(`PUBLIC_EXPORT_REQUIRED:${pkg.name}`);
  const entry = path.join(root, "packages", dir, target);
  const mod = await import(`${pathToFileURL(entry).href}?maataa_api_manifest=${Date.now()}_${dir}`);
  packages.push({
    name: pkg.name,
    version: pkg.version,
    entry: target,
    namedExports: Object.keys(mod).sort()
  });
}
const manifest = { schemaVersion: 1, generated: true, productVersion: JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8")).version, packages };
fs.writeFileSync(path.join(apiDir, "public-api.json"), JSON.stringify(manifest, null, 2) + "\n");

let md = "# MAATAA Kernel Public API\n\nGenerated from the 11 certified kernel package entry points. The separate TypeScript React product package maintains its own export map. Do not edit manually.\n\n";
for (const pkg of packages) {
  md += `## \`${pkg.name}\`\n\n`;
  md += `Entry: \`${pkg.entry}\`\n\n`;
  md += pkg.namedExports.length ? pkg.namedExports.map((name) => `- \`${name}\``).join("\n") + "\n\n" : "_No named exports._\n\n";
}
fs.writeFileSync(path.join(apiDir, "PUBLIC-API.md"), md);
console.log(`generated public API manifest for ${packages.length} packages`);
