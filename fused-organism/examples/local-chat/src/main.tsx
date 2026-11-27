import React from "react";
import { createRoot } from "react-dom/client";
import { themeInitScript, themePreferenceCss } from "@maataa/ui/theme-style";
import { App } from "./App";

// Theme CSS and the saved theme, applied before the first render.
const style = document.createElement("style");
style.textContent =
  themePreferenceCss() +
  "\nbody{background:var(--maataa-color-background-secondary);color:var(--maataa-color-text-primary);font-family:var(--maataa-font-base);}";
document.head.appendChild(style);
new Function(themeInitScript())();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
