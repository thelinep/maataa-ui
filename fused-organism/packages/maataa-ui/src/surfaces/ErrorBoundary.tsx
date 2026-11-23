/**
 * @maataa/ui/surfaces/ErrorBoundary
 * Catches render errors in a region and shows a recoverable fallback
 */

import { useT } from "../i18n/LocaleProvider";
import React from "react";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface ErrorFallbackProps {
  error: Error;
  /** Clears the error and renders the children again */
  reset: () => void;
  /** Region name, e.g. "Budget" */
  region?: string;
}

/**
 * ErrorFallback
 * Says what broke, keeps the rest of the page usable, and offers Try again.
 * Technical detail is behind a disclosure.
 */
export function ErrorFallback({ error, reset, region }: ErrorFallbackProps) {
  const t = useT();
  return (
    <div
      role="alert"
      style={{
        border: `1px solid ${colorTokens.interactive.error}`,
        borderRadius: 8,
        padding: spacingTokens.md,
        background: colorTokens.background.secondary,
        color: colorTokens.text.primary,
      }}
    >
      <strong>{region ? `${region} couldn't be shown.` : "Something went wrong here."}</strong>
      <p style={{ margin: `${spacingTokens.xs} 0 ${spacingTokens.sm}` }}>
        {t("The rest of the page still works. Your saved data is safe.")}
      </p>
      <Button variant="secondary" onClick={reset}>
        {t("Try again")}
      </Button>
      <details
        style={{
          marginTop: spacingTokens.sm,
          fontSize: typographyTokens.fontSize.xs,
          color: colorTokens.text.secondary,
        }}
      >
        <summary style={{ cursor: "pointer" }}>{t("Technical details")}</summary>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: typographyTokens.fontFamily.mono }}>
          {error.message}
        </pre>
      </details>
    </div>
  );
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  region?: string;
  /** Custom fallback; defaults to ErrorFallback */
  fallback?: (props: ErrorFallbackProps) => React.ReactNode;
  /** Report the error (logging, telemetry) */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/**
 * ErrorBoundary
 *
 * @example
 * ```tsx
 * <ErrorBoundary region="Budget"><BudgetTable /></ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  static displayName = "ErrorBoundary";
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const props = { error, reset: this.reset, region: this.props.region };
    return this.props.fallback ? this.props.fallback(props) : <ErrorFallback {...props} />;
  }
}
