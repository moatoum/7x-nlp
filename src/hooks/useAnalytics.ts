'use client';

import { useMemo } from 'react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useAdminUiStore } from '@/store/adminUiStore';
import {
  computeTotalSubmissions,
  computeByCategory,
  computeOverTime,
  computeAvgDuration,
  computeTopCategory,
  computeByStatus,
} from '@/lib/analytics';

export function useAnalytics() {
  const submissions = useSubmissionsStore((s) => s.submissions);
  const dateRange = useAdminUiStore((s) => s.dateRange);

  const total = useMemo(() => computeTotalSubmissions(submissions), [submissions]);
  const byCategory = useMemo(() => computeByCategory(submissions), [submissions]);
  const overTime = useMemo(() => computeOverTime(submissions, dateRange), [submissions, dateRange]);
  const avgDuration = useMemo(() => computeAvgDuration(submissions), [submissions]);
  const topCategory = useMemo(() => computeTopCategory(submissions), [submissions]);
  const byStatus = useMemo(() => computeByStatus(submissions), [submissions]);

  return { total, byCategory, overTime, avgDuration, topCategory, byStatus };
}
