import { createMaataaReact, REACT_ADAPTER_CONTRACT_VERSION, REACT_PEER_RANGE, validateReactHost } from "../../packages/react/src/index.mjs";
import { createReactHostFixture, renderFixture } from "./react-host-fixture.mjs";

const host=createReactHostFixture();
validateReactHost(host);
const services={telemetry:{name:"telemetry"},control:{name:"control"},approval:{name:"approval"},agent:{name:"agent"},theme:{name:"theme"},toast:{name:"toast"}};
const ui=createMaataaReact(host,services);
const adapterMount=document.querySelector("#adapter-mount");
adapterMount.append(
  renderFixture(ui.Button({id:"adapter-button",children:"React adapter button","aria-label":"React adapter button"})),
  renderFixture(ui.Input({id:"command-label","aria-label":"Command label",value:"camera.ptz",readOnly:true})),
  renderFixture(ui.Switch({id:"evidence-switch",label:"Enable evidence",checked:true,readOnly:true})),
  renderFixture(ui.AriaLive({children:"Adapter ready",politeness:"polite"}))
);

document.querySelector("#react-contract").textContent=`adapter ${REACT_ADAPTER_CONTRACT_VERSION} · peer ${REACT_PEER_RANGE}`;

const tabs=[...document.querySelectorAll('[role="tab"]')];
function activateTab(index){tabs.forEach((tab,i)=>{tab.setAttribute("aria-selected",String(i===index));tab.tabIndex=i===index?0:-1;});tabs[index].focus();}
tabs.forEach((tab,index)=>tab.addEventListener("keydown",event=>{if(event.key==="ArrowRight"){event.preventDefault();activateTab((index+1)%tabs.length);}if(event.key==="ArrowLeft"){event.preventDefault();activateTab((index-1+tabs.length)%tabs.length);}}));

const opener=document.querySelector("#dialog-open");
const dialog=document.querySelector("#approval-dialog");
const close=document.querySelector("#dialog-close");
opener.addEventListener("click",()=>{dialog.showModal();close.focus();});
function closeDialog(){if(dialog.open)dialog.close();opener.focus();}
close.addEventListener("click",closeDialog);
dialog.addEventListener("cancel",event=>{event.preventDefault();closeDialog();});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&dialog.open){event.preventDefault();closeDialog();}});

document.querySelector("#announce-btn").addEventListener("click",()=>{document.querySelector("#live-region").textContent="Command approved. Verification pending.";});

window.__MAATAA_SELF_CHECKS__={
  adapterButton:document.querySelector("#adapter-button")?.tagName==="BUTTON",
  adapterInput:document.querySelector("#command-label")?.getAttribute("aria-label")==="Command label",
  adapterSwitch:document.querySelector("#evidence-switch")?.getAttribute("role")==="switch",
  adapterLive:[...adapterMount.querySelectorAll('[aria-live="polite"]')].length===1,
  contractVersion:REACT_ADAPTER_CONTRACT_VERSION,
  peerRange:REACT_PEER_RANGE
};
window.__MAATAA_READY__=true;
