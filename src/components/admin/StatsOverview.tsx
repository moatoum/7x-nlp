'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { formatDuration, formatNumber } from '@/lib/formatters';
import { StatCard } from './StatCard';

export function StatsOverview() {
  const { total, avgDuration } = useAnalytics();
  const submissions = useSubmissionsStore((s) => s.submissions);

  const stats = useMemo(() => {
    const pending = submissions.filter((s) => s.status === 'submitted' || s.status === 'in_review').length;
    const approved = submissions.filter((s) => s.status === 'approved').length;
    const thisWeek = submissions.filter((s) => s.createdAt >= Date.now() - 7 * 86400000).length;
    const lastWeek = submissions.filter(
      (s) => s.createdAt >= Date.now() - 14 * 86400000 && s.createdAt < Date.now() - 7 * 86400000
    ).length;

    const weekTrend: 'up' | 'down' | 'neutral' =
      thisWeek > lastWeek ? 'up' : thisWeek < lastWeek ? 'down' : 'neutral';

    const weekPct = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

    return { pending, approved, thisWeek, weekTrend, weekPct };
  }, [submissions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatCard
        label="Total Requests"
        value={formatNumber(total)}
        icon={FileText}
        accentColor="#0020f5"
        trend={stats.weekTrend}
        trendValue={stats.weekPct !== 0 ? `${stats.weekPct > 0 ? '+' : ''}${stats.weekPct}%` : '0%'}
        subtitle="vs last week"
      />
      <StatCard
        label="Pending Review"
        value={formatNumber(stats.pending)}
        icon={AlertCircle}
        accentColor="#f59e0b"
        subtitle="Awaiting action"
      />
      <StatCard
        label="Approved"
        value={formatNumber(stats.approved)}
        icon={CheckCircle}
        accentColor="#10b981"
        subtitle={`${total > 0 ? Math.round((stats.approved / total) * 100) : 0}% approval rate`}
      />
      <StatCard
        label="Avg Response Time"
        value={formatDuration(avgDuration)}
        icon={Clock}
        accentColor="#8b5cf6"
        subtitle="Conversation duration"
      />
    </motion.div>
  );
}
