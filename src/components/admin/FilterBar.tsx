'use client';

import { Search, X, RotateCcw } from 'lucide-react';
import { useAdminUiStore } from '@/store/adminUiStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { cn } from '@/lib/cn';

const STATUS_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

const DATE_RANGE_OPTIONS = [
  { value: 'all' as const, label: 'All Time' },
  { value: '7d' as const, label: '7d' },
  { value: '30d' as const, label: '30d' },
  { value: '90d' as const, label: '90d' },
];

export function FilterBar() {
  const searchQuery = useAdminUiStore((s) => s.searchQuery);
  const categoryFilter = useAdminUiStore((s) => s.categoryFilter);
  const statusFilter = useAdminUiStore((s) => s.statusFilter);
  const dateRange = useAdminUiStore((s) => s.dateRange);
  const entityFilter = useAdminUiStore((s) => s.entityFilter);
  const tagFilter = useAdminUiStore((s) => s.tagFilter);
  const setSearchQuery = useAdminUiStore((s) => s.setSearchQuery);
  const setCategoryFilter = useAdminUiStore((s) => s.setCategoryFilter);
  const setStatusFilter = useAdminUiStore((s) => s.setStatusFilter);
  const setDateRange = useAdminUiStore((s) => s.setDateRange);
  const setEntityFilter = useAdminUiStore((s) => s.setEntityFilter);
  const setTagFilter = useAdminUiStore((s) => s.setTagFilter);
  const resetFilters = useAdminUiStore((s) => s.resetFilters);

  const hasActiveFilters =
    searchQuery || categoryFilter || statusFilter || dateRange !== '30d' || entityFilter || tagFilter;

  return (
    <div className="space-y-3">
      {/* Search + Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, company, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={categoryFilter || ''}
          onChange={(e) => setCategoryFilter(e.target.value || null)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all appearance-none cursor-pointer min-w-[150px]"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={entityFilter || ''}
          onChange={(e) => setEntityFilter(e.target.value || null)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all appearance-none cursor-pointer min-w-[130px]"
        >
          <option value="">All Entities</option>
          <option value="A business">Business</option>
          <option value="A governmental entity">Government</option>
        </select>

        <select
          value={tagFilter || ''}
          onChange={(e) => setTagFilter(e.target.value || null)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all appearance-none cursor-pointer min-w-[110px]"
        >
          <option value="">All Tags</option>
          <option value="NXN">NXN</option>
          <option value="EMX">EMX</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-[12px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Status pills + Date range */}
      <div className="flex items-center justify-between">
        {/* Status pills */}
        <div className="flex items-center gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                'h-8 px-3.5 rounded-lg text-[12px] font-medium transition-all',
                statusFilter === opt.value
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date range pills */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {DATE_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={cn(
                'h-7 px-3 rounded-md text-[11px] font-medium transition-all',
                dateRange === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
