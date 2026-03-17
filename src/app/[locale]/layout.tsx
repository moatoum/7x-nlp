import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, type Locale } from '@/i18n/config';
import { LocaleProvider } from '@/i18n/LocaleProvider';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;
  const dir = validLocale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={validLocale} dir={dir} className={validLocale === 'ar' ? 'font-arabic' : ''}>
      <LocaleProvider locale={validLocale}>{children}</LocaleProvider>
    </div>
  );
}
