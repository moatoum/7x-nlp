'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { usePulseStore } from '@/store/pulseStore';
import { timeAgo } from '@/lib/formatters';

interface PulseHeaderProps {
  onRefresh: () => void;
}

export function PulseHeader({ onRefresh }: PulseHeaderProps) {
  const lastRefreshed = usePulseStore((s) => s.lastRefreshed);
  const maritimeLoading = usePulseStore((s) => s.maritime.loading);
  const aviationLoading = usePulseStore((s) => s.aviation.loading);
  const newsLoading = usePulseStore((s) => s.news.loading);
  const isLoading = maritimeLoading || aviationLoading || newsLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-end justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-none">
          Control Tower
        </h1>
        <p className="text-[13px] text-gray-400 mt-1.5">
          UAE Logistics Intelligence
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-600">Live</span>
        </div>

        {lastRefreshed && (
          <span className="text-[11px] text-gray-300">
            {timeAgo(lastRefreshed)}
          </span>
        )}

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all"
          title="Refresh"
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
}
