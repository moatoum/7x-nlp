'use client';

import { motion } from 'framer-motion';

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-full">
      <motion.div
        className="h-full bg-brand-blue rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
