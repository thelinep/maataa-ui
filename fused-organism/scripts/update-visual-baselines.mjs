import { spawnSync } from "node:child_process";
import path from "node:path";
const root=path.resolve(new URL("..",import.meta.url).pathname);
if(process.env.MAATAA_VISUAL_REVIEW!=="approved"){
  console.error("visual baseline update refused: set MAATAA_VISUAL_REVIEW=approved after human review intent");
  process.exit(1);
}
const result=spawnSync(process.execPath,[path.join(root,"scripts/browser-certify.mjs"),"--update-baselines"],{cwd:root,stdio:"inherit",env:{...process.env,MAATAA_VISUAL_UPDATE_APPROVED:"YES_I_AM_UPDATING_REVIEWED_BASELINES"}});
process.exit(result.status??1);
