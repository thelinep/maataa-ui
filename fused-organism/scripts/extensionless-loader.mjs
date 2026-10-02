import fs from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL?.startsWith("file:")) {
    const file = new URL(`${specifier}.js`, context.parentURL);
    const index = new URL(`${specifier}/index.js`, context.parentURL);
    if (fs.existsSync(fileURLToPath(file))) return nextResolve(file.href, context);
    if (fs.existsSync(fileURLToPath(index))) return nextResolve(index.href, context);
  }
  return nextResolve(specifier, context);
}
