/**
 * @maataa/ui/surfaces/OnboardingTour
 * Step-by-step tour that points at parts of the page
 */

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface TourStep {
  /** CSS selector of the element to point at (optional: centred if missing) */
  target?: string;
  title: string;
  body: React.ReactNode;
}

export interface OnboardingTourProps {
  steps: TourStep[];
  open: boolean;
  onClose: (completed: boolean) => void;
}

/**
 * OnboardingTour
 * A non-modal dialog per step ("Step 2 of 5"), focus moves into it; Back,
 * Next/Finish and Skip tour; Escape skips. The target is outlined and
 * scrolled into view, but nothing on the page is blocked.
 */
export function OnboardingTour({ steps, open, onClose }: OnboardingTourProps) {
  const id = useId();
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const step = steps[i];
  const target = step?.target ? (document.querySelector(step.target) as HTMLElement | null) : null;

  useLayoutEffect(() => {
    if (!open || !target) {
      setRect(null);
      return;
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView?.({ block: "center", behavior: reduce ? "auto" : "smooth" });
    setRect(target.getBoundingClientRect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i]);

  useEffect(() => {
    if (open) box.current?.focus();
  }, [open, i]);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  if (!open || !step) return null;
  const last = i === steps.length - 1;
  const pos: React.CSSProperties = rect
    ? {
        position: "fixed",
        top: Math.min(window.innerHeight - 220, rect.bottom + 12),
        left: Math.max(12, Math.min(window.innerWidth - 352, rect.left)),
      }
    : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const b = (primary?: boolean): React.CSSProperties => ({
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 8,
    border: primary ? 0 : `1px solid ${colorTokens.border.control}`,
    background: primary ? colorTokens.interactive.primary : colorTokens.background.primary,
    color: primary ? colorTokens.text.inverse : colorTokens.text.primary,
    font: "inherit",
    fontWeight: primary ? 700 : 500,
    cursor: "pointer",
  });
  return createPortal(
    <>
      {rect && (
        <span
          aria-hidden="true"
          style={{
            position: "fixed",
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: 10,
            outline: `4px solid #F5D547`,
            boxShadow: "0 0 0 4px rgba(20,14,8,0.6)",
            pointerEvents: "none",
            zIndex: 1300,
          }}
        />
      )}
      <div
        ref={box}
        role="dialog"
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-b`}
        tabIndex={-1}
        onKeyDown={(e) => e.key === "Escape" && onClose(false)}
        style={{
          ...pos,
          zIndex: 1301,
          width: 340,
          maxWidth: "calc(100vw - 24px)",
          padding: spacingTokens.md,
          borderRadius: 14,
          background: colorTokens.background.primary,
          boxShadow: colorTokens.shadow.xl,
          border: `1px solid ${colorTokens.border.primary}`,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          gap: spacingTokens.sm,
        }}
      >
        <span style={{ fontSize: 12, color: colorTokens.text.secondary }}>
          Step {i + 1} of {steps.length}
        </span>
        <h2 id={`${id}-t`} style={{ margin: 0, fontSize: typographyTokens.fontSize.lg }}>
          {step.title}
        </h2>
        <div id={`${id}-b`} style={{ color: colorTokens.text.secondary }}>
          {step.body}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => onClose(false)}
            style={{ ...b(), border: 0, textDecoration: "underline", background: "transparent" }}
          >
            Skip tour
          </button>
          <span style={{ display: "flex", gap: 6 }}>
            {i > 0 && (
              <button type="button" style={b()} onClick={() => setI(i - 1)}>
                Back
              </button>
            )}
            <button
              type="button"
              style={b(true)}
              onClick={() => (last ? onClose(true) : setI(i + 1))}
            >
              {last ? "Finish" : "Next"}
            </button>
          </span>
        </div>
      </div>
    </>,
    document.body
  );
}
