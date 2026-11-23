import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packageRoot = path.join(root, "packages", "maataa-ui");
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
const currentApi = JSON.parse(fs.readFileSync(path.join(root, "api", "public-api.json"), "utf8"));
const stableCoreExports = [
  "AspectRatio", "Badge", "Box", "Button", "Card", "Container", "Divider", "FieldContext",
  "Flex", "Grid", "Input", "Portal", "ScrollArea", "Spacer", "Stack", "VisuallyHidden",
  "primitiveComponents", "useField",
];
const experimentalDomainFiles = [
  "LogisticsComposites.js", "FinanceComposites.js", "CultureComposites.js", "Web3.js",
];
const experimentalDomainExports = new Set();

for (const filename of experimentalDomainFiles) {
  const modulePath = path.join(packageRoot, "dist", "data", filename);
  const module = await import(pathToFileURL(modulePath).href);
  Object.keys(module).forEach((name) => experimentalDomainExports.add(name));
}

function statusFor(packageName, entry, name) {
  if (packageName === "@maataa/primitives") return "stable";
  if (packageName === "@maataa/ui" && [".", "./primitives"].includes(entry) && stableCoreExports.includes(name)) return "stable";
  if (packageName.startsWith("@tlps/") || (packageName === "@maataa/ui" && entry === "./maps")) return "experimental";
  if (packageName === "@maataa/ui" && experimentalDomainExports.has(name)) return "experimental";
  return "beta";
}

const uiEntries = [];
for (const [entryName, entryValue] of Object.entries(packageJson.exports)) {
  const target = typeof entryValue === "string" ? entryValue : entryValue.default ?? entryValue.import;
  if (!target) throw new Error("PUBLIC_UI_EXPORT_TARGET_REQUIRED:" + entryName);
  const modulePath = path.resolve(packageRoot, target);
  const module = await import(pathToFileURL(modulePath).href);
  const exports = Object.keys(module).sort().map((name) => ({
    name,
    stability: statusFor("@maataa/ui", entryName, name),
  }));
  uiEntries.push({ entry: entryName, target, exports });
}

for (const entry of uiEntries) {
  if ([".", "./primitives"].includes(entry.entry)) {
    const names = new Set(entry.exports.map((item) => item.name));
    const missing = stableCoreExports.filter((name) => !names.has(name));
    if (missing.length) throw new Error("STABLE_UI_EXPORT_MISSING:" + entry.entry + ":" + missing.join(","));
  }
}

const kernelPackages = currentApi.packages.map((pkg) => ({
  name: pkg.name,
  version: pkg.version,
  exports: pkg.namedExports.map((name) => ({ name, stability: statusFor(pkg.name, ".", name) })),
}));
const stableSet = [
  ...stableCoreExports.map((name) => ({ package: "@maataa/primitives", entry: ".", name })),
  ...stableCoreExports.flatMap((name) => [
    { package: "@maataa/ui", entry: ".", name },
    { package: "@maataa/ui", entry: "./primitives", name },
  ]),
];
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry", "components.registry.json"), "utf8"));
const componentStability = {
  schemaVersion: 1,
  generated: true,
  package: "@maataa/ui and fused packages",
  uiPackageVersion: packageJson.version,
  productVersion: currentApi.productVersion,
  classification: {
    stable: "Only the explicitly listed @maataa/primitives exports and their @maataa/ui aliases are covered by the 1.0 semver promise.",
    beta: "Other MAATAA exports remain beta unless explicitly classified as experimental.",
    experimental: "All @tlps/* package exports, the @maataa/ui/maps entry, and Web3, finance, logistics, and culture domain composites are experimental.",
  },
  stableSet,
  packages: kernelPackages,
  uiEntries,
  registryComponents: registry.components.map((component) => ({
    componentId: component.componentId,
    package: component.package,
    stability: statusFor(component.package, ".", component.componentId),
  })),
};
const uiApi = {
  schemaVersion: 1,
  generated: true,
  package: packageJson.name,
  version: packageJson.version,
  entries: uiEntries,
};

const apiDir = path.join(root, "api");
fs.writeFileSync(path.join(apiDir, "component-stability.json"), JSON.stringify(componentStability, null, 2) + "\n");
fs.writeFileSync(path.join(apiDir, "ui-public-api.json"), JSON.stringify(uiApi, null, 2) + "\n");

let md = "# MAATAA UI Public API and Stability\n\nGenerated from every @maataa/ui package export. The 1.0 semver promise covers only the explicitly listed core primitive exports. Do not edit manually.\n\n";
for (const entry of uiEntries) {
  md += "## " + entry.entry + "\n\n";
  md += entry.exports.map((item) => "- " + item.name + " — " + item.stability).join("\n") + "\n\n";
}
md += "## Stable 1.0 exports\n\n";
md += stableCoreExports.map((name) => "- @maataa/primitives / @maataa/ui/primitives / @maataa/ui: " + name).join("\n") + "\n";
fs.writeFileSync(path.join(apiDir, "UI-PUBLIC-API.md"), md);

let stabilityMd = "# Component Stability for 1.0\n\nGenerated from package exports and the component registry. Only the stable set below is covered by the 1.0 semver promise. Manual keyboard, NVDA, and VoiceOver evidence is tracked separately and remains required before release.\n\n";
stabilityMd += "## Stable core primitive exports\n\n" + stableCoreExports.map((name) => "- " + name).join("\n") + "\n\n";
stabilityMd += "## Classification counts\n\n";
for (const stability of ["stable", "beta", "experimental"]) {
  const count = uiEntries.reduce((total, entry) => total + entry.exports.filter((item) => item.stability === stability).length, 0);
  stabilityMd += "- @maataa/ui " + stability + ": " + count + " entry exports\n";
}
stabilityMd += "\nExperimental domain areas include maps, Web3, finance, logistics, and culture composites. All 90 kernel registry records are beta until individually promoted.\n";
fs.writeFileSync(path.join(apiDir, "COMPONENT-STABILITY.md"), stabilityMd);
console.log("generated UI API and stability manifests (" + uiEntries.length + " entry points; " + stableSet.length + " stable entry exports; " + registry.components.length + " registry records)");
