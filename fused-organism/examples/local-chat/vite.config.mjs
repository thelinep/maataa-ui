import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server forwards /ollama to Ollama and /lmstudio to LM Studio, so the
// browser talks to one origin and no CORS setup is needed.
const ollama = process.env.OLLAMA_URL ?? "http://localhost:11434";
const lmstudio = process.env.LMSTUDIO_URL ?? "http://localhost:1234";
const proxy = (target, prefix) => ({
  target,
  changeOrigin: true,
  rewrite: (path) => path.slice(prefix.length),
});

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  server: {
    port: 5180,
    host: "127.0.0.1",
    proxy: { "/ollama": proxy(ollama, "/ollama"), "/lmstudio": proxy(lmstudio, "/lmstudio") },
  },
  preview: {
    port: 5180,
    host: "127.0.0.1",
    proxy: { "/ollama": proxy(ollama, "/ollama"), "/lmstudio": proxy(lmstudio, "/lmstudio") },
  },
});
