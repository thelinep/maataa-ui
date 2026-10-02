/**
 * @maataa/ui/maps/VenueFloorPlan
 * A zoomable/pannable floor-plan canvas with placeable, selectable zones
 */
import React from "react";
export type FloorPlanZoneStatus = "available" | "reserved" | "occupied" | "blocked";
export interface FloorPlanZone {
    id: string;
    label: string;
    /** Position and size in the floor plan's own coordinate space (e.g. meters). */
    x: number;
    y: number;
    width: number;
    /** Ignored when `shape` is `"circle"` — `width` is used as the diameter. */
    height: number;
    shape?: "rect" | "circle";
    status?: FloorPlanZoneStatus;
    /** Overrides the status color entirely. */
    color?: string;
    disabled?: boolean;
}
export interface VenueFloorPlanProps {
    zones: FloorPlanZone[];
    /** The full extent of the floor plan, in the same units as each zone's `x`/`y`/`width`/`height`. */
    planWidth: number;
    planHeight: number;
    /** Rendered canvas size in pixels. */
    width?: number;
    height?: number;
    /** Optional floor-plan image (URL or data URI) shown beneath the zones, covering the full plan extent. */
    backgroundImage?: string;
    /** Shows a reference grid over the plan. @default true when there's no backgroundImage */
    showGrid?: boolean;
    /** Currently selected zone id (controlled). */
    selectedId?: string | null;
    onSelect?: (id: string | null) => void;
    /** Enables wheel-to-zoom, drag-to-pan, and the zoom toolbar. @default true */
    zoomable?: boolean;
    minZoom?: number;
    maxZoom?: number;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * VenueFloorPlan
 * An SVG floor plan for exhibitions and venues: place rectangular or
 * circular zones (booths, seats, rooms) at real plan coordinates, color
 * them by status, and let people click or keyboard-select one. Pan by
 * dragging the background, zoom with the wheel or the on-screen controls.
 *
 * @example
 * ```tsx
 * <VenueFloorPlan
 *   planWidth={40}
 *   planHeight={24}
 *   zones={[
 *     { id: "a1", label: "A1", x: 2, y: 2, width: 4, height: 3, status: "available" },
 *     { id: "a2", label: "A2", x: 7, y: 2, width: 4, height: 3, status: "reserved" },
 *   ]}
 * />
 * ```
 */
export declare const VenueFloorPlan: React.ForwardRefExoticComponent<VenueFloorPlanProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=VenueFloorPlan.d.ts.map