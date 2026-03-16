import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { AuroraBackground } from '@/components/ui/AuroraBackground';

export default function DashboardPage() {
  return (
    <AuroraBackground className="min-h-screen">
      <DashboardHeader />
      <main className="flex-1 flex items-center justify-center pt-28 pb-20 md:pt-32 md:pb-24">
        <DashboardPortal />
      </main>

      <div className="pb-2">
        <footer className="pb-5 pt-1 text-center">
          <p className="text-[11px] text-gray-300/60 tracking-wide">
            &copy; 2026 7X &mdash; Emirates Post Group
          </p>
        </footer>
      </div>
    </AuroraBackground>
  );
}
