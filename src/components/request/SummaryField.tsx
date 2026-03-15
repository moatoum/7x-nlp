'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SummaryFieldProps {
  label: string;
  value: string | string[] | null;
}

export function SummaryField({ label, value }: SummaryFieldProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  const hasValue = displayValue && displayValue.length > 0;

  return (
    <div className="py-2">
      <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <AnimatePresence mode="wait">
        {hasValue ? (
          <motion.div
            key={displayValue}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-gray-900"
          >
            {displayValue}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300"
          >
            —
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
