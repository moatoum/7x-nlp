export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

// Module-level locale state — set by LocaleProvider, read by engine
let currentLocale: Locale = 'en';
export function setCurrentLocale(locale: Locale) { currentLocale = locale; }
export function getCurrentLocale(): Locale { return currentLocale; }
