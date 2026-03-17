'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleProvider';

export function RequestEmpty() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-card flex items-center justify-center mb-5">
        <Layers className="w-6 h-6 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{t('request.requestSummary')}</h3>
      <p className="text-[13px] text-gray-400 mt-2 max-w-[200px] leading-relaxed">
        {t('request.emptyDescription')}
      </p>
      <div className="mt-6 flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-gray-200" />
        <div className="w-1 h-1 rounded-full bg-gray-200" />
        <div className="w-1 h-1 rounded-full bg-gray-200" />
      </div>
    </motion.div>
  );
}
