'use client';

import { StatsOverview } from '@/components/admin/StatsOverview';
import { SubmissionsChart } from '@/components/admin/SubmissionsChart';
import { CategoryChart } from '@/components/admin/CategoryChart';
import { RecentSubmissions } from '@/components/admin/RecentSubmissions';

export default function AdminOverviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Submission analytics and insights</p>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SubmissionsChart />
        <CategoryChart />
      </div>

      <div className="mt-8">
        <RecentSubmissions />
      </div>
    </div>
  );
}
