/**
 * @maataa/ui/surfaces/StatusScreen
 * Full-page states: permission denied, session expired, done, not found
 */

import React, { useEffect, useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface StatusScreenProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  message: React.ReactNode;
  /** Decorative mark shown above the title */
  icon?: React.ReactNode;
  /** Buttons or links: what the person can do next */
  actions?: React.ReactNode;
  /** Heading level @default 1 */
  headingLevel?: 1 | 2;
  /** Move focus to the heading on mount, for route changes @default true */
  focusOnMount?: boolean;
}

/**
 * StatusScreen
 * A centred message with a real heading, which takes focus so screen-reader
 * users hear where they landed. Always offers a way forward.
 *
 * @example
 * ```tsx
 * <StatusScreen title="You don't have access" message="Ask the project owner to add you." actions={<Button>Go to projects</Button>} />
 * ```
 */
export const StatusScreen = React.forwardRef<HTMLElement, StatusScreenProps>(
  (
    { title, message, icon, actions, headingLevel = 1, focusOnMount = true, style, ...props },
    ref
  ) => {
    const h = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
      if (focusOnMount) h.current?.focus();
    }, [focusOnMount]);
    const Heading = `h${headingLevel}` as "h1" | "h2";
    return (
      <section
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: spacingTokens.md,
          padding: `${spacingTokens.xl} ${spacingTokens.lg}`,
          maxWidth: 560,
          margin: "0 auto",
          ...style,
        }}
        {...props}
      >
        {icon && (
          <div aria-hidden="true" style={{ fontSize: 48, lineHeight: 1 }}>
            {icon}
          </div>
        )}
        <Heading
          ref={h}
          tabIndex={-1}
          style={{
            margin: 0,
            fontSize: typographyTokens.fontSize["3xl"],
            color: colorTokens.text.primary,
            outline: "none",
          }}
        >
          {title}
        </Heading>
        <div style={{ color: colorTokens.text.secondary }}>{message}</div>
        {actions && (
          <div
            style={{
              display: "flex",
              gap: spacingTokens.sm,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {actions}
          </div>
        )}
      </section>
    );
  }
);

StatusScreen.displayName = "StatusScreen";

type Preset = Omit<StatusScreenProps, "title" | "message"> & {
  title?: string;
  message?: React.ReactNode;
};

/** "You don't have access" with who to ask */
export const PermissionDeniedScreen = ({
  title = "You don't have access to this page",
  message,
  ...p
}: Preset & { owner?: string }) => (
  <StatusScreen
    icon="🔒"
    title={title}
    message={
      message ??
      "Ask the project owner or an admin to give you access. Your request isn't sent automatically."
    }
    {...p}
  />
);

/** Signed out after inactivity; work kept locally */
export const SessionExpiredScreen = ({
  title = "You've been signed out",
  message,
  ...p
}: Preset) => (
  <StatusScreen
    icon="⏱"
    title={title}
    message={
      message ??
      "You were inactive for a while, so we signed you out to keep your account safe. Sign in again to pick up where you left off."
    }
    {...p}
  />
);

/** End of onboarding */
export const OnboardingCompleteScreen = ({ title = "You're all set", message, ...p }: Preset) => (
  <StatusScreen
    icon="🎬"
    title={title}
    message={
      message ?? "Your workspace is ready. You can change any of these choices later in Settings."
    }
    {...p}
  />
);

/** Unknown route */
export const NotFoundScreen = ({ title = "We couldn't find that page", message, ...p }: Preset) => (
  <StatusScreen
    icon="🧭"
    title={title}
    message={message ?? "The link may be old, or the page may have moved."}
    {...p}
  />
);
