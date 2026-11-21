/**
 * @maataa/ui/forms/AvatarUpload
 * Profile photo with change and remove
 */

import React, { useRef } from "react";
import { Avatar } from "../data/Avatar";
import { Button } from "../primitives/Button";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";

export interface AvatarUploadProps {
  /** Person's name, for initials and labels */
  name: string;
  /** Current photo URL */
  src?: string;
  /** Called with the chosen image */
  onSelect: (file: File) => void;
  /** Called on Remove; omit to hide the button */
  onRemove?: () => void;
  /** @default 'image/png,image/jpeg,image/webp' */
  accept?: string;
  /** Per-file limit in bytes @default 5 MB */
  maxSizeBytes?: number;
  /** Called when a file is too large or not an image */
  onError?: (message: string) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * AvatarUpload
 * Large avatar preview, then "Change photo" and "Remove photo" buttons that
 * name the person. Errors show under the buttons.
 *
 * @example
 * ```tsx
 * <AvatarUpload name="Asha Rao" src={photo} onSelect={uploadPhoto} onRemove={clearPhoto} />
 * ```
 */
export function AvatarUpload({
  name,
  src,
  onSelect,
  onRemove,
  accept = "image/png,image/jpeg,image/webp",
  maxSizeBytes = 5 * 1024 * 1024,
  onError,
  error,
  disabled,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: spacingTokens.md }}>
      <Avatar name={name} src={src} size="xl" />
      <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
        <div style={{ display: "flex", gap: spacingTokens.sm }}>
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            aria-label={`${src ? "Change" : "Add"} photo for ${name}`}
          >
            {src ? "Change photo" : "Add photo"}
          </Button>
          {onRemove && src && (
            <Button
              variant="tertiary"
              onClick={onRemove}
              disabled={disabled}
              aria-label={`Remove photo for ${name}`}
            >
              Remove
            </Button>
          )}
        </div>
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}>
          PNG, JPEG or WebP, up to {Math.round(maxSizeBytes / 1024 / 1024)} MB
        </span>
        {error && (
          <span
            role="alert"
            style={{ color: colorTokens.interactive.error, fontSize: typographyTokens.fontSize.xs }}
          >
            {error}
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
        data-testid="avatar-upload-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (!file.type.startsWith("image/")) onError?.("Choose an image file.");
          else if (file.size > maxSizeBytes)
            onError?.(`That photo is over ${Math.round(maxSizeBytes / 1024 / 1024)} MB.`);
          else onSelect(file);
        }}
      />
    </div>
  );
}

AvatarUpload.displayName = "AvatarUpload";
