'use client';

import { motion } from 'framer-motion';

export function UserMessage({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end py-1.5"
    >
      <div className="bg-brand-blue text-white px-5 py-2.5 rounded-[18px] rounded-br-[6px] text-[14px] leading-relaxed max-w-[75%] font-medium">
        {content}
      </div>
    </motion.div>
  );
}
