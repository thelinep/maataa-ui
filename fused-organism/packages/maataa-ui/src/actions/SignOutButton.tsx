/**
 * @maataa/ui/actions/SignOutButton
 * Sign out, warning first if there are unsynced changes
 */

import React, { useState } from "react";
import { Button, type ButtonProps } from "../primitives/Button";
import { ConfirmDialog } from "../surfaces/ConfirmDialog";

export interface SignOutButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  onSignOut: () => void;
  /** Changes not yet synced; when > 0 it asks first */
  unsyncedCount?: number;
}

/**
 * SignOutButton
 *
 * @example
 * ```tsx
 * <SignOutButton onSignOut={signOut} unsyncedCount={queue.length} />
 * ```
 */
export const SignOutButton = React.forwardRef<HTMLButtonElement, SignOutButtonProps>(
  ({ onSignOut, unsyncedCount = 0, variant = "tertiary", ...props }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          ref={ref}
          variant={variant}
          onClick={() => (unsyncedCount > 0 ? setOpen(true) : onSignOut())}
          {...props}
        >
          Sign out
        </Button>
        <ConfirmDialog
          isOpen={open}
          title="Sign out with unsynced changes?"
          message={`${unsyncedCount} ${unsyncedCount === 1 ? "change hasn't" : "changes haven't"} reached the server yet. If you sign out now, ${unsyncedCount === 1 ? "it stays" : "they stay"} on this device and sync next time you sign in here.`}
          confirmLabel="Sign out anyway"
          destructive
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            onSignOut();
          }}
        />
      </>
    );
  }
);

SignOutButton.displayName = "SignOutButton";
