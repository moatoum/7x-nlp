import type { Submission } from '@/engine/types';
import { CATEGORY_LABELS } from '@/engine/catalog';

export function computeTotalSubmissions(submissions: Submission[]): number {
  return submissions.length;
}

export function computeByCategory(submissions: Submission[]): { category: string; label: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const s of submissions) {
    const cat = s.serviceCategory || 'unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([category, count]) => ({
      category,
      label: CATEGORY_LABELS[category] || category,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeOverTime(
  submissions: Submission[],
  range: '7d' | '30d' | '90d' | 'all'
): { date: string; count: number }[] {
  const now = Date.now();
  const rangeMs: Record<string, number> = {
    '7d': 7 * 86400000,
    '30d': 30 * 86400000,
    '90d': 90 * 86400000,
    all: now,
  };
  const cutoff = now - rangeMs[range];
  const filtered = submissions.filter((s) => s.createdAt >= cutoff);

  const buckets: Record<string, number> = {};
  for (const s of filtered) {
    const date = new Date(s.createdAt).toISOString().slice(0, 10);
    buckets[date] = (buckets[date] || 0) + 1;
  }

  return Object.entries(buckets)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeAvgDuration(submissions: Submission[]): number {
  if (submissions.length === 0) return 0;
  const total = submissions.reduce((sum, s) => sum + s.conversationDuration, 0);
  return total / submissions.length;
}

export function computeTopCategory(submissions: Submission[]): { name: string; count: number } | null {
  const byCategory = computeByCategory(submissions);
  if (byCategory.length === 0) return null;
  return { name: byCategory[0].label, count: byCategory[0].count };
}

export function computeByStatus(submissions: Submission[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of submissions) {
    counts[s.status] = (counts[s.status] || 0) + 1;
  }
  return counts;
}
