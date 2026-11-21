/**
 * @maataa/ui/actions/ArchiveButton
 * Archive or restore a record, with a confirmation step
 */

import React, { useState } from "react";
import { Button, type ButtonProps } from "../primitives/Button";
import { ConfirmDialog } from "../surfaces/ConfirmDialog";

export interface ArchiveButtonProps extends Omit<ButtonProps, "onClick" | "onChange" | "children"> {
  /** What is being archived, e.g. "Monsoon Diaries" */
  itemName: string;
  /** Whether the record is archived now */
  archived: boolean;
  /** Called with the new archived state after confirmation (restore needs none) */
  onChange: (archived: boolean) => void;
}

/**
 * ArchiveButton
 * "Archive" asks first; "Restore" acts at once because it is the undo.
 * The label names the item for screen-reader users scanning a button list.
 *
 * @example
 * ```tsx
 * <ArchiveButton itemName={project.name} archived={project.archived} onChange={setArchived} />
 * ```
 */
export const ArchiveButton = React.forwardRef<HTMLButtonElement, ArchiveButtonProps>(
  ({ itemName, archived, onChange, variant = "secondary", ...props }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          ref={ref}
          variant={variant}
          aria-label={`${archived ? "Restore" : "Archive"} ${itemName}`}
          onClick={() => (archived ? onChange(false) : setOpen(true))}
          {...props}
        >
          {archived ? "Restore" : "Archive"}
        </Button>
        <ConfirmDialog
          isOpen={open}
          title={`Archive ${itemName}?`}
          message="It moves out of active lists. Nothing is deleted, and you can restore it at any time."
          confirmLabel="Archive"
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            onChange(true);
          }}
        />
      </>
    );
  }
);

ArchiveButton.displayName = "ArchiveButton";
