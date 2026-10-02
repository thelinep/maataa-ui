/**
 * @maataa/ui/data/EmptyState
 * Placeholder for a table, chart, or list with nothing to show
 */
import React from "react";
export interface EmptyStateProps {
    /** A short glyph or icon shown above the title. */
    icon?: React.ReactNode;
    title: string;
    description?: string;
    /** e.g. a `<Button>` inviting the user to create the first item. */
    action?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * EmptyState
 * A centered placeholder for a `DataTable`, chart, or any list with no
 * data yet — an icon, a title, optional description, and an optional
 * call-to-action.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📊"
 *   title="No results yet"
 *   description="Data will appear here once the first event comes in."
 * />
 * ```
 */
export declare const EmptyState: React.ForwardRefExoticComponent<EmptyStateProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=EmptyState.d.ts.map