import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function isArabic(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

export function arabicClass(text: string): string {
  return isArabic(text) ? 'font-arabic dir-rtl' : '';
}
