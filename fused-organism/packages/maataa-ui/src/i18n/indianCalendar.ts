/**
 * @maataa/ui/i18n/indianCalendar
 * Vikram Samvat (Hindu lunisolar) dates: samvat year, lunar month, paksha,
 * tithi and ritu, worked out from the sun and moon.
 *
 * How it works: the moon's lead over the sun (in 12° steps) gives the tithi.
 * The sidereal sign (Lahiri ayanamsa) the sun is in at the new moon names the
 * lunar month, and a month whose two new moons fall in the same sign is an
 * adhik (extra) month. The ritu follows the sun's sidereal sign, two signs per
 * ritu. By custom the tithi is the one running at local sunrise.
 *
 * Accuracy: sun to about 0.01°, moon to about 0.05° (Meeus, chapters 25
 * and 47), so a tithi boundary can be off by a few minutes. Dates near a
 * boundary, and the rare kshaya (dropped) month, may differ from a printed
 * panchang. Use a panchang for religious timings.
 */

import { msg } from "./LocaleProvider";
import { sunTimes } from "../maps/skyMath";

const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
/** Average rate at which the moon pulls ahead of the sun, in degrees per day */
const ELONGATION_RATE = 360 / 29.530588;

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const julianDay = (date: Date) => date.getTime() / DAY_MS + 2440587.5;
const centuries = (date: Date) => (julianDay(date) - 2451545) / 36525;

/** Apparent tropical longitude of the sun, degrees (Meeus 25, low precision) */
export function sunLongitude(date: Date): number {
  const T = centuries(date);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * RAD;
  return norm(L0 + C - 0.00569 - 0.00478 * Math.sin(omega));
}

/** [D, M, M′, F, coefficient in millionths of a degree] — Meeus table 47.A */
const MOON_TERMS: readonly (readonly [number, number, number, number, number])[] = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602],
  [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348],
  [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069],
];

/** Tropical longitude of the moon, degrees (Meeus 47, main terms) */
export function moonLongitude(date: Date): number {
  const T = centuries(date);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  let sum = 0;
  for (const [d, m, mp, f, c] of MOON_TERMS) {
    const arg = (d * D + m * M + mp * Mp + f * F) * RAD;
    sum += c * Math.sin(arg) * (m === 0 ? 1 : Math.abs(m) === 1 ? E : E * E);
  }
  const A1 = (119.75 + 131.849 * T) * RAD;
  const A2 = (53.09 + 479264.29 * T) * RAD;
  sum += 3958 * Math.sin(A1) + 1962 * Math.sin((Lp - F) * RAD) + 318 * Math.sin(A2);
  return norm(Lp + sum / 1e6);
}

/** Lahiri (Chitrapaksha) ayanamsa, degrees */
export function lahiriAyanamsa(date: Date): number {
  return 23.853 + 1.39694 * centuries(date);
}

/** Sidereal sign of the sun: 0 = Mesha (Aries) … 11 = Meena (Pisces) */
export function sunSign(date: Date): number {
  return Math.floor(norm(sunLongitude(date) - lahiriAyanamsa(date)) / 30);
}

/** How far the moon is ahead of the sun, 0–360° */
export function elongation(date: Date): number {
  return norm(moonLongitude(date) - sunLongitude(date));
}

/** The new moon (elongation 0°) nearest before or after `date`. */
function newMoon(date: Date, direction: -1 | 1): Date {
  const e = elongation(date);
  const days = direction < 0 ? -e / ELONGATION_RATE : (360 - e) / ELONGATION_RATE;
  let t = date.getTime() + days * DAY_MS;
  for (let i = 0; i < 6; i++) {
    let off = elongation(new Date(t));
    if (off > 180) off -= 360;
    t -= (off / ELONGATION_RATE) * DAY_MS;
  }
  return new Date(t);
}

/** Month names, Chaitra first. Translate with t(). */
export const VIKRAM_MONTHS = [
  msg("Chaitra"),
  msg("Vaishakha"),
  msg("Jyeshtha"),
  msg("Ashadha"),
  msg("Shravana"),
  msg("Bhadrapada"),
  msg("Ashvin"),
  msg("Kartika"),
  msg("Margashirsha"),
  msg("Pausha"),
  msg("Magha"),
  msg("Phalguna"),
] as const;

/** Tithi names 1–14, then Purnima (shukla 15) and Amavasya (krishna 15). */
export const TITHIS = [
  msg("Pratipada"),
  msg("Dwitiya"),
  msg("Tritiya"),
  msg("Chaturthi"),
  msg("Panchami"),
  msg("Shashthi"),
  msg("Saptami"),
  msg("Ashtami"),
  msg("Navami"),
  msg("Dashami"),
  msg("Ekadashi"),
  msg("Dwadashi"),
  msg("Trayodashi"),
  msg("Chaturdashi"),
  msg("Purnima"),
  msg("Amavasya"),
] as const;

/** The six ritus (seasons), Vasant first. */
export const RITUS = [
  msg("Vasant"),
  msg("Grishma"),
  msg("Varsha"),
  msg("Sharad"),
  msg("Hemant"),
  msg("Shishir"),
] as const;

export type MonthSystem = "purnimanta" | "amanta";

export interface VikramDateOptions {
  /**
   * How months are counted. "purnimanta" (months end at full moon) is used
   * across north India with Vikram Samvat; "amanta" (months end at new moon)
   * in Gujarat, Maharashtra and the south. @default "purnimanta"
   */
  system?: MonthSystem;
  /** Where sunrise is taken for the day's tithi. @default New Delhi (28.61, 77.21) */
  lat?: number;
  lng?: number;
  /**
   * "sunrise": the tithi running at that day's local sunrise, as panchangs do.
   * "instant": the tithi at exactly `date`. @default "sunrise"
   */
  at?: "sunrise" | "instant";
}

export interface VikramDate {
  /** Vikram Samvat year; the year turns at Chaitra Shukla Pratipada */
  samvat: number;
  /** Shaka (Shalivahana) year, Samvat − 135 */
  shaka: number;
  /** Month, 0 = Chaitra … 11 = Phalguna */
  month: number;
  /** English month name, for t() */
  monthName: (typeof VIKRAM_MONTHS)[number];
  /** True in an adhik (extra) month */
  adhik: boolean;
  paksha: "shukla" | "krishna";
  /** 1–15 within the paksha */
  tithi: number;
  /** English tithi name, for t() */
  tithiName: (typeof TITHIS)[number];
  /** 0 = Vasant … 5 = Shishir */
  ritu: number;
  rituName: (typeof RITUS)[number];
  system: MonthSystem;
  /** The moment the tithi was read at (sunrise, or `date`) */
  observedAt: Date;
}

/** The moment whose tithi names the day: the latest local sunrise at or before `date`. */
function dayStart(date: Date, lat: number, lng: number): Date {
  const riseOn = (d: Date) => sunTimes(d, lat, lng).sunrise;
  let sunrise = riseOn(date);
  if (!sunrise || Number.isNaN(sunrise.getTime())) return date; // no sunrise (polar day or night)
  if (sunrise.getTime() > date.getTime()) {
    const earlier = riseOn(new Date(date.getTime() - DAY_MS));
    if (earlier) sunrise = earlier;
  } else if (date.getTime() - sunrise.getTime() > DAY_MS) {
    const next = riseOn(new Date(date.getTime() + DAY_MS / 2));
    if (next && next.getTime() <= date.getTime()) sunrise = next;
  }
  return sunrise;
}

/**
 * vikramDate
 * The Vikram Samvat date for a moment.
 *
 * @example
 * ```ts
 * vikramDate(new Date("2026-03-19T12:00:00+05:30"));
 * // { samvat: 2083, monthName: "Chaitra", paksha: "shukla", tithi: 1, rituName: "Vasant", … }
 * ```
 */
export function vikramDate(date: Date, options: VikramDateOptions = {}): VikramDate {
  const { system = "purnimanta", lat = 28.61, lng = 77.21, at = "sunrise" } = options;
  const when = at === "sunrise" ? dayStart(date, lat, lng) : date;

  const e = elongation(when);
  const index = Math.min(29, Math.floor(e / 12));
  const paksha = index < 15 ? "shukla" : "krishna";
  const tithi = (index % 15) + 1;

  const prev = newMoon(when, -1);
  const next = newMoon(when, 1);
  const signAtPrev = sunSign(prev);
  const amantaMonth = (signAtPrev + 1) % 12;
  const adhikAmanta = signAtPrev === sunSign(next);

  let month = amantaMonth;
  let adhik = adhikAmanta;
  if (system === "purnimanta" && paksha === "krishna" && !adhikAmanta) {
    month = (amantaMonth + 1) % 12;
    adhik = false;
  }

  // The year turns at the new moon that starts amanta Chaitra.
  const gregorianYear = when.getUTCFullYear();
  const beforeNewYear = amantaMonth >= 9 && when.getUTCMonth() < 6;
  const samvat = gregorianYear + (beforeNewYear ? 56 : 57);

  const ritu = Math.floor(((sunSign(when) + 1) % 12) / 2);

  return {
    samvat,
    shaka: samvat - 135,
    month,
    monthName: VIKRAM_MONTHS[month]!,
    adhik,
    paksha,
    tithi,
    tithiName: TITHIS[tithi === 15 ? (paksha === "shukla" ? 14 : 15) : tithi - 1]!,
    ritu,
    rituName: RITUS[ritu]!,
    system,
    observedAt: when,
  };
}
