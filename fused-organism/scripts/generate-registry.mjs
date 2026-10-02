import fs from "node:fs";
import path from "node:path";
import { components } from "../definitions/components.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dir = path.join(root, "registry");
fs.mkdirSync(dir, { recursive: true });
const productVersion = JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8")).version;

const bindablePackages = new Set(["@maataa/core","@maataa/ai","@maataa/governance","@maataa/control"]);
const sorted = [...components].map((component) => {
  if (!bindablePackages.has(component.package)) throw new Error(`REGISTRY_BINDING_UNDEFINED:${component.componentId}:${component.package}`);
  return {
    ...component,
    headless: true,
    implementationStatus: "headless-bound",
    binding: { kind: "headless-factory", package: component.package, export: "createHeadlessComponent", componentId: component.componentId }
  };
}).sort((a,b)=>a.componentId.localeCompare(b.componentId));

fs.writeFileSync(path.join(dir,"components.registry.json"), JSON.stringify({version:productVersion,generated:true,components:sorted},null,2)+"\n");
const js = `// GENERATED. DO NOT EDIT.
export const registry = Object.freeze(${JSON.stringify(sorted,null,2)});
const byId=new Map(registry.map(x=>[x.componentId,x]));
export const getRegistryEntry=id=>byId.get(id)??null;
export const isRegisteredComponent=id=>byId.has(id);
`;
fs.writeFileSync(path.join(root,"packages/registry/src/generated.mjs"),js);
