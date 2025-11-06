'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Bitcoin, Globe, BarChart3, Newspaper } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import StockCard from '@/components/StockCard';
import StockChart from '@/components/StockChart';
import CryptoCard from '@/components/CryptoCard';
import CryptoChart from '@/components/CryptoChart';
import ForexChart from '@/components/ForexChart';
import {
  getStockQuote,
  getIntradayTimeSeries,
  getCryptoQuote,
  getForexRate,
  getCryptoDailyTimeSeries,
  getForexDailyTimeSeries,
  type StockQuote,
  type TimeSeriesData,
  type CryptoData,
  type ForexRate,
} from '@/lib/alphavantage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto' | 'forex'>('stocks');
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [cryptoTimeSeriesData, setCryptoTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [forexData, setForexData] = useState<ForexRate | null>(null);
  const [forexTimeSeriesData, setForexTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const [quote, timeSeries] = await Promise.all([
        getStockQuote(symbol),
        getIntradayTimeSeries(symbol, '5min'),
      ]);
      setStockData(quote);
      setTimeSeriesData(timeSeries.slice(0, 50));
    } catch (err) {
      setError('Failed to fetch stock data. Please check the symbol and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoSearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const [quote, timeSeries] = await Promise.all([
        getCryptoQuote(symbol),
        getCryptoDailyTimeSeries(symbol),
      ]);
      setCryptoData(quote);
      setCryptoTimeSeriesData(timeSeries);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch crypto data. Please check the symbol and try again.';
      setError(errorMessage + ' Try: BTC, ETH, LTC, XRP, ADA, DOT, DOGE');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForexSearch = async (pair: string) => {
    setLoading(true);
    setError(null);
    try {
      const [from, to] = pair.split('/');
      if (!from || !to) {
        throw new Error('Invalid forex pair format. Use format: USD/EUR');
      }
      const [rate, timeSeries] = await Promise.all([
        getForexRate(from.trim(), to.trim()),
        getForexDailyTimeSeries(from.trim(), to.trim()),
      ]);
      setForexData(rate);
      setForexTimeSeriesData(timeSeries.slice(0, 100));
    } catch (err) {
      setError('Failed to fetch forex data. Please use format: USD/EUR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Market Trends Dashboard
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('stocks')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'stocks'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BarChart3 size={20} />
              Stocks
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'crypto'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Bitcoin size={20} />
              Crypto
            </button>
            <button
              onClick={() => setActiveTab('forex')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'forex'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Globe size={20} />
              Forex
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          {activeTab === 'stocks' && (
            <SearchBar
              onSearch={handleStockSearch}
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
            />
          )}
          {activeTab === 'crypto' && (
            <SearchBar
              onSearch={handleCryptoSearch}
              placeholder="Enter crypto symbol (e.g., BTC, ETH)"
            />
          )}
          {activeTab === 'forex' && (
            <SearchBar
              onSearch={handleForexSearch}
              placeholder="Enter forex pair (e.g., USD/EUR, GBP/JPY)"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Stock Data */}
        {activeTab === 'stocks' && stockData && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StockCard {...stockData} />
            </div>
            {timeSeriesData.length > 0 && (
              <StockChart data={timeSeriesData} symbol={stockData.symbol} />
            )}
          </div>
        )}

        {/* Crypto Data */}
        {activeTab === 'crypto' && cryptoData && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CryptoCard {...cryptoData} />
            </div>
            {cryptoTimeSeriesData.length > 0 && (
              <CryptoChart data={cryptoTimeSeriesData} symbol={cryptoData.symbol} />
            )}
          </div>
        )}

        {/* Forex Data */}
        {activeTab === 'forex' && forexData && !loading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {forexData.fromCurrency} / {forexData.toCurrency}
              </h3>
              <p className="text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                {parseFloat(forexData.rate).toFixed(4)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {forexData.lastRefreshed}
              </p>
            </div>
            {forexTimeSeriesData.length > 0 && (
              <ForexChart
                data={forexTimeSeriesData}
                fromCurrency={forexData.fromCurrency}
                toCurrency={forexData.toCurrency}
              />
            )}
          </div>
        )}

        {/* Features Section */}
        {!stockData && !cryptoData && !forexData && !loading && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Available Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <DollarSign className="text-blue-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Stock Market Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time quotes, intraday charts, and historical data for stocks and ETFs
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Bitcoin className="text-purple-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Cryptocurrency Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track Bitcoin, Ethereum, and other cryptocurrencies with live pricing
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Globe className="text-green-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Forex Exchange Rates
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor currency exchange rates for major forex pairs
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <BarChart3 className="text-orange-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Technical Indicators
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access over 60 technical indicators including RSI, SMA, MACD, and more
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Newspaper className="text-red-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Market News
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with latest financial news and sentiment analysis
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <TrendingUp className="text-teal-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Fundamental Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Company earnings, balance sheets, and key financial metrics
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>Powered by Alpha Vantage API</p>
          <p className="text-sm mt-2">
            Get your free API key at{' '}
            <a
              href="https://www.alphavantage.co/support/#api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              alphavantage.co
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
