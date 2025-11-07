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

interface ForexChartProps {
  data: TimeSeriesData[];
  fromCurrency: string;
  toCurrency: string;
}

// Custom candlestick shape for forex
const CandlestickShape = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;

  const isGrowing = close > open;
  const color = isGrowing ? '#3b82f6' : '#f59e0b';

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
        strokeWidth={1.5}
      />
      {/* Lower wick */}
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
        <ComposedChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.1} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={[
              (dataMin: number) => (dataMin * 0.9995).toFixed(5),
              (dataMax: number) => (dataMax * 1.0005).toFixed(5)
            ]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(5)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
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
