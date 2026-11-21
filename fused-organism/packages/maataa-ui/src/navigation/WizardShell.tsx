/**
 * @maataa/ui/navigation/WizardShell
 * Multi-step flow: progress, step content, Back / Next / Skip / Save for later
 */

import React, { useEffect, useId, useRef } from "react";
import { StepIndicator, type Step } from "../status/StepIndicator";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface WizardStep {
  id: string;
  label: string;
  /** Can be skipped */
  optional?: boolean;
}

export interface WizardShellProps {
  /** Accessible name for the progress, e.g. "Set up your workspace" */
  title: string;
  steps: WizardStep[];
  /** Index of the current step */
  current: number;
  /** Steps with problems, by id */
  errors?: string[];
  onBack: () => void;
  /** Validate and go on; on the last step this finishes */
  onNext: () => void;
  onSkip?: () => void;
  /** Saves progress so the person can resume later */
  onSaveForLater?: () => void;
  /** @default 'Finish' */
  finishLabel?: string;
  busy?: boolean;
  children: React.ReactNode;
}

/**
 * WizardShell
 * Shows "Step 2 of 5" and moves focus to the step heading on every change,
 * so screen-reader users hear where they are. Skip appears only for
 * optional steps.
 *
 * @example
 * ```tsx
 * <WizardShell title="Set up" steps={steps} current={i} onBack={back} onNext={next}><AccountTypeSelector … /></WizardShell>
 * ```
 */
export function WizardShell({
  title,
  steps,
  current,
  errors = [],
  onBack,
  onNext,
  onSkip,
  onSaveForLater,
  finishLabel = "Finish",
  busy = false,
  children,
}: WizardShellProps) {
  const hid = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [current]);
  const indicator: Step[] = steps.map((s, i) => ({
    id: s.id,
    label: s.label,
    state: errors.includes(s.id)
      ? "error"
      : i < current
        ? "done"
        : i === current
          ? "current"
          : "upcoming",
  }));
  const step = steps[current];
  const last = current === steps.length - 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.lg }}>
      <StepIndicator label={title} steps={indicator} />
      <section
        aria-labelledby={hid}
        style={{ display: "flex", flexDirection: "column", gap: spacingTokens.md }}
      >
        <div>
          <div
            style={{ fontSize: typographyTokens.fontSize.sm, color: colorTokens.text.secondary }}
          >
            Step {current + 1} of {steps.length}
            {step?.optional ? " · optional" : ""}
          </div>
          <h2
            id={hid}
            ref={heading}
            tabIndex={-1}
            style={{ margin: 0, fontSize: typographyTokens.fontSize["3xl"], outline: "none" }}
          >
            {step?.label}
          </h2>
        </div>
        {children}
      </section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: spacingTokens.sm,
          flexWrap: "wrap",
          borderTop: `1px solid ${colorTokens.border.primary}`,
          paddingTop: spacingTokens.md,
        }}
      >
        <div style={{ display: "flex", gap: spacingTokens.sm }}>
          {current > 0 && (
            <Button variant="secondary" onClick={onBack} disabled={busy}>
              Back
            </Button>
          )}
          {onSaveForLater && (
            <Button variant="tertiary" onClick={onSaveForLater} disabled={busy}>
              Save and finish later
            </Button>
          )}
        </div>
        <div style={{ display: "flex", gap: spacingTokens.sm }}>
          {step?.optional && onSkip && !last && (
            <Button variant="tertiary" onClick={onSkip} disabled={busy}>
              Skip this step
            </Button>
          )}
          <Button onClick={onNext} disabled={busy} aria-busy={busy || undefined}>
            {last ? finishLabel : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

WizardShell.displayName = "WizardShell";
