/**
 * @maataa/ui/data/chartUtils
 * Small internal helpers shared by the data-visualization components.
 * Not part of the public API.
 */
/**
 * Formats a number the way a stat tile expects: full value with thousands
 * commas under 1,000; otherwise compacted to one decimal place with a
 * K/M/B suffix (trailing ".0" dropped). An optional prefix (e.g. "$") is
 * applied before the digits.
 */
export declare function formatCompactNumber(value: number, prefix?: string): string;
/**
 * Picks a "nice" set of axis tick values (0-anchored) covering [0, maxValue].
 * Always returns at least two ticks (0 and maxValue) for degenerate input.
 */
export declare function niceTicks(maxValue: number, count?: number): number[];
/** Builds a smooth-ish SVG path `d` string (straight segments) through points. */
export declare function buildLinePath(points: {
    x: number;
    y: number;
}[]): string;
/** Builds a closed area path (line path + down to baseline + back to start). */
export declare function buildAreaPath(points: {
    x: number;
    y: number;
}[], baselineY: number): string;
//# sourceMappingURL=chartUtils.d.ts.map