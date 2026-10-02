import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const policy = JSON.parse(fs.readFileSync(path.join(root, "BOUNDARIES.json"), "utf8"));
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

for (const dir of fs.readdirSync(path.join(root, "packages"))) {
  const packagePath = path.join(root, "packages", dir, "package.json");
  if (!fs.existsSync(packagePath)) continue;
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const allowed = new Set(policy.allowed[pkg.name] ?? []);
  for (const dep of Object.keys(pkg.dependencies ?? {})) {
    if (dep.startsWith("@maataa/") && !allowed.has(dep)) errors.push(`${pkg.name} may not depend on ${dep}`);
    if ((policy.forbiddenDomainPrefixes ?? []).some((prefix) => dep.startsWith(prefix))) errors.push(`${pkg.name} may not depend on domain package ${dep}`);
  }
  const src = path.join(root, "packages", dir, "src");
  if (fs.existsSync(src)) {
    for (const file of walk(src)) {
      const body = fs.readFileSync(file, "utf8");
      for (const token of policy.forbiddenTokens ?? []) if (body.includes(token)) errors.push(`${pkg.name} forbidden domain token ${token} in ${path.relative(root, file)}`);
    }
  }
}

const fixturePolicy = policy.experimentalDomain;
const fixturePath = path.join(root, fixturePolicy.path, "package.json");
if (!fs.existsSync(fixturePath)) errors.push(`missing experimental domain fixture ${fixturePolicy.path}`);
else {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  if (fixture.name !== fixturePolicy.package) errors.push(`domain fixture package name mismatch: ${fixture.name}`);
  const allowed = new Set(fixturePolicy.allowedDependencies);
  for (const dep of Object.keys(fixture.dependencies ?? {})) if (!allowed.has(dep)) errors.push(`${fixture.name} fixture dependency not allowed: ${dep}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("boundaries PASS (foundation is domain-free; experimental domain fixture is one-way)");
