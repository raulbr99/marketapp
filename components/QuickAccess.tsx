'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Star, Loader2 } from 'lucide-react';
import { getTopGainersLosers } from '@/lib/alphavantage';

interface Asset {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

interface QuickAccessProps {
  type: 'stocks' | 'crypto' | 'forex';
  onSelect: (symbol: string) => void;
}

// Curated lists for crypto and forex (no direct API endpoint)
const popularCrypto = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT'];
const popularForex = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD'];

export default function QuickAccess({ type, onSelect }: QuickAccessProps) {
  const [topGainers, setTopGainers] = useState<Asset[]>([]);
  const [topLosers, setTopLosers] = useState<Asset[]>([]);
  const [mostActive, setMostActive] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'gainers' | 'losers' | 'active'>('gainers');

  useEffect(() => {
    if (type === 'stocks') {
      loadStockData();
    } else {
      setLoading(false);
    }
  }, [type]);

  const loadStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopGainersLosers();
      setTopGainers(data.top_gainers.slice(0, 12));
      setTopLosers(data.top_losers.slice(0, 12));
      setMostActive(data.most_actively_traded.slice(0, 12));
    } catch (err) {
      setError('Unable to load market data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStockTabs = () => (
    <div className="flex gap-2 mb-4 flex-wrap">
      <button
        onClick={() => setActiveView('gainers')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeView === 'gainers'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        🚀 Top Gainers
      </button>
      <button
        onClick={() => setActiveView('losers')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeView === 'losers'
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        📉 Top Losers
      </button>
      <button
        onClick={() => setActiveView('active')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeView === 'active'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        🔥 Most Active
      </button>
    </div>
  );

  const renderStockCard = (asset: Asset) => {
    const isPositive = parseFloat(asset.change_amount) >= 0;
    return (
      <button
        key={asset.ticker}
        onClick={() => onSelect(asset.ticker)}
        className="group relative bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-4 transition-all hover:shadow-lg hover:scale-105 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              {asset.ticker}
            </span>
            {isPositive ? (
              <TrendingUp className="text-green-500" size={18} />
            ) : (
              <TrendingDown className="text-red-500" size={18} />
            )}
          </div>

          <div className="text-left w-full">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${parseFloat(asset.price).toFixed(2)}
            </p>
            <div className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{parseFloat(asset.change_amount).toFixed(2)} ({asset.change_percentage})
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Vol: {parseInt(asset.volume).toLocaleString()}
            </p>
          </div>
        </div>
      </button>
    );
  };

  const renderCryptoForexCard = (symbol: string) => (
    <button
      key={symbol}
      onClick={() => onSelect(symbol)}
      className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900 dark:hover:to-blue-800 rounded-lg p-4 transition-all hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="text-blue-500 group-hover:text-blue-600" size={20} />
        <span className="font-bold text-gray-900 dark:text-white text-lg">
          {symbol}
        </span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        Click to view chart
      </p>
    </button>
  );

  if (type !== 'stocks') {
    const assets = type === 'crypto' ? popularCrypto : popularForex;
    const title = type === 'crypto' ? 'Top Cryptocurrencies' : 'Major Forex Pairs';
    const icon = type === 'crypto' ? '₿' : '💱';

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-yellow-500" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {icon} {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {assets.map(symbol => renderCryptoForexCard(symbol))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Click on any {type === 'crypto' ? 'cryptocurrency' : 'forex pair'} to view live data
        </p>
      </div>
    );
  }

  const currentAssets = activeView === 'gainers' ? topGainers : activeView === 'losers' ? topLosers : mostActive;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-500" size={20} />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          📈 Top US Stocks (Real-time)
        </h2>
      </div>

      {renderStockTabs()}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading market data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && currentAssets.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentAssets.map(asset => renderStockCard(asset))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Click on any stock to view detailed chart • Data updates daily
          </p>
        </>
      )}
    </div>
  );
}
