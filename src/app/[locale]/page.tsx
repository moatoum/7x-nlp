'use client';

import { useTranslation } from '@/i18n/LocaleProvider';

export default function LandingPage() {
  const { locale } = useTranslation();
  const src = locale === 'ar' ? '/landing-ar.html' : '/landing-en.html';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fff',
      }}
    >
      <iframe
        src={src}
        allow="autoplay"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="LINK Landing"
      />
    </div>
  );
}
