/**
 * @maataa/ui/forms/AvatarUpload
 * Profile photo with change and remove
 */

import { useT } from "../i18n/LocaleProvider";
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
  const t = useT();
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
            aria-label={
              src ? t("Change photo for {name}", { name }) : t("Add photo for {name}", { name })
            }
          >
            {src ? t("Change photo") : t("Add photo")}
          </Button>
          {onRemove && src && (
            <Button
              variant="tertiary"
              onClick={onRemove}
              disabled={disabled}
              aria-label={t("Remove photo for {name}", { name })}
            >
              {t("Remove")}
            </Button>
          )}
        </div>
        <span style={{ color: colorTokens.text.secondary, fontSize: typographyTokens.fontSize.xs }}>
          {t("PNG, JPEG or WebP, up to {value} MB", {
            value: Math.round(maxSizeBytes / 1024 / 1024),
          })}
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
            onError?.(
              t("That photo is over {size} MB.", { size: Math.round(maxSizeBytes / 1024 / 1024) })
            );
          else onSelect(file);
        }}
      />
    </div>
  );
}

AvatarUpload.displayName = "AvatarUpload";
