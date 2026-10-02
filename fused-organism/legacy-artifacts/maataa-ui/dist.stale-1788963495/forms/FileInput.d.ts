/**
 * @maataa/ui/forms/FileInput
 * Styled file picker button backed by a native, visually-hidden input
 */
import React from "react";
export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
    /**
     * Called with the selected FileList when the user picks file(s)
     */
    onChange?: (files: FileList | null) => void;
    /**
     * Currently selected file names, shown below the picker button.
     * Pass this to keep the component controlled/display-only; otherwise
     * the browser's native file input state is the source of truth.
     */
    fileNames?: string[];
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    /**
     * Text shown on the picker button
     * @default 'Choose file'
     */
    buttonLabel?: string;
}
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
export declare const FileInput: React.ForwardRefExoticComponent<FileInputProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=FileInput.d.ts.map