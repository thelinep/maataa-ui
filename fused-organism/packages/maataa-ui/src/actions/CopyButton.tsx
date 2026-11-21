/**
 * @maataa/ui/actions/CopyButton
 * Copy text to the clipboard and confirm it
 */

import React, { useEffect, useState } from "react";
import { Button, type ButtonProps } from "../primitives/Button";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Text to copy */
  value: string;
  /** What is copied, e.g. "share link" — names the button "Copy share link" */
  what: string;
  /** Visible label @default 'Copy' */
  children?: React.ReactNode;
  onCopied?: () => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand?.("copy") ?? false;
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * CopyButton
 * Says "Copied" in a status region (and on the button for 2 s). If the
 * browser blocks the clipboard it says so, so people can copy by hand.
 *
 * @example
 * ```tsx
 * <CopyButton value={url} what="share link" />
 * ```
 */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, what, children = "Copy", onCopied, variant = "secondary", ...props }, ref) => {
    const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
    useEffect(() => {
      if (state === "idle") return;
      const t = setTimeout(() => setState("idle"), 2000);
      return () => clearTimeout(t);
    }, [state]);
    return (
      <>
        <Button
          ref={ref}
          variant={variant}
          aria-label={`Copy ${what}`}
          onClick={async () => {
            const ok = await copyText(value);
            setState(ok ? "copied" : "failed");
            if (ok) onCopied?.();
          }}
          {...props}
        >
          {state === "copied" ? "Copied ✓" : children}
        </Button>
        <VisuallyHidden role="status">
          {state === "copied"
            ? `${what[0].toUpperCase()}${what.slice(1)} copied`
            : state === "failed"
              ? `Couldn't copy. Select the ${what} and copy it by hand.`
              : ""}
        </VisuallyHidden>
      </>
    );
  }
);

CopyButton.displayName = "CopyButton";
