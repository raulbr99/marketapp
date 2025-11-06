'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  volume?: string;
}

export default function StockCard({ symbol, price, change, changePercent, volume }: StockCardProps) {
  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h3>
        {isPositive ? (
          <TrendingUp className="text-green-500" size={24} />
        ) : (
          <TrendingDown className="text-red-500" size={24} />
        )}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-semibold text-gray-900 dark:text-white">
          ${parseFloat(price).toFixed(2)}
        </p>
      </div>

      <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <span className="font-medium">
          {isPositive ? '+' : ''}{parseFloat(change).toFixed(2)}
        </span>
        <span className="text-sm">
          ({changePercent})
        </span>
      </div>

      {volume && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Volume: {parseInt(volume).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
