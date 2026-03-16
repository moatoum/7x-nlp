'use client';

import { motion } from 'framer-motion';
import type { ServiceMatch } from '@/engine/types';
import { Check } from 'lucide-react';

interface ServiceCardInlineProps {
  service: ServiceMatch;
  index: number;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

export function ServiceCardInline({ service, index, selectable, selected, onToggle }: ServiceCardInlineProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={selectable ? () => onToggle?.(service.id) : undefined}
      className={`w-full text-left border rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
        selectable ? 'cursor-pointer' : 'cursor-default'
      } ${
        selected
          ? 'border-gray-300 bg-gray-50'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {selectable && (
          <div
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${
              selected
                ? 'bg-gray-900 border-gray-900'
                : 'border border-gray-200 bg-white'
            }`}
          >
            {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h4 className="text-[13px] font-semibold text-gray-900 truncate">{service.name}</h4>
            <span className="text-[10px] text-gray-300 shrink-0">{service.category}</span>
          </div>
          <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
        </div>
      </div>
    </motion.button>
  );
}
