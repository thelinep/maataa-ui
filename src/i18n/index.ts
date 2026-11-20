/**
 * i18n Module Exports
 * Phase I: Internationalization
 */

export { default as i18n, getI18n, isI18nInitialized, changeLanguage, getCurrentLanguage, t } from './i18n';
export { initializeI18n, getSystemLanguage, getStoredLanguage, saveLanguageToStorage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, NAMESPACES } from './config';
export type { SupportedLanguage, Namespace } from './config';
