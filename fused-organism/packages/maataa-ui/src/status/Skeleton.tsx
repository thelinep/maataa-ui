/**
 * @maataa/ui/status/Skeleton
 * Placeholder shapes while content loads
 */

import React from "react";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens } from "../tokens";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Announced once, e.g. "Loading projects" @default 'Loading' */
  label?: string;
  /** Number of text lines @default 3 */
  lines?: number;
  /** Show an avatar circle before the lines */
  avatar?: boolean;
  /** Show a media block above the lines (card thumbnails) */
  media?: boolean;
}

const pulse = "maataa-skeleton-pulse";
const css = `@keyframes ${pulse}{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion: reduce){[data-skeleton] *{animation:none!important}}`;

const bar = (width: string, height = 12): React.CSSProperties => ({
  width,
  height,
  borderRadius: 4,
  background: colorTokens.background.tertiary,
  animation: `${pulse} 1.6s ease-in-out infinite`,
});

/**
 * Skeleton
 * The shapes are hidden from assistive tech; one status message says what
 * is loading. Animation stops under reduced motion.
 *
 * @example
 * ```tsx
 * {loading ? <Skeleton label="Loading crew" avatar lines={2} /> : <CrewList />}
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ label = "Loading", lines = 3, avatar = false, media = false, style, ...props }, ref) => (
    <div ref={ref} role="status" aria-busy="true" data-skeleton="" style={style} {...props}>
      <style>{css}</style>
      <VisuallyHidden>{label}</VisuallyHidden>
      <div
        aria-hidden="true"
        style={{ display: "flex", flexDirection: "column", gap: spacingTokens.sm }}
      >
        {media && <div style={bar("100%", 120)} />}
        <div style={{ display: "flex", gap: spacingTokens.md, alignItems: "center" }}>
          {avatar && <div style={{ ...bar("40px", 40), borderRadius: "50%", flexShrink: 0 }} />}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: spacingTokens.sm }}>
            {Array.from({ length: lines }, (_, i) => (
              <div key={i} style={bar(i === lines - 1 && lines > 1 ? "60%" : "100%")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
);

Skeleton.displayName = "Skeleton";
