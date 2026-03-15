'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { formatDuration, formatNumber } from '@/lib/formatters';
import { StatCard } from './StatCard';

export function StatsOverview() {
  const { total, topCategory, avgDuration } = useAnalytics();
  const submissions = useSubmissionsStore((s) => s.submissions);

  const thisMonthCount = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return submissions.filter((s) => s.createdAt >= thirtyDaysAgo).length;
  }, [submissions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatCard
        label="Total Submissions"
        value={formatNumber(total)}
      />
      <StatCard
        label="Top Category"
        value={topCategory?.name || '—'}
        subtitle={topCategory ? `${topCategory.count} submissions` : undefined}
      />
      <StatCard
        label="Avg Duration"
        value={formatDuration(avgDuration)}
      />
      <StatCard
        label="This Month"
        value={formatNumber(thisMonthCount)}
        subtitle="Last 30 days"
      />
    </motion.div>
  );
}
