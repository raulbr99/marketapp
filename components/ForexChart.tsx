'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ForexChartProps {
  data: TimeSeriesData[];
  fromCurrency: string;
  toCurrency: string;
}

export default function ForexChart({ data, fromCurrency, toCurrency }: ForexChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd'),
  })).reverse();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {fromCurrency}/{toCurrency} - Exchange Rate History (Daily)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: any) => [parseFloat(value).toFixed(4), '']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorRate)"
            name="Exchange Rate"
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#10b981"
            strokeWidth={1}
            dot={false}
            name="High"
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#ef4444"
            strokeWidth={1}
            dot={false}
            name="Low"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
