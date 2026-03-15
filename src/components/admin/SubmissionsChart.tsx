'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/useAnalytics';

export function SubmissionsChart() {
  const { overTime } = useAnalytics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-900">Submissions Over Time</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Daily submission volume</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#0020f5]" />
          <span className="text-[11px] text-gray-400">Submissions</span>
        </div>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overTime} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0020f5" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0020f5" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#d4d4d8' }}
              tickLine={false}
              axisLine={{ stroke: '#f4f4f5' }}
            />
            <YAxis
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
              cursor={{ stroke: '#0020f5', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0020f5"
              strokeWidth={2}
              fill="url(#submissionGradient)"
              name="Submissions"
              dot={false}
              activeDot={{ r: 4, fill: '#0020f5', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
