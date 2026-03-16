'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Inbox } from 'lucide-react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useAdminUiStore } from '@/store/adminUiStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/cn';

const ITEMS_PER_PAGE = 10;

const STATUS_DOT: Record<string, { color: string; label: string }> = {
  submitted: { color: 'bg-gray-400', label: 'Submitted' },
  in_review: { color: 'bg-blue-500', label: 'In Review' },
  approved: { color: 'bg-emerald-500', label: 'Approved' },
  rejected: { color: 'bg-red-500', label: 'Rejected' },
};

export function SubmissionsTable() {
  const submissions = useSubmissionsStore((s) => s.submissions);
  const searchQuery = useAdminUiStore((s) => s.searchQuery);
  const categoryFilter = useAdminUiStore((s) => s.categoryFilter);
  const statusFilter = useAdminUiStore((s) => s.statusFilter);
  const dateRange = useAdminUiStore((s) => s.dateRange);
  const entityFilter = useAdminUiStore((s) => s.entityFilter);
  const tagFilter = useAdminUiStore((s) => s.tagFilter);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...submissions];

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

    if (categoryFilter) {
      result = result.filter((s) => s.serviceCategory === categoryFilter);
    }

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (entityFilter) {
      result = result.filter((s) => s.entityType === entityFilter);
    }

    if (tagFilter) {
      result = result.filter((s) => s.tag === tagFilter);
    }

    if (dateRange !== 'all') {
      const rangeMs: Record<string, number> = {
        '7d': 7 * 86400000,
        '30d': 30 * 86400000,
        '90d': 90 * 86400000,
      };
      const cutoff = Date.now() - rangeMs[dateRange];
      result = result.filter((s) => s.createdAt >= cutoff);
    }

    result.sort((a, b) => b.createdAt - a.createdAt);
    return result;
  }, [submissions, searchQuery, categoryFilter, statusFilter, dateRange, entityFilter, tagFilter]);

  useEffect(() => setPage(0), [searchQuery, categoryFilter, statusFilter, dateRange, entityFilter, tagFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-gray-100"
    >
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[14px] font-medium text-gray-400">No submissions found</p>
          <p className="text-[12px] text-gray-300 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-5 py-3.5">
                    Reference
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-3 py-3.5">
                    Contact
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-3 py-3.5">
                    Category
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-3 py-3.5">
                    Date
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-3 py-3.5">
                    Status
                  </th>
                  <th className="text-left text-[11px] uppercase tracking-wider text-gray-300 font-medium px-3 py-3.5">
                    Tag
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((submission) => {
                  const statusConfig = STATUS_DOT[submission.status] || STATUS_DOT.submitted;
                  return (
                    <tr
                      key={submission.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="text-[13px] text-gray-900 hover:text-[#0020f5] transition-colors font-medium font-mono"
                        >
                          {submission.referenceNumber}
                        </Link>
                      </td>
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="text-[13px] text-gray-800">
                            {submission.contactName || '—'}
                          </p>
                          {submission.companyName && (
                            <p className="text-[11px] text-gray-400">{submission.companyName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-[13px] text-gray-500">
                          {submission.serviceCategory
                            ? CATEGORY_LABELS[submission.serviceCategory] || submission.serviceCategory
                            : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-gray-400">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-1.5 h-1.5 rounded-full', statusConfig.color)} />
                          <span className="text-[12px] text-gray-500 font-medium">{statusConfig.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        {submission.tag ? (
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                            submission.tag === 'NXN'
                              ? 'bg-violet-50 text-violet-600'
                              : 'bg-amber-50 text-amber-600'
                          )}>
                            {submission.tag}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-200">--</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                        </Link>
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
              <p className="text-[11px] text-gray-400">
                Showing {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} of{' '}
                {filtered.length} submissions
              </p>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    page === 0
                      ? 'text-gray-200 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-[12px] font-medium transition-all',
                        page === pageNum
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    page >= totalPages - 1
                      ? 'text-gray-200 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
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
