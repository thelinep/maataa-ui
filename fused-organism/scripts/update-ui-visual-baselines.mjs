import { spawnSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
if (process.env.MAATAA_VISUAL_REVIEW !== "approved") {
  console.error("stable UI baseline update refused: review the rendered stories, then set MAATAA_VISUAL_REVIEW=approved");
  process.exit(1);
}
const result = spawnSync(process.execPath, [path.join(root, "scripts", "ui-visual-certify.mjs"), "--update-baselines"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, MAATAA_VISUAL_UPDATE_APPROVED: "YES_I_AM_UPDATING_REVIEWED_BASELINES" },
});
process.exit(result.status ?? 1);
