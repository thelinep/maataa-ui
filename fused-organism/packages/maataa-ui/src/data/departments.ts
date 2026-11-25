/**
 * @maataa/ui/data/departments
 * Film and event production departments, as translatable labels
 */

import { msg } from "../i18n/LocaleProvider";

/** Departments in the order call sheets usually list them. Translate with t(). */
export const PRODUCTION_DEPARTMENTS = [
  msg("Direction"),
  msg("Production"),
  msg("Cast"),
  msg("Camera"),
  msg("Lighting"),
  msg("Grip"),
  msg("Sound"),
  msg("Art"),
  msg("Costume"),
  msg("Make-up and hair"),
  msg("Stunts"),
  msg("Animal handling"),
  msg("Locations"),
  msg("Transport"),
  msg("Catering"),
  msg("Editing"),
  msg("VFX"),
  msg("Music"),
] as const;

export type ProductionDepartment = (typeof PRODUCTION_DEPARTMENTS)[number];
