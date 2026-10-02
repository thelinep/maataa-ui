import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);

test("kernel package surface stays bounded and the visual product is a separate layer", () => {
  const packageRoot = path.join(root, "packages");
  const manifests = fs
    .readdirSync(packageRoot)
    .map((dir) => JSON.parse(fs.readFileSync(path.join(packageRoot, dir, "package.json"), "utf8")));
  const kernel = manifests.filter(
    (pkg) =>
      pkg.name.startsWith("@maataa/") &&
      !["@maataa/tokens", "@maataa/primitives", "@maataa/ui"].includes(pkg.name),
  );
  assert.equal(kernel.length, 11);
  assert.equal(
    manifests.filter((pkg) => pkg.maataaPolicy?.classification === "visual-host-package").length,
    1,
  );
  for (const name of [
    "@maataa/tokens",
    "@maataa/primitives",
    "@maataa/ui",
    "@tlps/domain-primitives",
    "@tlps/workflow-primitives",
    "@tlps/evidence-primitives",
    "@tlps/generative-primitives",
    "@tlps/composites",
    "@tlps/templates",
  ]) {
    assert.ok(
      manifests.some((pkg) => pkg.name === name),
      `missing extracted package ${name}`,
    );
  }
});
