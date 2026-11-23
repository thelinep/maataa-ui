import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Every English UI string passed to t()/tx()/msg() in @maataa/ui, and every
// built-in theme label, must have a Hindi translation with the same {placeholders}.
// `--list` prints the keys missing a translation as JSON.

const root = path.resolve(new URL("..", import.meta.url).pathname);
const src = path.join(root, "packages", "maataa-ui", "src");
const catalogFile = path.join(src, "i18n", "messages", "hi.ts");
const tokensFile = path.join(root, "packages", "tokens", "src", "index.ts");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

function unquote(literal) {
  return JSON.parse('"' + literal + '"');
}

const keys = new Map();
const add = (key, where) => {
  if (!keys.has(key)) keys.set(key, where);
};
const single = /(?<![\w.$])(?:t|tx|msg)\(\s*"((?:[^"\\]|\\.)*)"/g;
const plural = /(?<![\w$])(?:t|tx)\.plural\(\s*[^,]+,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"/g;
for (const file of walk(src)) {
  const text = fs.readFileSync(file, "utf8");
  const where = path.relative(root, file);
  for (const match of text.matchAll(single)) add(unquote(match[1]), where);
  for (const match of text.matchAll(plural)) {
    add(unquote(match[1]), where);
    add(unquote(match[2]), where);
  }
}
for (const match of fs.readFileSync(tokensFile, "utf8").matchAll(/^\s+label: "([^"]+)",$/gm)) {
  add(match[1], "packages/tokens/src/index.ts");
}

const compiled = ts.transpileModule(fs.readFileSync(catalogFile, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { hi } = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const missing = [];
const mismatched = [];
for (const [key, where] of keys) {
  if (!(key in hi)) missing.push({ key, where });
  else if (placeholders(key) !== placeholders(hi[key])) mismatched.push(key);
}
const unused = Object.keys(hi).filter((key) => !keys.has(key));

if (process.argv.includes("--list")) {
  console.log(JSON.stringify(missing.map((m) => m.key), null, 1));
  process.exit(0);
}

console.log(
  `ui messages: ${keys.size} English strings; Hindi ${keys.size - missing.length}/${keys.size}; ` +
    `${unused.length} unused catalog entries`
);
if (missing.length || mismatched.length) {
  for (const { key, where } of missing.slice(0, 30)) console.error(`missing hi: ${JSON.stringify(key)} (${where})`);
  if (missing.length > 30) console.error(`… and ${missing.length - 30} more`);
  for (const key of mismatched) console.error(`placeholder mismatch: ${JSON.stringify(key)}`);
  process.exit(1);
}
if (unused.length) console.warn("unused (safe to delete): " + unused.slice(0, 20).join(" | "));
