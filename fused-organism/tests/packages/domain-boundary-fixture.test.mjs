import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);

test("INV-006 experimental domain fixture obeys one-way package boundaries", () => {
  const policy = JSON.parse(fs.readFileSync(path.join(root, "BOUNDARIES.json"), "utf8"));
  const fixture = JSON.parse(fs.readFileSync(path.join(root, policy.experimentalDomain.path, "package.json"), "utf8"));
  assert.equal(fixture.name, policy.experimentalDomain.package);
  const allowed = new Set(policy.experimentalDomain.allowedDependencies);
  for (const dep of Object.keys(fixture.dependencies ?? {})) assert.ok(allowed.has(dep), `fixture dependency not allowed: ${dep}`);

  for (const dir of fs.readdirSync(path.join(root, "packages"))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "packages", dir, "package.json"), "utf8"));
    for (const dep of Object.keys(pkg.dependencies ?? {})) assert.equal(dep.startsWith("@maataa-ui/"), false, `${pkg.name} depends on domain package ${dep}`);
  }
});
