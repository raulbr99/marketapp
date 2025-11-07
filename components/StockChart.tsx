'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockChartProps {
  data: TimeSeriesData[];
  symbol: string;
}

// Custom candlestick shape
const CandlestickShape = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;

  const isGrowing = close > open;
  const color = isGrowing ? '#10b981' : '#ef4444';
  const bodyColor = isGrowing ? '#10b981' : '#ef4444';

  // Calculate the actual pixel values based on domain
  const ratio = height / (high - low);

  const candleWidth = Math.max(width * 0.7, 2);
  const centerX = x + width / 2;

  const highY = y;
  const lowY = y + height;
  const openY = y + (high - open) * ratio;
  const closeY = y + (high - close) * ratio;

  const bodyY = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(openY - closeY), 1);

  return (
    <g>
      {/* Upper wick (high to max of open/close) */}
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
        y2={bodyY}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Lower wick (low to min of open/close) */}
      <line
        x1={centerX}
        y1={bodyY + bodyHeight}
        x2={centerX}
        y2={lowY}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Candle body */}
      <rect
        x={centerX - candleWidth / 2}
        y={bodyY}
        width={candleWidth}
        height={bodyHeight}
        fill={bodyColor}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export default function StockChart({ data, symbol }: StockChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd HH:mm'),
  })).reverse();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.close >= data.open;
      const change = ((data.close - data.open) / data.open * 100).toFixed(2);

      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2">{data.formattedDate}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-semibold">${data.open.toFixed(2)}</span></p>
            <p>High: <span className="font-semibold text-green-400">${data.high.toFixed(2)}</span></p>
            <p>Low: <span className="font-semibold text-red-400">${data.low.toFixed(2)}</span></p>
            <p>Close: <span className="font-semibold">${data.close.toFixed(2)}</span></p>
            <p className={isPositive ? 'text-green-400' : 'text-red-400'}>
              {isPositive ? '+' : ''}{change}%
            </p>
            <p className="text-gray-400">Vol: {data.volume.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {symbol} - Candlestick Chart (Intraday)
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Bearish</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={[
              (dataMin: number) => Math.floor(dataMin * 0.999),
              (dataMax: number) => Math.ceil(dataMax * 1.001)
            ]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6b7280', strokeWidth: 1 }} />

          {/* Invisible bars for each candlestick to create the shape */}
          <Bar
            dataKey="high"
            shape={(props: any) => (
              <CandlestickShape
                {...props}
                low={formattedData[props.index].low}
                high={formattedData[props.index].high}
                open={formattedData[props.index].open}
                close={formattedData[props.index].close}
              />
            )}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
