import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  base: "/apps/tlps-application/",
  plugins: [react()],
  build: {
    outDir: path.resolve(appRoot, "../../dist/apps/tlps-application"),
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
});
