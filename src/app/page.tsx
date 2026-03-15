import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { NewsFeed } from '@/components/dashboard/NewsFeed';

export default function DashboardPage() {
  return (
    <div className="bg-white">
      {/* First screen — aurora background + header + centered hero */}
      <AuroraBackground className="h-screen">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <DashboardPortal />
        </main>
      </AuroraBackground>

      {/* Below the fold — news */}
      <div className="border-t border-gray-100 bg-[#fafafa]">
        <NewsFeed />
        <footer className="pb-5 pt-1 text-center">
          <p className="text-[11px] text-gray-300 tracking-wide">
            &copy; 2026 7X &mdash; Emirates Post Group
          </p>
        </footer>
      </div>
    </div>
  );
}
