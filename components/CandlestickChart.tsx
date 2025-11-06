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

interface CandlestickChartProps {
  data: TimeSeriesData[];
  title: string;
  dateFormat?: string;
  height?: number;
}

// Custom Candlestick shape component
const Candlestick = (props: any) => {
  const { x, y, width, height, payload } = props;

  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null;
  }

  const { open, close, high, low } = payload;
  const isPositive = close >= open;
  const color = isPositive ? '#10b981' : '#ef4444'; // Green for up, red for down
  const ratio = Math.abs(height / (open - close));

  return (
    <g>
      {/* High-Low line (wick) */}
      <line
        x1={x + width / 2}
        y1={y - (high - Math.max(open, close)) * ratio}
        x2={x + width / 2}
        y2={y + height + (Math.min(open, close) - low) * ratio}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height || 1}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export default function CandlestickChart({
  data,
  title,
  dateFormat = 'MMM dd HH:mm',
  height = 500
}: CandlestickChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), dateFormat),
  })).reverse();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.close >= data.open;
      const change = ((data.close - data.open) / data.open * 100).toFixed(2);

      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2">{data.formattedDate}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-semibold">${data.open.toLocaleString()}</span></p>
            <p>High: <span className="font-semibold text-green-400">${data.high.toLocaleString()}</span></p>
            <p>Low: <span className="font-semibold text-red-400">${data.low.toLocaleString()}</span></p>
            <p>Close: <span className="font-semibold">${data.close.toLocaleString()}</span></p>
            <p className={isPositive ? 'text-green-400' : 'text-red-400'}>
              Change: {isPositive ? '+' : ''}{change}%
            </p>
            {data.volume > 0 && (
              <p className="text-gray-400">Vol: {data.volume.toLocaleString()}</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <div className="mb-2 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Bullish (Up)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Bearish (Down)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
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
                fill={entry.close >= entry.open ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
