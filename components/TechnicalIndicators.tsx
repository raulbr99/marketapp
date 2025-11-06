'use client';

import { useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { getRSI, getSMA } from '@/lib/alphavantage';

interface TechnicalIndicatorsProps {
  symbol: string;
}

export default function TechnicalIndicators({ symbol }: TechnicalIndicatorsProps) {
  const [indicators, setIndicators] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIndicators = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rsi, sma50, sma200] = await Promise.all([
        getRSI(symbol),
        getSMA(symbol, 'daily', 50),
        getSMA(symbol, 'daily', 200),
      ]);

      setIndicators({ rsi, sma50, sma200 });
    } catch (err) {
      setError('Failed to fetch technical indicators');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-500" size={24} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Technical Indicators - {symbol}
          </h3>
        </div>
        <button
          onClick={fetchIndicators}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Indicators'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {indicators && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              RSI (14)
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {indicators.rsi ? Object.values(indicators.rsi)[0] as string : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              SMA (50)
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {indicators.sma50 ? parseFloat(Object.values(indicators.sma50)[0] as string).toFixed(2) : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              SMA (200)
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {indicators.sma200 ? parseFloat(Object.values(indicators.sma200)[0] as string).toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {!indicators && !loading && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Click "Load Indicators" to fetch technical analysis data
        </p>
      )}
    </div>
  );
}
