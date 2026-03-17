import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { WiresCanvas } from '@/components/ui/WiresCanvas';

export default function DashboardPage() {
  return (
    <AuroraBackground className="min-h-screen">
      {/* Animated wave lines — behind content, on top of the Aurora bg */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <WiresCanvas />
      </div>

      <div className="relative z-[1] flex flex-col flex-1 w-full">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center pt-28 pb-20 md:pt-32 md:pb-24">
          <DashboardPortal />
        </main>

        <div className="pb-2">
          <footer className="pb-5 pt-1 text-center">
            <p className="text-[11px] text-gray-300/60 tracking-wide">
              &copy; 2026 LINK &mdash; Powered by 7X, Emirates Post Group
            </p>
          </footer>
        </div>
      </div>
    </AuroraBackground>
  );
}
