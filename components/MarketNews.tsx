'use client';

import { useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { getMarketNews } from '@/lib/alphavantage';

interface NewsArticle {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  source: string;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
}

export default function MarketNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await getMarketNews(ticker || undefined);
      setNews(articles.slice(0, 10));
    } catch (err) {
      setError('Failed to fetch market news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.15) return 'text-green-600 dark:text-green-400';
    if (score < -0.15) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="text-blue-500" size={24} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Market News & Sentiment
        </h3>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker symbol (optional)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchNews}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get News'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {news.length > 0 && (
        <div className="space-y-4">
          {news.map((article, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                  >
                    {article.title}
                    <ExternalLink size={16} />
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {article.source} • {new Date(article.time_published).toLocaleString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                {article.overall_sentiment_score !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sentiment</p>
                    <p className={`font-semibold ${getSentimentColor(article.overall_sentiment_score)}`}>
                      {article.overall_sentiment_label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!news.length && !loading && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Click "Get News" to fetch the latest market news
        </p>
      )}
    </div>
  );
}
