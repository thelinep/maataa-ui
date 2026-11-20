/**
 * JSON codec for film data.
 *
 * Records contain Date objects (createdAt, take timestamps, screening dates…)
 * that plain JSON turns into strings. encode() tags them as {"$date": iso} and
 * decode() revives them, so snapshots survive storage and network transport.
 */

const DATE_TAG = '$date';

function isTaggedDate(value: unknown): value is { [DATE_TAG]: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 1 &&
    typeof (value as Record<string, unknown>)[DATE_TAG] === 'string'
  );
}

/** Deep-copy `value` into a JSON-safe form with tagged dates */
export function encodeFilmData<T>(value: T): unknown {
  if (value instanceof Date) return { [DATE_TAG]: value.toISOString() };
  if (Array.isArray(value)) return value.map((item) => encodeFilmData(item));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item !== undefined) out[key] = encodeFilmData(item);
    }
    return out;
  }
  return value;
}

/** Inverse of encodeFilmData */
export function decodeFilmData<T>(value: unknown): T {
  if (isTaggedDate(value)) {
    const date = new Date(value[DATE_TAG]);
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid date in film data: ${value[DATE_TAG]}`);
    return date as unknown as T;
  }
  if (Array.isArray(value)) return value.map((item) => decodeFilmData(item)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = decodeFilmData(item);
    }
    return out as T;
  }
  return value as T;
}
