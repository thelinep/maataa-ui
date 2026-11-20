/**
 * useTranslation Hook
 * Phase I: Internationalization
 * 
 * Wrapper around i18next for component use
 */

import { useCallback } from 'react';
import i18n from 'i18next';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { SupportedLanguage, saveLanguageToStorage } from '../i18n/config';

export interface UseTranslationReturn {
  t: (key: string, defaultValue?: string) => string;
  i18n: typeof i18n;
  language: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  formatDate: (date: Date, format?: string) => string;
  formatNumber: (number: number, minimumFractionDigits?: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  pluralize: (key: string, count: number) => string;
}

/**
 * useTranslation Hook
 * Provides translation utilities with language switching
 */
export function useTranslation(): UseTranslationReturn {
  const { t, i18n: i18nInstance } = useI18nextTranslation();
  const language = i18nInstance.language as SupportedLanguage;

  /**
   * Change language and persist to localStorage
   */
  const changeLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      await i18nInstance.changeLanguage(newLanguage);
      saveLanguageToStorage(newLanguage);
    },
    [i18nInstance]
  );

  /**
   * Format date according to locale
   */
  const formatDate = useCallback(
    (date: Date, format?: string) => {
      const locale = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US';
      
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(format === 'time' ? {
          hour: '2-digit',
          minute: '2-digit',
        } : {}),
      }).format(date);
    },
    [language]
  );

  /**
   * Format number according to locale
   */
  const formatNumber = useCallback(
    (number: number, minimumFractionDigits: number = 0) => {
      const locale = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US';
      
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits,
      }).format(number);
    },
    [language]
  );

  /**
   * Format currency according to locale
   */
  const formatCurrency = useCallback(
    (amount: number, currency: string = 'USD') => {
      const locale = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US';
      
      // Map currency codes to symbols for supported languages
      const currencyMap: Record<string, string> = {
        USD: 'USD',
        INR: 'INR',
        EUR: 'EUR',
        GBP: 'GBP',
        MXN: 'MXN',
      };

      const targetCurrency = currencyMap[currency] || 'USD';

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
      }).format(amount);
    },
    [language]
  );

  /**
   * Handle pluralization
   */
  const pluralize = useCallback(
    (key: string, count: number) => {
      if (count === 1) {
        return t(`${key}_singular`);
      } else {
        return t(`${key}_plural`);
      }
    },
    [t]
  );

  return {
    t,
    i18n: i18nInstance,
    language,
    changeLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    pluralize,
  };
}

/**
 * Get language name
 */
export function getLanguageName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    es: 'Español',
  };
  return names[language];
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(language: SupportedLanguage): string {
  const flags: Record<SupportedLanguage, string> = {
    en: '🇺🇸',
    hi: '🇮🇳',
    es: '🇪🇸',
  };
  return flags[language];
}

export default useTranslation;
