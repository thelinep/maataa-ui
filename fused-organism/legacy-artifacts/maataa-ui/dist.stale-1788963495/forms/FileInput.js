import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/forms/FileInput
 * Styled file picker button backed by a native, visually-hidden input
 */
import React, { useId, useRef } from "react";
import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldShell } from "./FieldShell";
/**
 * FileInput
 * A styled button that triggers the native file picker, with the
 * chosen file name(s) displayed underneath. Built on `FieldShell` for
 * consistent label/error/helper-text presentation.
 *
 * @example
 * ```tsx
 * const [files, setFiles] = useState<FileList | null>(null);
 * <FileInput
 *   label="Attachment"
 *   buttonLabel="Upload file"
 *   onChange={setFiles}
 *   fileNames={files ? Array.from(files).map((f) => f.name) : []}
 * />
 * ```
 */
export const FileInput = React.forwardRef(({ onChange, fileNames = [], label, error, helperText, required, buttonLabel = "Choose file", id, disabled, multiple, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const internalRef = useRef(null);
    const mergedRef = ref || internalRef;
    return (_jsx(FieldShell, { label: label, htmlFor: inputId, required: required, error: error, helperText: helperText, children: _jsxs("div", { children: [_jsx("input", { ref: mergedRef, id: inputId, type: "file", multiple: multiple, disabled: disabled, onChange: (e) => onChange?.(e.target.files), style: {
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        padding: 0,
                        margin: "-1px",
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        border: 0,
                    }, ...props }), _jsx("label", { htmlFor: inputId, style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: spacingTokens.xs,
                        padding: "8px 16px",
                        fontSize: typographyTokens.fontSize.md,
                        fontWeight: typographyTokens.fontWeight.medium,
                        color: colorTokens.text.primary,
                        backgroundColor: colorTokens.background.secondary,
                        border: `1px solid ${error ? colorTokens.interactive.error : colorTokens.border.primary}`,
                        borderRadius: radiusTokens.md,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }, children: buttonLabel }), fileNames.length > 0 && (_jsx("div", { style: {
                        marginTop: spacingTokens.xs,
                        fontSize: typographyTokens.fontSize.sm,
                        color: colorTokens.text.secondary,
                    }, children: fileNames.join(", ") }))] }) }));
});
FileInput.displayName = "FileInput";
//# sourceMappingURL=FileInput.js.map