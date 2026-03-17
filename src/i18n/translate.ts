// Standalone translation function for use outside React components (hooks, engine, etc.)
import { getCurrentLocale } from './config';
import en from './en';
import ar from './ar';

const dictionaries = { en, ar } as const;

/** Translate a dot-notation key using the current module-level locale */
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[getCurrentLocale()];
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
}
