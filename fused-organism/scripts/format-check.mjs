import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const ignoredByteSensitivePaths = [
  "apps/admin-template/.impeccable/build/",
  "apps/admin-template/public/data/tlps-knowledge-library.json",
  "packages/domain-registry/sources/",
  "packages/domain-registry/schema-sources/approvals/",
  "packages/domain-registry/control-plane/generated/control-plane.canonical.json",
];
const bad = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, filePath).split(path.sep).join("/");
    if (entry.isDirectory() && !["node_modules", "dist", "release", "legacy-artifacts", "storybook-static"].includes(entry.name)) {
      walk(filePath);
    } else if (
      entry.isFile() &&
      /\.(mjs|js|json|md|html|yml|yaml)$/.test(entry.name) &&
      !ignoredByteSensitivePaths.some((ignored) =>
        ignored.endsWith("/") ? relativePath.startsWith(ignored) : relativePath === ignored,
      )
    ) {
      const content = fs.readFileSync(filePath, "utf8");
      if (!content.endsWith("\n")) bad.push(`${relativePath} missing final newline`);
      if (content.split("\n").some((line) => /[ \t]+$/.test(line))) {
        bad.push(`${relativePath} trailing whitespace`);
      }
    }
  }
}

walk(root);
if (bad.length) {
  console.error(bad.slice(0, 50).join("\n"));
  process.exit(1);
}
console.log("format:check PASS (source/docs checked; byte-sensitive source evidence preserved)");
