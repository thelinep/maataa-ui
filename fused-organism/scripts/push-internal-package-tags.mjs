import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed\n${result.stderr || result.stdout}`);
  return typeof result.stdout === "string" ? result.stdout.trim() : "";
}

const packagesRoot = path.join(root, "packages");
const manifests = fs.readdirSync(packagesRoot).sort().flatMap((directory) => {
  const manifestPath = path.join(packagesRoot, directory, "package.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return [{ name: manifest.name, version: manifest.version }];
});
const expectedTags = manifests.map(({ name, version }) => `${name}@${version}`).sort();
const head = run("git", ["rev-parse", "HEAD"]);
for (const tag of expectedTags) {
  const remote = run("git", ["ls-remote", "--tags", "--refs", "origin", `refs/tags/${tag}`]);
  if (remote) {
    const remoteSha = remote.split(/\s+/)[0];
    const local = run("git", ["tag", "--list", tag]);
    if (local) {
      const localTarget = run("git", ["rev-parse", `${tag}^{commit}`]);
      if (localTarget !== remoteSha) throw new Error("LOCAL_REMOTE_PACKAGE_TAG_MISMATCH: " + tag);
    }
    continue;
  }

  const local = run("git", ["tag", "--list", tag]);
  if (local) {
    const localTarget = run("git", ["rev-parse", `${tag}^{commit}`]);
    if (localTarget !== head) throw new Error("LOCAL_PACKAGE_TAG_COLLISION: " + tag);
  } else {
    run("git", ["tag", tag, head]);
  }
  run("git", ["push", "origin", `refs/tags/${tag}:refs/tags/${tag}`], { stdio: "inherit" });
  console.log("PUSHED " + tag);
}
console.log(`internal package tags PASS (${expectedTags.length} package versions checked; only missing expected @scope/package@version refs pushed)`);
