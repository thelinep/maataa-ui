// Layout for the app shell. Colours come from the theme's CSS variables, so
// every built-in theme (and dark mode) applies.
const v = (name: string, fallback: string) => `var(--maataa-color-${name}, ${fallback})`;

const bg1 = v("background-primary", "#FFFAF0");
const bg2 = v("background-secondary", "#F8F3EC");
const bg3 = v("background-tertiary", "#F0E6DA");
const text1 = v("text-primary", "#2B1D14");
const text2 = v("text-secondary", "#6B5546");
const line = v("border-primary", "#D4AF9F");
const control = v("border-control", "#9C7C66");
const accent = v("interactive-primary", "#7A5C3E");
const inverse = v("text-inverse", "#FFFFFF");
const ok = v("interactive-success", "#2D6A3E");
const bad = v("interactive-error", "#8B3A2B");

export const APP_CSS = `
* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body { margin: 0; background: ${bg2}; color: ${text1}; }
.app {
  height: 100dvh; display: grid; overflow: hidden;
  grid-template-columns: 264px minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas: "top top" "side main";
}
.app.with-panel { grid-template-columns: 264px minmax(0, 1fr) minmax(320px, 40%); grid-template-areas: "top top top" "side main panel"; }
.top {
  grid-area: top; display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; border-bottom: 1px solid ${line}; background: ${bg1}; min-width: 0;
}
.top-title { flex: 1; min-width: 0; margin: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.crumb { font-weight: 400; }
.side { grid-area: side; display: flex; flex-direction: column; gap: 4px; padding: 10px 8px; border-right: 1px solid ${line}; background: ${bg2}; overflow-y: auto; min-height: 0; }
.side-h { margin: 10px 8px 2px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: ${text2}; }
.side-head { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.side-foot { margin-top: auto; padding-top: 8px; border-top: 1px solid ${line}; }
.main { grid-area: main; min-width: 0; min-height: 0; display: flex; padding: 8px 12px 10px; background: ${bg1}; }
.main > * { flex: 1; }
.panel { grid-area: panel; display: flex; flex-direction: column; min-width: 0; min-height: 0; border-left: 1px solid ${line}; background: ${bg1}; }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border-bottom: 1px solid ${line}; }
.panel-body { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; }
.tab { border: 0 !important; border-radius: 999px !important; background: transparent !important; }
.tab[aria-selected="true"] { background: ${bg3} !important; font-weight: 600; }

button, select, input, textarea, .file-button {
  font: inherit; color: inherit; min-height: 36px; padding: 4px 10px; border-radius: 8px;
  border: 1px solid ${control}; background: ${bg1};
}
textarea { resize: vertical; }
button, .file-button { cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: .55; }
button.primary { background: ${accent}; color: ${inverse}; border-color: ${accent}; font-weight: 600; }
button.danger { border-color: ${bad}; color: ${bad}; font-weight: 600; }
button.ghost { border-color: transparent; background: transparent; }
button.icon { min-width: 36px; padding: 0; font-size: 18px; line-height: 1; }
button.chip { border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; font-size: 13px; white-space: nowrap; }
button.chip[aria-pressed="true"] { background: ${bg3}; border-color: ${accent}; }
.small-btn { font-size: 12px; min-height: 28px; padding: 0 8px; }
.count { min-width: 18px; padding: 0 5px; border-radius: 999px; background: ${accent}; color: ${inverse}; font-size: 11px; line-height: 18px; text-align: center; }
.model-chip { max-width: 220px; }
.model-chip .lbl { overflow: hidden; text-overflow: ellipsis; }
.dot { width: 9px; height: 9px; border-radius: 999px; flex: none; }
.dot.ok { background: ${ok}; } .dot.error { background: ${bad}; } .dot.busy { background: ${text2}; }
.tone-ok { color: ${ok}; } .tone-error { color: ${bad}; } .tone-busy { color: ${text2}; }
.file-button { display: inline-flex; align-items: center; justify-self: start; position: relative; overflow: hidden; }
.file-button input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.file-button:focus-within { outline: 2px solid ${accent}; outline-offset: 2px; }

.plain-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; grid-template-columns: minmax(0, 1fr); }
.row-button { width: 100%; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; gap: 0; text-align: left; border: 0; background: transparent; min-height: 36px; }
.row-inline { flex-direction: row; align-items: center; gap: 6px; }
.row-button[aria-current="true"] { background: ${bg3}; font-weight: 600; }
.row-title { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-row { display: flex; align-items: center; gap: 2px; }
.chat-row .row-button { flex: 1; min-width: 0; width: auto; }
.chat-row .icon { opacity: .6; }
.chat-row:hover .icon, .chat-row .icon:focus-visible { opacity: 1; }
.task { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
.task input[type="checkbox"] { width: 20px; height: 20px; min-height: 0; flex: none; }
.task label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.task label.done { text-decoration: line-through; color: ${text2}; }

.muted { color: ${text2}; } .small { font-size: 12px; }
.pad { padding: 12px; margin: 0; }
.stack { display: grid; gap: 10px; }
.inline { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.field { display: grid; gap: 4px; }
.field label, .field .label { font-size: 13px; font-weight: 600; }
.grid2 { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.offline { display: grid; gap: 8px; padding: 16px; border: 1px solid ${line}; border-radius: 12px; background: ${bg2}; color: ${text1}; }

.artifact-card { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid ${line}; border-radius: 12px; background: ${bg1}; min-width: 0; }
.artifact-icon { font-size: 22px; flex: none; }
.artifact-card-text { display: grid; flex: 1; min-width: 0; overflow-wrap: anywhere; }
.block-note { margin: 0; padding: 8px 10px; border-radius: 10px; background: ${bg3}; color: ${text2}; }
.diagram { margin: 0; display: grid; gap: 4px; min-width: 0; width: min(640px, 100%); }
.diagram iframe { width: 100%; border: 1px solid ${line}; border-radius: 10px; background: #fff; }
.live { margin: 0; display: grid; border: 1px solid ${line}; border-radius: 12px; overflow: hidden; min-width: 0; background: ${bg1}; }
.live-bar { display: flex; align-items: center; gap: 8px; padding: 6px 8px 6px 10px; border-bottom: 1px solid ${line}; }
.live-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.live iframe { width: 100%; height: 300px; border: 0; background: #fff; }
.media { margin: 0; display: grid; gap: 8px; padding: 10px; border: 1px solid ${line}; border-radius: 12px; background: ${bg1}; min-width: 0; }
.media-prompt { margin: 0; overflow-wrap: anywhere; }
.media-item { display: grid; gap: 4px; justify-items: start; }
.media-item img, .media-item video { max-width: 100%; max-height: 420px; border-radius: 8px; }
.media-item audio { width: 100%; }
.tex-block { overflow-x: auto; max-width: 100%; }
.artifact { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.artifact-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 10px; }
.artifact-title { margin: 0; font-size: 15px; flex: 1; min-width: 0; overflow-wrap: anywhere; }
.artifact-body { flex: 1; min-height: 280px; display: flex; flex-direction: column; border-top: 1px solid ${line}; overflow: auto; }
.artifact-body iframe { flex: 1; width: 100%; min-height: 320px; border: 0; background: #fff; }

.settings { width: min(640px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); border: 1px solid ${line}; border-radius: 14px; background: ${bg1}; color: ${text1}; padding: 18px; }
.settings::backdrop { background: rgba(0, 0, 0, .35); }
fieldset { border: 1px solid ${line}; border-radius: 10px; padding: 10px; }

.only-narrow { display: none; }
.scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, .35); z-index: 29; }

@media (max-width: 860px) {
  .app, .app.with-panel { grid-template-columns: minmax(0, 1fr); grid-template-areas: "top" "main"; }
  .only-narrow { display: inline-flex; }
  .scrim.only-narrow { display: block; }
  .side { position: fixed; inset: 0 auto 0 0; width: min(300px, 86vw); z-index: 30; transform: translateX(-105%); transition: transform .18s ease; box-shadow: 0 0 24px rgba(0,0,0,.2); }
  .side.open { transform: none; }
  .panel { position: fixed; inset: 0; z-index: 40; border-left: 0; }
  .main { padding: 4px 6px 6px; }
}
@media (max-width: 560px) {
  .mc-hint { display: none; }
  .top .lbl { display: none; }
  .top .chip, .top .primary { min-width: 40px; justify-content: center; }
  .top-title .crumb { display: none; }
}
@media (pointer: coarse) {
  button, select, input:not([type="checkbox"]), textarea, .file-button, .row-button, .small-btn { min-height: 44px; }
  button.icon { min-width: 44px; }
  .task input[type="checkbox"] { width: 24px; height: 24px; }
}
/* Lime theme: bright lime marks what is selected; text on it stays dark. */
[data-maataa-theme="lime"] .row-button[aria-current="true"],
[data-maataa-theme="lime"] .tab[aria-selected="true"],
[data-maataa-theme="lime"] button.chip[aria-pressed="true"] { background: #D9F99D !important; color: #1C1F1C; }
[data-maataa-theme="lime"] .count { background: #A3E635; color: #1C1F1C; }
[data-maataa-theme="lime"] .top { border-bottom: 3px solid #A3E635; }
[data-maataa-theme="lime"] .artifact-icon { color: #4D7C0F; }
@media (prefers-reduced-motion: reduce) { .side { transition: none; } }
`;
