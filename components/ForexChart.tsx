'use client';

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

// Custom Candlestick shape
const Candlestick = (props: any) => {
  const { x, y, width, height, payload } = props;

  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null;
  }

  const { open, close, high, low } = payload;
  const isPositive = close >= open;
  const color = isPositive ? '#3b82f6' : '#f59e0b'; // Blue for up, amber for down (forex style)
  const ratio = Math.abs(height / (open - close));

  return (
    <g>
      {/* High-Low wick */}
      <line
        x1={x + width / 2}
        y1={y - (high - Math.max(open, close)) * ratio}
        x2={x + width / 2}
        y2={y + height + (Math.min(open, close) - low) * ratio}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Body */}
      <rect
        x={x + 1}
        y={y}
        width={Math.max(width - 2, 1)}
        height={height || 1}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export default function ForexChart({ data, fromCurrency, toCurrency }: ForexChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd'),
  })).reverse();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.close >= data.open;
      const change = ((data.close - data.open) / data.open * 100).toFixed(2);

      return (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-3 rounded-lg shadow-lg border border-blue-500">
          <p className="font-semibold mb-2 text-blue-200">{data.formattedDate}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-semibold">{data.open.toFixed(5)}</span></p>
            <p>High: <span className="font-semibold text-blue-300">{data.high.toFixed(5)}</span></p>
            <p>Low: <span className="font-semibold text-amber-300">{data.low.toFixed(5)}</span></p>
            <p>Close: <span className="font-semibold">{data.close.toFixed(5)}</span></p>
            <p className={isPositive ? 'text-blue-300' : 'text-amber-300'}>
              {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{change}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {fromCurrency}/{toCurrency} - Candlestick Chart (Daily)
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Strengthening</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Weakening</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={formattedData} margin={{ bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.1} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(5)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="close"
            shape={<Candlestick />}
            isAnimationActive={false}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.close >= entry.open ? '#3b82f6' : '#f59e0b'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
