/**
 * @maataa/ui/maps/mapUtils
 * Small internal helpers shared by VenueFloorPlan and GeoMap. Not part of
 * the public API.
 */
export declare function clamp(value: number, min: number, max: number): number;
export interface GeoBounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}
export declare const WORLD_BOUNDS: GeoBounds;
/**
 * Projects a lat/lng pair onto a `width`x`height` canvas using a simple
 * equirectangular (plate carrée) projection over the given bounds — no
 * external mapping/tile service required. Values outside `bounds` are
 * clamped onto the canvas edge rather than dropped.
 */
export declare function projectLatLng(lat: number, lng: number, bounds: GeoBounds, width: number, height: number): {
    x: number;
    y: number;
};
/** Latitude/longitude graticule lines at a fixed step, for a background-free GeoMap. */
export declare function graticuleLines(bounds: GeoBounds, step?: number): {
    lats: number[];
    lngs: number[];
};
//# sourceMappingURL=mapUtils.d.ts.map