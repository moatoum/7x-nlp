'use client';

import { motion } from 'framer-motion';
import type { ServiceMatch } from '@/engine/types';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export function ServiceCardInline({ service, index }: { service: ServiceMatch; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border border-gray-100 rounded-[14px] p-4 bg-white hover:border-gray-200 hover:shadow-card transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-[14px] font-semibold text-gray-900">{service.name}</h4>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-blue transition-colors" />
          </div>
          <p className="text-[12px] text-gray-400 mt-0.5">{service.category}</p>
        </div>
        <Badge variant={service.confidence >= 70 ? 'green' : 'blue'}>
          {service.confidence}%
        </Badge>
      </div>
      <p className="text-[13px] text-gray-500 mt-2.5 leading-relaxed">{service.description}</p>
    </motion.div>
  );
}
