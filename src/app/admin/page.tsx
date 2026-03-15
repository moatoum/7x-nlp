'use client';

import { motion } from 'framer-motion';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { SubmissionsChart } from '@/components/admin/SubmissionsChart';
import { CategoryChart } from '@/components/admin/CategoryChart';
import { RecentSubmissions } from '@/components/admin/RecentSubmissions';

export default function AdminOverviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-gray-400 mt-1">Overview of submission analytics and activity</p>
      </motion.div>

      <StatsOverview />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <SubmissionsChart />
        <CategoryChart />
      </div>

      {/* Recent */}
      <div className="mt-6">
        <RecentSubmissions />
      </div>
    </div>
  );
}
