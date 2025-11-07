'use client';

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

// Custom candlestick shape for crypto
const CandlestickShape = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;

  const isGrowing = close > open;
  const color = isGrowing ? '#8b5cf6' : '#ec4899';

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
      {/* Upper wick */}
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
        y2={bodyY}
        stroke={color}
        strokeWidth={2}
      />
      {/* Lower wick */}
      <line
        x1={centerX}
        y1={bodyY + bodyHeight}
        x2={centerX}
        y2={lowY}
        stroke={color}
        strokeWidth={2}
      />
      {/* Candle body */}
      <rect
        x={centerX - candleWidth / 2}
        y={bodyY}
        width={candleWidth}
        height={bodyHeight}
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
        <ComposedChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9333ea" opacity={0.2} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={[
              (dataMin: number) => Math.floor(dataMin * 0.99),
              (dataMax: number) => Math.ceil(dataMax * 1.01)
            ]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9333ea', strokeWidth: 1 }} />
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
