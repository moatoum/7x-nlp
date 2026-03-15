'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { timeAgo } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';


const STATUS_BADGE: Record<string, { variant: 'default' | 'blue' | 'green'; className?: string; label: string }> = {
  submitted: { variant: 'default', label: 'Submitted' },
  in_review: { variant: 'blue', label: 'In Review' },
  approved: { variant: 'green', label: 'Approved' },
  rejected: { variant: 'default', className: 'bg-red-50 text-red-600', label: 'Rejected' },
};

export function RecentSubmissions() {
  const submissions = useSubmissionsStore((s) => s.submissions);

  const recent = useMemo(
    () =>
      [...submissions]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    [submissions]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
      className="bg-white rounded-xl border border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Recent Submissions</h3>
        <Link
          href="/admin/submissions"
          className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          View all &rarr;
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No submissions yet</p>
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-5 pb-2">
                  Reference
                </th>
                <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 pb-2">
                  Company
                </th>
                <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 pb-2">
                  Category
                </th>
                <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 pb-2">
                  Date
                </th>
                <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 pb-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((submission) => {
                const statusConfig = STATUS_BADGE[submission.status] || STATUS_BADGE.submitted;
                return (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/admin/submissions/${submission.id}`}
                        className="text-sm text-gray-900 hover:text-brand-blue transition-colors font-medium"
                      >
                        {submission.referenceNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {submission.companyName || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {submission.serviceCategory
                        ? CATEGORY_LABELS[submission.serviceCategory] || submission.serviceCategory
                        : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">
                      {timeAgo(submission.createdAt)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant={statusConfig.variant}
                        className={statusConfig.className}
                      >
                        {statusConfig.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
