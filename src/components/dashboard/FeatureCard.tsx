'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import {
  PackageSearch,
  Truck,
  Globe,
  Ship,
  Warehouse,
  PackageCheck,
  MapPin,
  RotateCcw,
  FileCheck,
  Mail,
  type LucideIcon,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  first_mile: PackageSearch,
  domestic_courier: Truck,
  international: Globe,
  freight: Ship,
  road_freight: Truck,
  warehousing: Warehouse,
  fulfillment: PackageCheck,
  last_mile: MapPin,
  reverse_logistics: RotateCcw,
  trade_customs: FileCheck,
  postal: Mail,
};

interface FeatureCardProps {
  categoryKey: string;
  categoryLabel: string;
  serviceCount: number;
  className?: string;
}

export function FeatureCard({ categoryKey, categoryLabel, serviceCount, className }: FeatureCardProps) {
  const Icon = CATEGORY_ICONS[categoryKey] || PackageSearch;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white rounded-xl border border-gray-100 p-5 cursor-default transition-shadow hover:shadow-card hover:border-gray-200',
        className
      )}
    >
      <div className="w-9 h-9 rounded-[10px] bg-gray-50 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <p className="text-sm font-semibold text-gray-900 tracking-tight">{categoryLabel}</p>
      <p className="text-xs text-gray-500 mt-1">
        {serviceCount} {serviceCount === 1 ? 'solution' : 'solutions'}
      </p>
    </motion.div>
  );
}
