'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { timeAgo } from '@/lib/formatters';
import { cn } from '@/lib/cn';

const STATUS_DOT: Record<string, { color: string; label: string }> = {
  submitted: { color: 'bg-gray-400', label: 'Submitted' },
  in_review: { color: 'bg-blue-500', label: 'In Review' },
  approved: { color: 'bg-emerald-500', label: 'Approved' },
  rejected: { color: 'bg-red-500', label: 'Rejected' },
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
      className="bg-white rounded-2xl border border-gray-100"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-900">Recent Submissions</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Latest incoming requests</p>
        </div>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-900 transition-colors font-medium"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[13px] text-gray-400">No submissions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {recent.map((submission) => {
            const statusConfig = STATUS_DOT[submission.status] || STATUS_DOT.submitted;
            return (
              <Link
                key={submission.id}
                href={`/admin/submissions/${submission.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Status dot */}
                  <div className={cn('w-2 h-2 rounded-full shrink-0', statusConfig.color)} />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-900 font-mono">
                        {submission.referenceNumber}
                      </span>
                      {submission.companyName && (
                        <span className="text-[12px] text-gray-400 truncate">
                          {submission.companyName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">
                        {submission.serviceCategory
                          ? CATEGORY_LABELS[submission.serviceCategory] || submission.serviceCategory
                          : 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400">{timeAgo(submission.createdAt)}</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">{statusConfig.label}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
