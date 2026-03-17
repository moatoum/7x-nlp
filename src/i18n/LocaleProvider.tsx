'use client';

import { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import type { Locale } from './config';
import { setCurrentLocale } from './config';
import en from './en';
import ar from './ar';

const dictionaries = { en, ar } as const;

interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, string | number>) => string;
  tArray: (key: string) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const dict = dictionaries[locale];
  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';

  // Sync locale to module-level state for non-React code (engine, etc.)
  useEffect(() => { setCurrentLocale(locale); }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: unknown = dict;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      if (typeof value !== 'string') return key;

      let result = value;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return result;
    },
    [dict]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const keys = key.split('.');
      let value: unknown = dict;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return [];
        }
      }
      if (Array.isArray(value)) return value as string[];
      return [];
    },
    [dict]
  );

  const contextValue = useMemo(() => ({ locale, dir, t, tArray }), [locale, dir, t, tArray]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within LocaleProvider');
  return ctx;
}
