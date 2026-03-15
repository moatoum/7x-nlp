'use client';

import { motion } from 'framer-motion';
import { isArabic } from '@/lib/cn';

export function UserMessage({ content }: { content: string }) {
  const rtl = isArabic(content);
  const langClass = rtl ? 'font-arabic dir-rtl' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex py-1.5 ${rtl ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`bg-brand-blue text-white px-5 py-2.5 text-[14px] leading-relaxed max-w-[75%] font-medium ${langClass} ${rtl ? 'rounded-[18px] rounded-bl-[6px]' : 'rounded-[18px] rounded-br-[6px]'}`}>
        {content}
      </div>
    </motion.div>
  );
}
