'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

export function CategoryChart() {
  const { byCategory } = useAnalytics();

  const chartData = useMemo(() => byCategory.slice(0, 8), [byCategory]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-4">By Category</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <YAxis
              dataKey="label"
              type="category"
              width={140}
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={{ stroke: '#f4f4f5' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #f4f4f5',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                fontSize: 12,
              }}
              labelStyle={{ color: '#71717a', fontSize: 11 }}
              itemStyle={{ color: '#0020f5' }}
              cursor={{ fill: '#f4f4f5' }}
            />
            <Bar
              dataKey="count"
              fill="#0020f5"
              radius={[0, 4, 4, 0]}
              name="Submissions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
