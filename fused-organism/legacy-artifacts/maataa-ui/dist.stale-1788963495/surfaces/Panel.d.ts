/**
 * @maataa/ui/surfaces/Panel
 * Static layout region with an optional header, actions, and collapse toggle
 */
import React from "react";
export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * Panel heading
     */
    title?: React.ReactNode;
    /**
     * Controls or buttons rendered on the right side of the header
     */
    actions?: React.ReactNode;
    /**
     * Whether the panel can be collapsed by clicking its header
     * @default false
     */
    collapsible?: boolean;
    /**
     * Initial collapsed state when `collapsible` is true (uncontrolled)
     * @default false
     */
    defaultCollapsed?: boolean;
    /**
     * Controlled collapsed state. When provided, `onCollapsedChange` is
     * required to respond to the toggle.
     */
    collapsed?: boolean;
    /**
     * Called when the collapse toggle is used
     */
    onCollapsedChange?: (collapsed: boolean) => void;
    children?: React.ReactNode;
}
/**
 * Panel
 * A larger, static layout region — a dashboard sidebar section, a
 * settings group, an inspector pane — with an optional header, header
 * actions, and an optional collapse toggle. Unlike `Card`, `Panel` is
 * meant for full-height/full-width layout regions rather than
 * standalone content cards.
 *
 * @example
 * ```tsx
 * <Panel title="Filters" collapsible>
 *   <Checkbox label="Active only" />
 * </Panel>
 * ```
 */
export declare const Panel: React.ForwardRefExoticComponent<PanelProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Panel.d.ts.map