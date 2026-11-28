#!/usr/bin/env node
// Bundles three.js and its OrbitControls into one plain script that sets
// window.THREE, for the local chat's 3D scene artifacts. The chat puts this
// script inside each scene's sealed frame, so scenes run with no network and
// under the desktop app's security policy (no eval, no outside scripts).
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out =
  process.argv[2] ?? path.join(root, "examples", "local-chat", "public", "vendor", "three-scene.js");

const entry = `
import * as THREE_CORE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
window.THREE = Object.assign({}, THREE_CORE, { OrbitControls, RoomEnvironment });
`;

const result = await build({
  stdin: { contents: entry, resolveDir: root, loader: "js" },
  bundle: true,
  format: "iife",
  minify: true,
  legalComments: "eof",
  target: "es2020",
  write: false,
});
fs.mkdirSync(path.dirname(out), { recursive: true });
const code = result.outputFiles[0].text;
fs.writeFileSync(out, code);
const version = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules", "three", "package.json"), "utf8"),
).version;
console.log(
  `three ${version} for 3D scenes: ${path.relative(root, out)} (${Math.round(code.length / 1024)} KB)`,
);
