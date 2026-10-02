import React from "react";
import type { Model3D, Vector3 } from "./Model3D";

export interface TransformControlProps {
  model: Model3D | null;
  onChange: (model: Model3D) => void;
  disabled?: boolean;
}

export function TransformControl({ model, onChange, disabled = false }: TransformControlProps) {
  if (!model)
    return (
      <aside aria-label="Object inspector" style={{ padding: 16, color: "#6E675F", fontSize: 13 }}>
        Select an object to inspect and transform it.
      </aside>
    );
  const vectorField = (label: string, values: Vector3, key: "position" | "rotation" | "scale") => (
    <fieldset style={{ border: 0, padding: 0, margin: "16px 0" }}>
      <legend style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>{label}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 6 }}>
        {values.map((value, index) => (
          <label key={index} style={{ fontSize: 10, color: "#6E675F" }}>
            {["X", "Y", "Z"][index]}
            <input
              aria-label={`${label} ${["X", "Y", "Z"][index]}`}
              type="number"
              step={key === "rotation" ? 5 : 0.1}
              value={key === "rotation" ? Math.round((value * 180) / Math.PI) : Number(value.toFixed(2))}
              disabled={disabled}
              onChange={(event) => {
                const next = [...values] as [number, number, number];
                const parsed = Number(event.target.value);
                next[index] = key === "rotation" ? (parsed * Math.PI) / 180 : parsed;
                if (key === "scale") next[index] = Math.max(0.05, next[index]);
                onChange({ ...model, [key]: next as Vector3 });
              }}
              style={{
                boxSizing: "border-box",
                width: "100%",
                minWidth: 0,
                marginTop: 4,
                minHeight: 32,
                border: "1px solid #D6CCBF",
                borderRadius: 6,
                padding: "4px 5px",
                font: "inherit",
              }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
  return (
    <aside aria-label="Object inspector" style={{ padding: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700 }}>
        Object name
        <input
          aria-label="Object name"
          value={model.name}
          disabled={disabled}
          onChange={(event) => onChange({ ...model, name: event.target.value })}
          style={{
            boxSizing: "border-box",
            width: "100%",
            marginTop: 6,
            minHeight: 34,
            padding: 6,
            border: "1px solid #D6CCBF",
            borderRadius: 6,
            font: "inherit",
          }}
        />
      </label>
      {vectorField("Position", model.position, "position")}
      {vectorField("Rotation · degrees", model.rotation, "rotation")}
      {vectorField("Scale", model.scale, "scale")}
      <label style={{ display: "block", fontSize: 12, fontWeight: 700 }}>
        Surface color
        <input
          aria-label="Surface color"
          type="color"
          value={model.material.color}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...model, material: { ...model.material, color: event.target.value } })
          }
          style={{
            display: "block",
            width: "100%",
            height: 36,
            marginTop: 6,
            padding: 2,
            border: "1px solid #D6CCBF",
            borderRadius: 6,
          }}
        />
      </label>
    </aside>
  );
}
