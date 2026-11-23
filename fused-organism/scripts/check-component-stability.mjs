import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const stability = JSON.parse(fs.readFileSync(path.join(root, "api", "component-stability.json"), "utf8"));
const uiApi = JSON.parse(fs.readFileSync(path.join(root, "api", "ui-public-api.json"), "utf8"));
const publicApi = JSON.parse(fs.readFileSync(path.join(root, "api", "public-api.json"), "utf8"));
const errors = [];
const valid = new Set(["stable", "beta", "experimental"]);
const stableNames = new Set([
  "AspectRatio", "Badge", "Box", "Button", "Card", "Container", "Divider", "FieldContext",
  "Flex", "Grid", "Input", "Portal", "ScrollArea", "Spacer", "Stack", "VisuallyHidden",
  "primitiveComponents", "useField",
]);

if (stability.schemaVersion !== 1 || uiApi.schemaVersion !== 1) errors.push("unsupported stability/API schema");
if (JSON.stringify(stability.uiEntries) !== JSON.stringify(uiApi.entries)) errors.push("stability and UI API entry lists differ");
if (stability.registryComponents.length !== 90) errors.push("registry stability list must cover all 90 current registry records");
if (stability.registryComponents.some((entry) => !valid.has(entry.stability))) errors.push("registry contains an invalid stability value");
if (stability.registryComponents.some((entry) => entry.stability !== "beta")) errors.push("kernel registry exports are beta until separately approved");

const primitivePackage = stability.packages.find((entry) => entry.name === "@maataa/primitives");
const primitiveNames = new Set((primitivePackage?.exports ?? []).map((entry) => entry.name));
for (const name of stableNames) if (!primitiveNames.has(name)) errors.push("stable primitive export missing: " + name);
for (const entry of stability.packages) {
  for (const item of entry.exports) {
    if (!valid.has(item.stability)) errors.push(entry.name + " has invalid stability for " + item.name);
    if (entry.name.startsWith("@tlps/") && item.stability !== "experimental") errors.push(entry.name + " must remain experimental");
    if (entry.name === "@maataa/primitives" && item.stability !== "stable") errors.push("core primitive export must remain stable: " + item.name);
  }
}

const uiRoot = stability.uiEntries.find((entry) => entry.entry === ".");
const uiPrimitive = stability.uiEntries.find((entry) => entry.entry === "./primitives");
const uiMaps = stability.uiEntries.find((entry) => entry.entry === "./maps");
for (const entry of [uiRoot, uiPrimitive]) {
  const names = new Set((entry?.exports ?? []).filter((item) => item.stability === "stable").map((item) => item.name));
  for (const name of stableNames) if (!names.has(name)) errors.push("stable alias missing from " + entry?.entry + ": " + name);
}
if (uiMaps?.exports.some((item) => item.stability !== "experimental")) errors.push("maps exports must remain experimental");
for (const entry of stability.uiEntries) for (const item of entry.exports) if (!valid.has(item.stability)) errors.push(entry.entry + " has invalid stability for " + item.name);

const expectedStable = stableNames.size * 3;
if (stability.stableSet.length !== expectedStable) errors.push("stable set must contain " + expectedStable + " explicit package/entry aliases");
const kernelExperimental = publicApi.packages.filter((pkg) => pkg.name.startsWith("@tlps/")).map((pkg) => pkg.name);
for (const name of kernelExperimental) {
  const entry = stability.packages.find((candidate) => candidate.name === name);
  if (!entry || entry.exports.some((item) => item.stability !== "experimental")) errors.push(name + " is not fully classified experimental");
}

if (errors.length) {
  console.error("component stability FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("component stability PASS (18 stable core exports and aliases; beta/experimental tiers cover all public entries and 90 registry records)");
