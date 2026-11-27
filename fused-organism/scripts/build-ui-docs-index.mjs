import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Builds a search index of MAATAA UI for the local docs chatbot: one chunk per
// exported component or helper (its description, import path and props) and
// one per section of the guides. Usage:
//   node scripts/build-ui-docs-index.mjs [output.json]

const root = path.resolve(new URL("..", import.meta.url).pathname);
const src = path.join(root, "packages", "maataa-ui", "src");
const primitivesSrc = path.join(root, "packages", "primitives", "src");
const out = path.resolve(
  process.argv[2] ?? path.join(root, "examples", "local-chat", "public", "maataa-docs.json"),
);
const guides = [
  "docs/THEMES-AND-LANGUAGES.md",
  "docs/PACKAGING.md",
  "docs/ACCESSIBILITY-REVIEW-1.0.md",
  "RELEASE.md",
  "packages/maataa-ui/README.md",
  "packages/tokens/README.md",
];

const stability = new Map();
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "api", "component-stability.json"), "utf8"));
  for (const entry of manifest.uiEntries ?? []) {
    for (const item of entry.exports ?? []) {
      if (!stability.has(item.name) || entry.entry !== ".")
        stability.set(item.name, { entry: entry.entry, stability: item.stability });
    }
  }
} catch {
  // Stability is a nice-to-have in the index.
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return /\.tsx?$/.test(e.name) && !/\.(test|stories)\.tsx?$/.test(e.name) && !e.name.endsWith(".d.ts")
      ? [full]
      : [];
  });
}

const clean = (text) =>
  text
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
const jsdocOf = (node, sf) =>
  ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((doc) => {
      const comment = ts.getTextOfJSDocComment(doc.comment) ?? "";
      const tags = (doc.tags ?? [])
        .map((tag) => `@${tag.tagName.text} ${ts.getTextOfJSDocComment(tag.comment) ?? ""}`.trim())
        .join("\n");
      return [comment, tags].filter(Boolean).join("\n");
    })
    .join("\n")
    .trim() || "";

const chunks = [];
const interfaces = new Map();
const exportsFound = [];

const files = [
  ...walk(src).map((file) => ({ file, base: src, pkg: "@maataa/ui" })),
  ...(fs.existsSync(primitivesSrc)
    ? walk(primitivesSrc).map((file) => ({ file, base: primitivesSrc, pkg: "@maataa/primitives" }))
    : []),
];
for (const { file, base, pkg } of files) {
  const rel = (pkg === "@maataa/ui" ? "" : "primitives:") + path.relative(base, file).replace(/\\/g, "/");
  if (rel.startsWith("i18n/messages/")) continue;
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const exported = (node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  ts.forEachChild(sf, (node) => {
    if (ts.isInterfaceDeclaration(node) && exported(node)) {
      const fields = node.members.filter(ts.isPropertySignature).map((m) => {
        const name = m.name.getText(sf);
        const type = m.type ? m.type.getText(sf).replace(/\s+/g, " ") : "unknown";
        const doc = jsdocOf(m, sf).replace(/\n/g, " ");
        return `- ${name}${m.questionToken ? "?" : ""}: ${type.length > 120 ? type.slice(0, 117) + "…" : type}${doc ? ` — ${doc}` : ""}`;
      });
      const heritage = (node.heritageClauses ?? []).map((h) => h.getText(sf)).join(" ");
      interfaces.set(node.name.text, { fields, heritage });
      return;
    }
    let name;
    let kind;
    if (ts.isFunctionDeclaration(node) && exported(node) && node.name) {
      name = node.name.text;
      kind = /^[A-Z]/.test(name) ? "component" : /^use[A-Z]/.test(name) ? "hook" : "function";
    } else if (ts.isVariableStatement(node) && exported(node)) {
      const decl = node.declarationList.declarations[0];
      if (decl && ts.isIdentifier(decl.name)) {
        name = decl.name.text;
        const init = decl.initializer?.getText(sf) ?? "";
        kind =
          /^[A-Z]/.test(name) && /forwardRef|=>|function|memo/.test(init.slice(0, 200))
            ? "component"
            : "value";
      }
    } else if (ts.isClassDeclaration(node) && exported(node) && node.name) {
      name = node.name.text;
      kind = "class";
    }
    if (!name) return;
    const doc = jsdocOf(node, sf);
    if (!doc && kind === "value") return;
    exportsFound.push({ name, kind, doc, rel, pkg });
  });
}

// @maataa/ui re-exports the primitives; keep the first (richest) record of each name.
const seen = new Set();
for (const { name, kind, doc, rel, pkg } of exportsFound) {
  if (seen.has(name)) continue;
  seen.add(name);
  const info = pkg === "@maataa/primitives" ? { stability: "stable" } : stability.get(name);
  const entry =
    pkg !== "@maataa/ui"
      ? pkg
      : info?.entry && info.entry !== "."
        ? `@maataa/ui/${info.entry.replace(/^\.\//, "")}`
        : "@maataa/ui";
  const props = interfaces.get(`${name}Props`);
  const lines = [
    `${name} (${kind}${info ? `, ${info.stability}` : ""})`,
    `Import: import { ${name} } from "${entry}";`,
    doc && `Description:\n${doc}`,
    props && `Props${props.heritage ? ` (${props.heritage})` : ""}:\n${props.fields.join("\n")}`,
  ].filter(Boolean);
  chunks.push({
    id: `src:${rel}#${name}`,
    title: name,
    text: clean(lines.join("\n")),
    source: rel.startsWith("primitives:")
      ? `packages/primitives/src/${rel.slice("primitives:".length)}`
      : `packages/maataa-ui/src/${rel}`,
  });
}

for (const guide of guides) {
  const file = path.join(root, guide);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const docTitle = (text.match(/^#\s+(.+)$/m) ?? [, path.basename(guide)])[1];
  const sections = text.split(/^(?=##\s)/m);
  sections.forEach((section, i) => {
    const heading = (section.match(/^##\s+(.+)$/m) ?? [, i === 0 ? "Overview" : `Part ${i}`])[1];
    const body = clean(section.replace(/^#{1,2}\s+.+$/gm, ""));
    if (body.length < 40) return;
    for (let start = 0, part = 0; start < body.length; start += 2400, part += 1) {
      chunks.push({
        id: `doc:${guide}#${i}.${part}`,
        title: `${docTitle} › ${heading}`,
        text: body.slice(start, start + 2600),
        source: guide,
      });
    }
  });
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(
  out,
  JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), chunks }) + "\n",
);
const components = exportsFound.filter((e) => e.kind === "component").length;
console.log(`docs index: ${chunks.length} chunks (${components} components) → ${path.relative(root, out)}`);
