'use client';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  className?: string;
}

export function NewsCard({ title, excerpt, date, category, className }: NewsCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-card',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge>{category}</Badge>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{excerpt}</p>
    </div>
  );
}
