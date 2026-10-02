import React from "react";

export interface OrbitControlProps {
  mode: "orbit" | "pan";
  onModeChange: (mode: "orbit" | "pan") => void;
  onReset: () => void;
  buttonStyle?: React.CSSProperties;
}

export function OrbitControl({ mode, onModeChange, onReset, buttonStyle }: OrbitControlProps) {
  return (
    <>
      <button
        type="button"
        aria-pressed={mode === "orbit"}
        onClick={() => onModeChange("orbit")}
        style={buttonStyle}
      >
        Orbit
      </button>
      <button
        type="button"
        aria-pressed={mode === "pan"}
        onClick={() => onModeChange("pan")}
        style={buttonStyle}
      >
        Pan
      </button>
      <button type="button" onClick={onReset} style={buttonStyle}>
        Reset view
      </button>
    </>
  );
}
