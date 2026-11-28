// Three.js scene artifacts. A ```threejs block holds plain JavaScript; this
// wraps it in a full page with three.js, a camera, orbit controls, lights and
// an animation loop. The page runs in a sealed frame (sandbox="allow-scripts",
// no same-origin), and three.js is put inside the page itself, so a scene
// needs no network and works under the desktop app's security policy.

let threeSource: Promise<string> | null = null;

/** three.js as one script (built by scripts/build-three-vendor.mjs). */
export function loadThree(): Promise<string> {
  threeSource ??= fetch("/vendor/three-scene.js").then((r) => {
    if (!r.ok) throw new Error(`three.js is missing (HTTP ${r.status}). Run npm run chat:local:build.`);
    return r.text();
  });
  threeSource.catch(() => {
    threeSource = null;
  });
  return threeSource;
}

/** Keeps a script's text from closing its <script> element early. */
const safeScript = (code: string) => code.replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** A complete page that runs the scene. Also what Download saves. */
export function scenePage(code: string, title: string, three: string, dark = false): string {
  const bg = dark ? "#16181b" : "#eef0f2";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
html, body { margin: 0; height: 100%; overflow: hidden; background: ${bg}; font: 14px system-ui, sans-serif; }
canvas { display: block; width: 100%; height: 100%; touch-action: none; }
#msg { position: fixed; left: 8px; right: 8px; bottom: 8px; margin: 0; padding: 8px 10px; border-radius: 8px;
  background: #fde8e6; color: #8b1a12; white-space: pre-wrap; display: none; }
#hint { position: fixed; right: 8px; top: 6px; margin: 0; color: ${dark ? "#aab" : "#556"}; font-size: 12px; pointer-events: none; }
</style>
</head>
<body>
<p id="hint">drag to orbit · scroll to zoom · right-drag to pan</p>
<p id="msg" role="alert"></p>
<script>${safeScript(three)}</script>
<script>
(function () {
  var msg = document.getElementById("msg");
  function show(text) { msg.textContent = text; msg.style.display = "block"; }
  window.addEventListener("error", function (e) { show("The scene has an error: " + (e.message || e.error)); });
  var canvas = document.createElement("canvas");
  if (!(canvas.getContext("webgl2") || canvas.getContext("webgl"))) { show("3D (WebGL) isn't available here."); return; }
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  document.body.appendChild(canvas);
  var scene = new THREE.Scene();
  scene.background = new THREE.Color("${bg}");
  var camera = new THREE.PerspectiveCamera(50, 1, 0.05, 2000);
  camera.position.set(4, 3, 6);
  var controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.target.set(0, 0.5, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f72, 1.4));
  var sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(5, 10, 7);
  sun.castShadow = true;
  scene.add(sun);
  var frames = [];
  window.__scene = { THREE: THREE, scene: scene, camera: camera, renderer: renderer, controls: controls,
    onFrame: function (f) { if (typeof f === "function") frames.push(f); } };
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();
  var last = 0, failed = false;
  renderer.setAnimationLoop(function (ms) {
    var t = ms / 1000, dt = last ? t - last : 0; last = t;
    if (!failed) {
      try { for (var i = 0; i < frames.length; i++) frames[i](t, dt); }
      catch (e) { failed = true; show("The scene's animation stopped: " + (e && e.message || e)); }
    }
    controls.update();
    renderer.render(scene, camera);
  });
})();
</script>
<script>
(function (THREE, scene, camera, renderer, controls, onFrame) {
  if (!scene) return;
${safeScript(code)}
}).apply(null, window.__scene ? [window.__scene.THREE, window.__scene.scene, window.__scene.camera, window.__scene.renderer, window.__scene.controls, window.__scene.onFrame] : []);
</script>
</body>
</html>`;
}
