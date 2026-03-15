import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPortal } from '@/components/dashboard/DashboardPortal';
import { NewsFeed } from '@/components/dashboard/NewsFeed';

export default function DashboardPage() {
  return (
    <div className="bg-white">
      {/* First screen — header + centered portal */}
      <div className="h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <DashboardPortal />
        </main>
      </div>

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
