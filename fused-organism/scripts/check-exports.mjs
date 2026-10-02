import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const errors = [];
for (const directory of fs.readdirSync(path.join(root, "packages"))) {
  const packagePath = path.join(root, "packages", directory);
  const manifestPath = path.join(packagePath, "package.json");
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const [subpath, entry] of Object.entries(manifest.exports ?? {})) {
    const targets = typeof entry === "string" ? [entry] : Object.values(entry ?? {});
    for (const target of targets) {
      if (typeof target !== "string" || !target.startsWith("./")) {
        errors.push(`${manifest.name} has an invalid export target for ${subpath}`);
        continue;
      }
      if (!fs.existsSync(path.join(packagePath, target))) errors.push(`${manifest.name} missing export target ${target}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("exports PASS (all import, default, and type targets exist)");
