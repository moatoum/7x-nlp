'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/LocaleProvider';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';

    // Replace current locale prefix in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    // Store preference in cookie
    document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;

    router.push(newPath);
  };

  return (
    <button
      onClick={switchLocale}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-colors ${className}`}
    >
      {t('common.switchLanguage')}
    </button>
  );
}
