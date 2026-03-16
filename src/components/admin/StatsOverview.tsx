'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useLeadsStore } from '@/store/leadsStore';
import { formatDuration, formatNumber } from '@/lib/formatters';
import { StatCard } from './StatCard';

export function StatsOverview() {
  const { total, avgDuration } = useAnalytics();
  const submissions = useSubmissionsStore((s) => s.submissions);
  const leads = useLeadsStore((s) => s.leads);

  const stats = useMemo(() => {
    const pending = submissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
    const actioned = submissions.filter((s) => s.status === 'actioned' || s.status === 'closed').length;
    const thisWeek = submissions.filter((s) => s.createdAt >= Date.now() - 7 * 86400000).length;
    const lastWeek = submissions.filter(
      (s) => s.createdAt >= Date.now() - 14 * 86400000 && s.createdAt < Date.now() - 7 * 86400000
    ).length;

    const weekTrend: 'up' | 'down' | 'neutral' =
      thisWeek > lastWeek ? 'up' : thisWeek < lastWeek ? 'down' : 'neutral';

    const weekPct = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

    const activeLeads = leads.filter((l) => l.status === 'new' || l.status === 'contacted').length;

    return { pending, actioned, thisWeek, weekTrend, weekPct, activeLeads };
  }, [submissions, leads]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
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
        label="Actioned"
        value={formatNumber(stats.actioned)}
        icon={CheckCircle}
        accentColor="#10b981"
        subtitle={`${total > 0 ? Math.round((stats.actioned / total) * 100) : 0}% completion rate`}
      />
      <StatCard
        label="Active Leads"
        value={formatNumber(stats.activeLeads)}
        icon={Users}
        accentColor="#3b82f6"
        subtitle={`${leads.length} total`}
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
