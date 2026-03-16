'use client';

import { motion } from 'framer-motion';
import type { ServiceMatch } from '@/engine/types';

export function RecommendedServices({ services }: { services: ServiceMatch[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="text-xs font-semibold text-gray-900 mb-3">Recommended Services</h4>
      <div className="space-y-2.5">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="min-w-0">
              <h5 className="text-sm font-medium text-gray-900">{service.name}</h5>
              <p className="text-xs text-gray-500 mt-0.5">{service.category}</p>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
