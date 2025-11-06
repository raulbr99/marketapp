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

interface CryptoChartProps {
  data: TimeSeriesData[];
  symbol: string;
}

// Custom Candlestick shape
const Candlestick = (props: any) => {
  const { x, y, width, height, payload } = props;

  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null;
  }

  const { open, close, high, low } = payload;
  const isPositive = close >= open;
  const color = isPositive ? '#8b5cf6' : '#ec4899'; // Purple for up, pink for down (crypto style)
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
        strokeWidth={2}
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
        opacity={0.9}
      />
    </g>
  );
};

export default function CryptoChart({ data, symbol }: CryptoChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd, yyyy'),
  })).reverse();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.close >= data.open;
      const change = ((data.close - data.open) / data.open * 100).toFixed(2);

      return (
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 text-white p-3 rounded-lg shadow-lg border border-purple-500">
          <p className="font-semibold mb-2 text-purple-200">{data.formattedDate}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-semibold">${data.open.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p>High: <span className="font-semibold text-purple-300">${data.high.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p>Low: <span className="font-semibold text-pink-300">${data.low.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p>Close: <span className="font-semibold">${data.close.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
            <p className={isPositive ? 'text-purple-300' : 'text-pink-300'}>
              {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{change}%
            </p>
            {data.volume > 0 && (
              <p className="text-purple-400">Vol: {data.volume.toLocaleString()}</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 dark:from-purple-500/20 dark:to-pink-600/20 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {symbol} - Candlestick Chart (Weekly - Last Year)
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Bearish</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={formattedData} margin={{ bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9333ea" opacity={0.2} />
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
            tickFormatter={(value) => `$${value.toLocaleString()}`}
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
                fill={entry.close >= entry.open ? '#8b5cf6' : '#ec4899'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
