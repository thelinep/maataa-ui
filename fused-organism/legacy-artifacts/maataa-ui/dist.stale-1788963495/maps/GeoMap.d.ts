/**
 * @maataa/ui/maps/GeoMap
 * A lat/lng pin map with no external tile-service dependency
 */
import React from "react";
import { type GeoBounds } from "./mapUtils";
export type GeoMapPinStatus = "default" | "active" | "alert";
export interface GeoMapPin {
    id: string;
    label: string;
    lat: number;
    lng: number;
    status?: GeoMapPinStatus;
    color?: string;
}
export interface GeoMapProps {
    pins: GeoMapPin[];
    width?: number;
    height?: number;
    /**
     * A pre-rendered map image (URL or data URI) covering `bounds` exactly,
     * shown beneath the pins. Without one, a plain surface with a lat/lng
     * graticule is drawn instead — this component projects coordinates, it
     * doesn't fetch map tiles.
     */
    backgroundImage?: string;
    /** The lat/lng extent the canvas covers. @default the whole world */
    bounds?: GeoBounds;
    selectedId?: string | null;
    onSelect?: (id: string | null) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * GeoMap
 * Projects lat/lng pins onto a plain equirectangular canvas — supply your
 * own `backgroundImage` (an exported map/satellite image covering
 * `bounds`) for real geography, or omit it for a graticule-only canvas.
 * Click a pin or its label to select it.
 *
 * @example
 * ```tsx
 * <GeoMap
 *   pins={[
 *     { id: "sf", label: "San Francisco", lat: 37.77, lng: -122.42 },
 *     { id: "nyc", label: "New York", lat: 40.71, lng: -74.01, status: "active" },
 *   ]}
 * />
 * ```
 */
export declare const GeoMap: React.ForwardRefExoticComponent<GeoMapProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=GeoMap.d.ts.map