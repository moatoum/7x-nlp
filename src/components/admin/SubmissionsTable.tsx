'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useAdminUiStore } from '@/store/adminUiStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

const ITEMS_PER_PAGE = 10;

const STATUS_BADGE: Record<string, { variant: 'default' | 'blue' | 'green'; className?: string; label: string }> = {
  submitted: { variant: 'default', label: 'Submitted' },
  in_review: { variant: 'blue', label: 'In Review' },
  approved: { variant: 'green', label: 'Approved' },
  rejected: { variant: 'default', className: 'bg-red-50 text-red-600', label: 'Rejected' },
};

export function SubmissionsTable() {
  const submissions = useSubmissionsStore((s) => s.submissions);
  const searchQuery = useAdminUiStore((s) => s.searchQuery);
  const categoryFilter = useAdminUiStore((s) => s.categoryFilter);
  const statusFilter = useAdminUiStore((s) => s.statusFilter);
  const dateRange = useAdminUiStore((s) => s.dateRange);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...submissions];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.contactName?.toLowerCase().includes(q) ||
          s.contactEmail?.toLowerCase().includes(q) ||
          s.companyName?.toLowerCase().includes(q) ||
          s.referenceNumber.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((s) => s.serviceCategory === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const rangeMs: Record<string, number> = {
        '7d': 7 * 86400000,
        '30d': 30 * 86400000,
        '90d': 90 * 86400000,
      };
      const cutoff = Date.now() - rangeMs[dateRange];
      result = result.filter((s) => s.createdAt >= cutoff);
    }

    // Sort by date descending
    result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [submissions, searchQuery, categoryFilter, statusFilter, dateRange]);

  // Reset page when filters change
  useEffect(() => setPage(0), [searchQuery, categoryFilter, statusFilter, dateRange]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-xl border border-gray-100"
    >
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400">No submissions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-5 py-3">
                    Reference
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 py-3">
                    Company
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 py-3">
                    Category
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 py-3">
                    Date
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((submission) => {
                  const statusConfig = STATUS_BADGE[submission.status] || STATUS_BADGE.submitted;
                  return (
                    <tr
                      key={submission.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="text-sm text-gray-900 hover:text-brand-blue transition-colors font-medium"
                        >
                          {submission.referenceNumber}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {submission.companyName || '—'}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {submission.serviceCategory
                          ? CATEGORY_LABELS[submission.serviceCategory] || submission.serviceCategory
                          : '—'}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-3 py-3">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} of{' '}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    page === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 px-2">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    page >= totalPages - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
