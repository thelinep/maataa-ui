import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @maataa/ui/navigation/Pagination
 * Page navigation component for tables and lists
 */
import React from "react";
import { Stack } from "../primitives/Stack";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { colorTokens, spacingTokens, radiusTokens } from "../tokens";
/**
 * Pagination
 * Page navigation component with previous/next buttons and page numbers
 */
export const Pagination = React.forwardRef(({ currentPage, totalPages, onChange, maxPages = 5, disabled = false, showNavButtons = true, ariaLabel = "Pagination", ...props }, ref) => {
    // Calculate visible page range
    const getPageNumbers = () => {
        const pages = [];
        let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
        const end = Math.min(totalPages, start + maxPages - 1);
        if (end - start + 1 < maxPages) {
            start = Math.max(1, end - maxPages + 1);
        }
        if (start > 1) {
            pages.push(1);
            if (start > 2)
                pages.push("...");
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < totalPages) {
            if (end < totalPages - 1)
                pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && !disabled) {
            onChange(page);
        }
    };
    const pageNumbers = getPageNumbers();
    return (_jsx("nav", { ref: ref, "aria-label": ariaLabel, ...props, children: _jsxs(Stack, { direction: "horizontal", spacing: "sm", align: "center", justify: "center", children: [showNavButtons && (_jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1 || disabled, "aria-label": "Previous page", style: {
                        padding: `${spacingTokens.sm} ${spacingTokens.md}`,
                        border: `1px solid ${colorTokens.border.primary}`,
                        borderRadius: radiusTokens.md,
                        backgroundColor: colorTokens.background.primary,
                        color: colorTokens.interactive.primary,
                        cursor: currentPage === 1 || disabled ? "not-allowed" : "pointer",
                        opacity: currentPage === 1 || disabled ? 0.6 : 1,
                        transition: "all 0.2s ease",
                    }, children: "\u2190 Previous" })), _jsx("div", { style: { display: "flex", gap: spacingTokens.sm, alignItems: "center" }, children: pageNumbers.map((page, index) => {
                        const isEllipsis = page === "...";
                        const isActive = page === currentPage;
                        return (_jsx(React.Fragment, { children: isEllipsis ? (_jsx("span", { style: {
                                    color: colorTokens.text.secondary,
                                    padding: `${spacingTokens.sm} ${spacingTokens.xs}`,
                                }, "aria-hidden": "true", children: page })) : (_jsx("button", { onClick: () => handlePageChange(page), disabled: disabled, "aria-current": isActive ? "page" : undefined, "aria-label": `Go to page ${page}`, style: {
                                    width: "36px",
                                    height: "36px",
                                    padding: 0,
                                    border: `1px solid ${isActive ? colorTokens.interactive.primary : colorTokens.border.primary}`,
                                    borderRadius: radiusTokens.md,
                                    backgroundColor: isActive
                                        ? colorTokens.interactive.primary
                                        : colorTokens.background.primary,
                                    color: isActive ? colorTokens.background.primary : colorTokens.text.primary,
                                    fontWeight: isActive ? 600 : 500,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    opacity: disabled ? 0.6 : 1,
                                    transition: "all 0.2s ease",
                                }, children: page })) }, `${page}-${index}`));
                    }) }), showNavButtons && (_jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages || disabled, "aria-label": "Next page", style: {
                        padding: `${spacingTokens.sm} ${spacingTokens.md}`,
                        border: `1px solid ${colorTokens.border.primary}`,
                        borderRadius: radiusTokens.md,
                        backgroundColor: colorTokens.background.primary,
                        color: colorTokens.interactive.primary,
                        cursor: currentPage === totalPages || disabled ? "not-allowed" : "pointer",
                        opacity: currentPage === totalPages || disabled ? 0.6 : 1,
                        transition: "all 0.2s ease",
                    }, children: "Next \u2192" })), _jsxs(VisuallyHidden, { children: ["Page ", currentPage, " of ", totalPages] })] }) }));
});
Pagination.displayName = "Pagination";
//# sourceMappingURL=Pagination.js.map