'use client';

import { motion } from 'framer-motion';
import type { ServiceMatch } from '@/engine/types';
import { useTranslation } from '@/i18n/LocaleProvider';
import { SERVICE_NAMES_AR, SERVICE_DESCRIPTIONS_AR, getCategoryLabelAr } from '@/engine/catalog';

export function RecommendedServices({ services }: { services: ServiceMatch[] }) {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="text-xs font-semibold text-gray-900 mb-3">{t('recommendedServices.title')}</h4>
      <div className="space-y-2.5">
        {services.map((service, i) => {
          const displayName = (isAr && SERVICE_NAMES_AR[service.id]) || service.name;
          const displayDesc = (isAr && SERVICE_DESCRIPTIONS_AR[service.id]) || service.description;
          const displayCat = isAr ? getCategoryLabelAr(service.category) : service.category;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="min-w-0">
                <h5 className="text-sm font-medium text-gray-900">{displayName}</h5>
                <p className="text-xs text-gray-500 mt-0.5">{displayCat}</p>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{displayDesc}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
