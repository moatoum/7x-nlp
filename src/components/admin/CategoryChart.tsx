'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/useAnalytics';

const COLORS = ['#0020f5', '#4f46e5', '#7c3aed', '#a855f7', '#c084fc', '#d4b5ff', '#e0ccff', '#ede5ff'];

export function CategoryChart() {
  const { byCategory } = useAnalytics();

  const chartData = useMemo(() => byCategory.slice(0, 7), [byCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-900">By Category</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Distribution across service types</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <YAxis
              dataKey="label"
              type="category"
              width={120}
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickLine={false}
              axisLine={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#d4d4d8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: 'none',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                fontSize: 12,
                color: '#fff',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#a1a1aa', fontSize: 11, marginBottom: 2 }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            />
            <Bar
              dataKey="count"
              radius={[0, 6, 6, 0]}
              name="Submissions"
              barSize={18}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
