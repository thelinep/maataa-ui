import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { launchBrowser } from "./lib/browser-runtime.mjs";
import { comparePng } from "./png-diff.mjs";
import { BROWSER_INVARIANT_CHECKS } from "../tests/browser/browser-certification.browser.mjs";

const root=path.resolve(new URL("..",import.meta.url).pathname);
const runtimePolicy=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/runtime-policy.json"),"utf8"));
const baselineManifest=JSON.parse(fs.readFileSync(path.join(root,"tests/browser/baselines/manifest.json"),"utf8"));
const updateRequested=process.argv.includes("--update-baselines");
const updateApproved=process.env.MAATAA_VISUAL_UPDATE_APPROVED==="YES_I_AM_UPDATING_REVIEWED_BASELINES";
if(updateRequested&&!updateApproved){console.error("VISUAL_UPDATE_NOT_APPROVED: use the guarded npm run visuals:update workflow");process.exit(1);}
if(!updateRequested&&process.env.MAATAA_VISUAL_UPDATE_APPROVED){console.error("VISUAL_UPDATE_TOKEN_PRESENT_DURING_CERTIFICATION");process.exit(1);}
const updateVisuals=updateRequested&&updateApproved;
const baselineDir=path.join(root,"tests/browser/baselines");
const currentDir=fs.mkdtempSync(path.join(os.tmpdir(),"maataa-visual-current-"));
fs.mkdirSync(baselineDir,{recursive:true});

function loadFixture(){
  let html=fs.readFileSync(path.join(root,"apps/browser-cert/index.html"),"utf8");
  const css=fs.readFileSync(path.join(root,"apps/browser-cert/styles.css"),"utf8");
  html=html.replace(/<link[^>]*styles\.css[^>]*>/i,`<style>${css}</style>`).replace(/<script[^>]*app\.mjs[^>]*><\/script>/i,"");
  const react=fs.readFileSync(path.join(root,"packages/react/src/index.mjs"),"utf8").replace(/^export\s+/gm,"");
  const host=fs.readFileSync(path.join(root,"apps/browser-cert/react-host-fixture.mjs"),"utf8").replace(/^export\s+/gm,"");
  const app=fs.readFileSync(path.join(root,"apps/browser-cert/app.mjs"),"utf8").replace(/^import[^;]+;\s*/gm,"");
  return {html,script:`(()=>{${react}\n${host}\n${app}})()`};
}

function assert(ok,message){if(!ok)throw new Error(message);}
async function setViewport(page,width,height){await page.send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:runtimePolicy.deviceScaleFactor,mobile:width<600});}
async function waitReady(page){for(let i=0;i<100;i++){const ready=await page.evaluate("window.__MAATAA_READY__===true");if(ready)return;await new Promise(r=>setTimeout(r,50));}throw new Error("BROWSER_FIXTURE_NOT_READY");}
function axRole(node){return node.role?.value;} function axName(node){return node.name?.value;}
async function screenshotFixture(page,name){
  const rect=await page.evaluate(`(()=>{const r=document.querySelector('#visual-fixture').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};})()`);
  const shot=await page.send("Page.captureScreenshot",{format:"png",fromSurface:true,clip:{...rect,scale:1}});
  const current=path.join(currentDir,`${name}.png`);fs.writeFileSync(current,Buffer.from(shot.data,"base64"));
  const baseline=path.join(baselineDir,`${name}.png`);
  if(updateVisuals||!fs.existsSync(baseline)){if(!updateVisuals&&!fs.existsSync(baseline))throw new Error(`VISUAL_BASELINE_MISSING:${name}`);fs.copyFileSync(current,baseline);return{updated:true,ratio:0};}
  const diff=comparePng(baseline,current,baselineManifest.comparison);
  assert(diff.ok,`VISUAL_REGRESSION:${name}:ratio=${diff.ratio}`);return diff;
}

let browser,page;const checks=[];
function pass(id,name,detail){checks.push({id,name,status:"PASS",detail});console.log(`PASS ${id} ${name}${detail?` — ${detail}`:""}`);}
try{
  browser=await launchBrowser();
  assert(browser.family===runtimePolicy.browserFamily,`BROWSER_FAMILY_MISMATCH:${browser.family}`);
  assert(browser.version===runtimePolicy.exactVersion,`BROWSER_VERSION_MISMATCH:${browser.version}!=${runtimePolicy.exactVersion}`);
  assert(baselineManifest.browser?.family===runtimePolicy.browserFamily&&baselineManifest.browser?.exactVersion===runtimePolicy.exactVersion,"BASELINE_BROWSER_POLICY_DRIFT");
  assert(baselineManifest.deviceScaleFactor===runtimePolicy.deviceScaleFactor,"BASELINE_DPR_POLICY_DRIFT");
  page=await browser.newPage("about:blank");
  await page.send("Page.enable");
  await setViewport(page,1280,900);
  const fixture=loadFixture();
  const tree=await page.send("Page.getFrameTree");
  await page.send("Page.setDocumentContent",{frameId:tree.frameTree.frame.id,html:fixture.html});
  await page.evaluate(fixture.script);
  await waitReady(page);

  const self=await page.evaluate("window.__MAATAA_SELF_CHECKS__");
  assert(self?.adapterButton&&self?.adapterInput&&self?.adapterSwitch&&self?.adapterLive,"REACT_ADAPTER_BROWSER_SEMANTICS_FAILED");
  const ax=await page.send("Accessibility.getFullAXTree");
  const nodes=ax.nodes||[];
  const namedButton=nodes.some(n=>axRole(n)==="button"&&axName(n)==="React adapter button");
  const commandInput=nodes.some(n=>["textbox","textField"].includes(axRole(n))&&axName(n)==="Command label");
  const evidenceSwitch=nodes.some(n=>axRole(n)==="switch"&&axName(n)?.includes("Enable evidence"));
  assert(namedButton&&commandInput&&evidenceSwitch,"ACCESSIBILITY_TREE_SEMANTICS_FAILED");
  pass("INV-016",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-016").name,`${browser.browserProduct}; adapter ${self.contractVersion}`);

  await page.evaluate("document.querySelector('#tab-overview').focus()");
  await page.send("Input.dispatchKeyEvent",{type:"keyDown",key:"ArrowRight",code:"ArrowRight"});
  await page.send("Input.dispatchKeyEvent",{type:"keyUp",key:"ArrowRight",code:"ArrowRight"});
  const tabState=await page.evaluate(`({active:document.activeElement?.id,selected:document.querySelector('#tab-evidence').getAttribute('aria-selected')})`);
  assert(tabState.active==="tab-evidence"&&tabState.selected==="true","KEYBOARD_TAB_NAV_FAILED");
  await page.evaluate("document.querySelector('#dialog-open').click()");
  const dialogFocus=await page.evaluate("document.activeElement?.id");assert(dialogFocus==="dialog-close","DIALOG_INITIAL_FOCUS_FAILED");
  await page.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"});await page.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape"});
  await new Promise(r=>setTimeout(r,50));
  const restored=await page.evaluate("document.activeElement?.id");assert(restored==="dialog-open","FOCUS_RESTORE_FAILED");
  pass("INV-017",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-017").name,"Arrow navigation + dialog focus restoration");

  await page.evaluate("document.querySelector('#announce-btn').click()");
  const live=await page.evaluate(`({text:document.querySelector('#live-region').textContent,live:document.querySelector('#live-region').getAttribute('aria-live'),role:document.querySelector('#live-region').getAttribute('role')})`);
  assert(live.text.includes("Verification pending")&&live.live==="polite"&&live.role==="status","LIVE_REGION_FAILED");
  pass("INV-018",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-018").name,"polite status region updates command state");

  const responsive=runtimePolicy.viewports.responsive.map(([w,h],i)=>[w,h,["mobile","tablet","desktop"][i]??`${w}`]);
  for(const [width,height,label] of responsive){
    await setViewport(page,width,height);await new Promise(r=>setTimeout(r,40));
    const view=await page.evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,columns:getComputedStyle(document.querySelector('#layout')).gridTemplateColumns})`);
    assert(view.scrollWidth<=view.innerWidth,`RESPONSIVE_OVERFLOW:${label}:${view.scrollWidth}>${view.innerWidth}`);
    if(label==="mobile")assert(!view.columns.includes(" "),`MOBILE_NOT_SINGLE_COLUMN:${view.columns}`);
  }
  pass("INV-019",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-019").name,runtimePolicy.viewports.responsive.map(v=>v[0]).join("/"));

  await page.send("Emulation.setEmulatedMedia",{media:"screen",features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  const reduced=await page.evaluate(`({match:matchMedia('(prefers-reduced-motion: reduce)').matches,name:getComputedStyle(document.querySelector('.motion-probe')).animationName,duration:getComputedStyle(document.querySelector('.motion-probe')).animationDuration})`);
  assert(reduced.match&&(reduced.name==="none"||reduced.duration==="0s"),`REDUCED_MOTION_FAILED:${JSON.stringify(reduced)}`);
  pass("INV-020",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-020").name,reduced.name);

  await page.send("Emulation.setEmulatedMedia",{media:"screen",features:[{name:"forced-colors",value:"active"}]});
  const forced=await page.evaluate(`({match:matchMedia('(forced-colors: active)').matches,width:getComputedStyle(document.querySelector('.forced-probe')).borderTopWidth,style:getComputedStyle(document.querySelector('.forced-probe')).borderTopStyle})`);
  assert(forced.match&&parseFloat(forced.width)>=2&&forced.style!=="none",`FORCED_COLORS_FAILED:${JSON.stringify(forced)}`);
  pass("INV-021",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-021").name,`${forced.width} ${forced.style}`);

  await page.send("Emulation.setEmulatedMedia",{media:"screen",features:[]});
  const [desktopVp,mobileVp]=runtimePolicy.viewports.visual;
  await setViewport(page,...desktopVp);await new Promise(r=>setTimeout(r,40));
  const desktopDiff=await screenshotFixture(page,"semantic-desktop");
  await setViewport(page,...mobileVp);await new Promise(r=>setTimeout(r,40));
  const mobileDiff=await screenshotFixture(page,"semantic-mobile");
  pass("INV-022",BROWSER_INVARIANT_CHECKS.find(x=>x.id==="INV-022").name,`desktop=${desktopDiff.ratio??0}; mobile=${mobileDiff.ratio??0}; DPR=${runtimePolicy.deviceScaleFactor}`);

  if(checks.length!==BROWSER_INVARIANT_CHECKS.length)throw new Error(`BROWSER_CHECK_COUNT:${checks.length}`);
  console.log(`browser certification PASS (${checks.length} invariants; pinned ${runtimePolicy.browserFamily} ${runtimePolicy.exactVersion}; update=${updateVisuals})`);
} catch(error){console.error(`browser certification FAIL: ${error.stack||error.message}`);process.exitCode=1;}
finally{try{page?.close();}catch{};try{await browser?.close();}catch{};fs.rmSync(currentDir,{recursive:true,force:true});}
