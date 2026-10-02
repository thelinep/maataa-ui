/**
 * @maataa/ui/navigation/Breadcrumb
 * Navigation breadcrumb trail component
 */
import React from "react";
export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLOListElement> {
    /**
     * Breadcrumb items
     */
    items: BreadcrumbItem[];
    /**
     * Separator character
     * @default '/'
     */
    separator?: string;
    /**
     * Aria label for the breadcrumb nav
     * @default 'Breadcrumb'
     */
    ariaLabel?: string;
}
/**
 * Breadcrumb
 * Navigation breadcrumb trail component
 */
export declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLOListElement>>;
//# sourceMappingURL=Breadcrumb.d.ts.map