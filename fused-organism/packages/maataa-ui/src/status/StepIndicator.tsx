/**
 * @maataa/ui/status/StepIndicator
 * Multi-step progress for approval and submission flows
 */

import React from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export type StepState = "done" | "current" | "upcoming" | "error";

export interface Step {
  /** Stable id */
  id: string;
  label: string;
  /** Optional second line, e.g. who approved and when */
  description?: string;
  state: StepState;
}

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  steps: Step[];
  /**
   * Accessible name of the whole indicator
   * @default 'Progress'
   */
  label?: string;
  /** @default 'horizontal' */
  orientation?: "horizontal" | "vertical";
}

const stateText: Record<StepState, string> = {
  done: "Completed",
  current: "Current step",
  upcoming: "Not started",
  error: "Needs attention",
};

const mark: Record<StepState, string> = { done: "✓", current: "", upcoming: "", error: "!" };

/**
 * StepIndicator
 * An ordered list of steps. Each step's state is in words (not only colour),
 * and the current one carries aria-current="step".
 *
 * @example
 * ```tsx
 * <StepIndicator label="Approval" steps={[
 *   { id: "draft", label: "Draft", state: "done" },
 *   { id: "legal", label: "Legal review", state: "current" },
 *   { id: "publish", label: "Published", state: "upcoming" },
 * ]} />
 * ```
 */
export const StepIndicator = React.forwardRef<HTMLElement, StepIndicatorProps>(
  ({ steps, label = "Progress", orientation = "horizontal", style, ...props }, ref) => {
    const vertical = orientation === "vertical";
    return (
      <nav ref={ref} aria-label={label} style={style} {...props}>
        <ol
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            flexWrap: vertical ? "nowrap" : "wrap",
            gap: vertical ? spacingTokens.md : spacingTokens.lg,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {steps.map((step, i) => {
            const active = step.state === "current";
            const color =
              step.state === "done"
                ? colorTokens.interactive.success
                : step.state === "error"
                  ? colorTokens.interactive.error
                  : active
                    ? colorTokens.interactive.primary
                    : colorTokens.border.control;
            return (
              <li
                key={step.id}
                aria-current={active ? "step" : undefined}
                style={{ display: "flex", alignItems: "flex-start", gap: spacingTokens.sm }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flex: "0 0 auto",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${color}`,
                    background:
                      step.state === "done" || step.state === "error" ? color : "transparent",
                    color:
                      step.state === "done" || step.state === "error"
                        ? colorTokens.text.inverse
                        : colorTokens.text.primary,
                    fontWeight: 700,
                    fontSize: typographyTokens.fontSize.sm,
                  }}
                >
                  {mark[step.state] || i + 1}
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: active ? 700 : 500,
                      color: colorTokens.text.primary,
                      fontSize: typographyTokens.fontSize.md,
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      color: colorTokens.text.secondary,
                      fontSize: typographyTokens.fontSize.xs,
                    }}
                  >
                    {stateText[step.state]}
                    {step.description ? ` · ${step.description}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

StepIndicator.displayName = "StepIndicator";
