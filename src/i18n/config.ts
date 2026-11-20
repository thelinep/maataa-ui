/**
 * i18next Configuration
 * Phase I: Internationalization
 * 
 * Multi-language support with i18next
 */

import i18n from 'i18next';

export type SupportedLanguage = 'en' | 'hi' | 'es';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string; flag: string }> = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

/**
 * Get system language preference
 */
export function getSystemLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  if (browserLang === 'hi') return 'hi';
  if (browserLang === 'es') return 'es';
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get stored language preference
 */
export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof localStorage === 'undefined') return null;

  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'hi' || stored === 'es') {
    return stored;
  }

  return null;
}

/**
 * Save language to localStorage
 */
export function saveLanguageToStorage(language: SupportedLanguage): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', language);
  }
}

/**
 * i18next namespace structure
 */
export const NAMESPACES = {
  common: 'common',
  workflows: 'workflows',
  errors: 'errors',
  success: 'success',
  forms: 'forms',
  buttons: 'buttons',
  labels: 'labels',
  placeholders: 'placeholders',
};

export type Namespace = typeof NAMESPACES[keyof typeof NAMESPACES];

/**
 * Initialize i18n
 * To be called in app entry point
 */
export async function initializeI18n(): Promise<void> {
  // Import translations
  const enTranslations = await import('./locales/en.json');
  const hiTranslations = await import('./locales/hi.json');
  const esTranslations = await import('./locales/es.json');

  if (!i18n.isInitialized) {
    i18n.init({
      fallbackLng: FALLBACK_LANGUAGE,
      lng: getStoredLanguage() || getSystemLanguage(),
      ns: Object.values(NAMESPACES),
      defaultNS: NAMESPACES.common,
      interpolation: {
        escapeValue: false, // React already protects against XSS
      },
      resources: {
        en: enTranslations.default,
        hi: hiTranslations.default,
        es: esTranslations.default,
      },
    });
  }
}

export default i18n;
