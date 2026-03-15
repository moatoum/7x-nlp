'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

export function SubmissionsChart() {
  const { overTime } = useAnalytics();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Submissions Over Time</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overTime} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={{ stroke: '#f4f4f5' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
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
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0020f5"
              strokeWidth={2}
              fill="#0020f5"
              fillOpacity={0.1}
              name="Submissions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
