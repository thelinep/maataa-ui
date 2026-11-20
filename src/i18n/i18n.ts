/**
 * i18next Instance
 * Phase I: Internationalization
 */

import i18next from 'i18next';

/**
 * i18next instance
 * Lazy initialized on first use
 */
let initialized = false;

/**
 * Get i18n instance with lazy initialization
 */
export function getI18n() {
  if (!initialized) {
    // Resources will be loaded via config
    initialized = true;
  }
  return i18next;
}

/**
 * Check if i18n is initialized
 */
export function isI18nInitialized(): boolean {
  return initialized;
}

/**
 * Change language
 */
export async function changeLanguage(lang: string): Promise<void> {
  const instance = getI18n();
  await instance.changeLanguage(lang);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): string {
  return getI18n().language;
}

/**
 * Translate key
 */
export function t(key: string, defaultValue?: string): string {
  return getI18n().t(key, defaultValue || key);
}

export default getI18n();
