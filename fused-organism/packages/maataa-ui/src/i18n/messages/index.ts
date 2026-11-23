/**
 * Built-in translation catalogs, keyed by the English source text.
 * English needs no catalog: the source text is the English UI text.
 */

import { hi } from "./hi";

/** A translation catalog: English source text → translated text. */
export type Messages = Readonly<Record<string, string>>;

/** Catalogs that ship with MAATAA, by language code. */
export const builtInMessages: Readonly<Record<string, Messages>> = { hi };

export { hi };
