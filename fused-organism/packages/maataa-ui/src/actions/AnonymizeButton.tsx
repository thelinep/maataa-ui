/**
 * @maataa/ui/actions/AnonymizeButton
 * Irreversibly remove personal details from a record (DPDP / GDPR erasure)
 */

import { useT } from "../i18n/LocaleProvider";
import React, { useState } from "react";
import { Button, type ButtonProps } from "../primitives/Button";
import { TypedConfirmDialog } from "../surfaces/TypedConfirmDialog";

export interface AnonymizeButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** The person's name; typing it confirms */
  personName: string;
  /** What will be kept, e.g. "Hours and payments stay for the accounts." */
  retainedNote?: string;
  onAnonymize: () => void;
}

/**
 * AnonymizeButton
 * Typed confirmation, because it cannot be undone.
 *
 * @example
 * ```tsx
 * <AnonymizeButton personName="Asha Rao" onAnonymize={() => anonymize(id)} />
 * ```
 */
export const AnonymizeButton = React.forwardRef<HTMLButtonElement, AnonymizeButtonProps>(
  ({ personName, retainedNote, onAnonymize, variant = "danger", ...props }, ref) => {
    const t = useT();
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          ref={ref}
          variant={variant}
          aria-label={t("Anonymize {personName}", { personName })}
          onClick={() => setOpen(true)}
          {...props}
        >
          {t("Anonymize")}
        </Button>
        <TypedConfirmDialog
          isOpen={open}
          title={t("Anonymize {personName}?", { personName })}
          message={
            <>
              <p style={{ marginTop: 0 }}>
                Their name, contact details and photo are replaced with a placeholder. This cannot
                be undone.
              </p>
              {retainedNote && <p style={{ marginBottom: 0 }}>{retainedNote}</p>}
            </>
          }
          confirmationText={personName}
          confirmLabel={t("Anonymize")}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            onAnonymize();
          }}
        />
      </>
    );
  }
);

AnonymizeButton.displayName = "AnonymizeButton";
