'use client';

import { Bitcoin } from 'lucide-react';

interface CryptoCardProps {
  symbol: string;
  price: string;
  marketCap?: string;
  change24h?: string;
}

export default function CryptoCard({ symbol, price, marketCap, change24h }: CryptoCardProps) {
  const change = parseFloat(change24h || '0');
  const isPositive = change >= 0;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">{symbol}</h3>
        <Bitcoin size={24} />
      </div>

      <div className="mb-2">
        <p className="text-3xl font-semibold">
          ${parseFloat(price).toFixed(2)}
        </p>
      </div>

      {change24h && (
        <div className={`flex items-center gap-2 ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          <span className="font-medium">
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
          <span className="text-sm">24h</span>
        </div>
      )}

      {marketCap && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90">
            Market Cap: ${parseFloat(marketCap).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
