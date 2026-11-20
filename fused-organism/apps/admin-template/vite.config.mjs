import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  base: process.env.MAATAA_DESKTOP === "true" ? "./" : "/apps/admin-template/",
  plugins: [react()],
  build: {
    outDir: path.resolve(appRoot, "../../dist/apps/admin-template"),
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
