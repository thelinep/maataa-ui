/**
 * @maataa/ui/forms/SearchInput
 * Text input specialized for search, with a search icon and clear button
 */
import React from "react";
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    /**
     * Current search value (controlled)
     */
    value?: string;
    /**
     * Called with the new value on every keystroke
     */
    onChange?: (value: string) => void;
    /**
     * Called when the clear button is pressed. Also clears the input's own value.
     */
    onClear?: () => void;
    /**
     * Placeholder text
     * @default 'Search...'
     */
    placeholder?: string;
}
/**
 * SearchInput
 * A text input pre-configured for search: a search icon on the left
 * and a clear ("×") button that appears once there's a value.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * <SearchInput value={query} onChange={setQuery} onClear={() => setQuery("")} />
 * ```
 */
export declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=SearchInput.d.ts.map