/**
 * @maataa/ui/maps/mapUtils
 * Small internal helpers shared by VenueFloorPlan and GeoMap. Not part of
 * the public API.
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
export const WORLD_BOUNDS = { minLat: -90, maxLat: 90, minLng: -180, maxLng: 180 };
/**
 * Projects a lat/lng pair onto a `width`x`height` canvas using a simple
 * equirectangular (plate carrée) projection over the given bounds — no
 * external mapping/tile service required. Values outside `bounds` are
 * clamped onto the canvas edge rather than dropped.
 */
export function projectLatLng(lat, lng, bounds, width, height) {
    const latSpan = bounds.maxLat - bounds.minLat || 1;
    const lngSpan = bounds.maxLng - bounds.minLng || 1;
    const x = clamp(((lng - bounds.minLng) / lngSpan) * width, 0, width);
    const y = clamp(((bounds.maxLat - lat) / latSpan) * height, 0, height);
    return { x, y };
}
/** Latitude/longitude graticule lines at a fixed step, for a background-free GeoMap. */
export function graticuleLines(bounds, step = 30) {
    const lats = [];
    for (let lat = Math.ceil(bounds.minLat / step) * step; lat <= bounds.maxLat; lat += step) {
        lats.push(lat);
    }
    const lngs = [];
    for (let lng = Math.ceil(bounds.minLng / step) * step; lng <= bounds.maxLng; lng += step) {
        lngs.push(lng);
    }
    return { lats, lngs };
}
//# sourceMappingURL=mapUtils.js.map