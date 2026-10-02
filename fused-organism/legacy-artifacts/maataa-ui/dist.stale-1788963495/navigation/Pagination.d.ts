/**
 * @maataa/ui/navigation/Pagination
 * Page navigation component for tables and lists
 */
import React from "react";
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /**
     * Current page (1-indexed)
     */
    currentPage: number;
    /**
     * Total number of pages
     */
    totalPages: number;
    /**
     * Callback when page changes
     */
    onChange: (page: number) => void;
    /**
     * Maximum number of page buttons to show
     * @default 5
     */
    maxPages?: number;
    /**
     * Whether pagination is disabled
     */
    disabled?: boolean;
    /**
     * Show previous/next buttons
     * @default true
     */
    showNavButtons?: boolean;
    /**
     * Aria label for pagination nav
     * @default 'Pagination'
     */
    ariaLabel?: string;
}
/**
 * Pagination
 * Page navigation component with previous/next buttons and page numbers
 */
export declare const Pagination: React.ForwardRefExoticComponent<PaginationProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Pagination.d.ts.map