import React from "react";
import { colorTokens, radiusTokens } from "@maataa/tokens";

export interface ViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
}

export function Viewport({ label = "Viewport", toolbar, children, style, ...props }: ViewportProps) {
  return (
    <section
      aria-label={label}
      {...props}
      style={{
        overflow: "hidden",
        border: `1px solid ${colorTokens.border.primary}`,
        borderRadius: radiusTokens.lg,
        background: colorTokens.background.primary,
        ...style,
      }}
    >
      {toolbar && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            padding: 10,
            borderBottom: `1px solid ${colorTokens.border.secondary}`,
          }}
        >
          {toolbar}
        </div>
      )}
      {children}
    </section>
  );
}
