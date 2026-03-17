'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { WiresCanvas } from '@/components/ui/WiresCanvas';
import { useTranslation } from '@/i18n/LocaleProvider';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Animated wave lines — behind content */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <WiresCanvas />
      </div>

      <div className="relative z-[1] flex flex-col flex-1 w-full min-h-screen">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-start">
          <DashboardPortal />
        </main>

        <footer className="pb-4 pt-1 text-center">
          <p className="text-[11px] text-gray-300/60 tracking-wide">
            {t('dashboard.copyright')}
          </p>
        </footer>
      </div>
    </div>
  );
}
