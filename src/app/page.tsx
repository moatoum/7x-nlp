import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { NewsFeed } from '@/components/dashboard/NewsFeed';

export default function DashboardPage() {
  return (
    <AuroraBackground className="min-h-screen">
      <DashboardHeader />
      <main className="flex-1 flex items-center justify-center">
        <DashboardPortal />
      </main>

      {/* News — overlays the aurora background */}
      <div className="pb-2">
        <NewsFeed />
        <footer className="pb-5 pt-1 text-center">
          <p className="text-[11px] text-gray-300/60 tracking-wide">
            &copy; 2026 7X &mdash; Emirates Post Group
          </p>
        </footer>
      </div>
    </AuroraBackground>
  );
}
