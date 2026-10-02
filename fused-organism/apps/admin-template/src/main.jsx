import React from "react";
import { createRoot } from "react-dom/client";
import AdminWorkspace from "./workspace.jsx";
import "../preview-controller.mjs";

createRoot(document.getElementById("app")).render(<AdminWorkspace />);
