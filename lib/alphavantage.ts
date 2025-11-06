import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';

// Get API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';

export interface StockQuote {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CryptoData {
  symbol: string;
  price: string;
  marketCap: string;
  change24h: string;
}

export interface ForexRate {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  lastRefreshed: string;
}

// Get stock quote
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });

    const data = response.data['Global Quote'];
    return {
      symbol: data['01. symbol'],
      price: data['05. price'],
      change: data['09. change'],
      changePercent: data['10. change percent'],
      volume: data['06. volume'],
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

// Get intraday time series
export async function getIntradayTimeSeries(
  symbol: string,
  interval: '1min' | '5min' | '15min' | '30min' | '60min' = '5min'
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data[`Time Series (${interval})`];
    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    throw error;
  }
}

// Get daily time series
export async function getDailyTimeSeries(symbol: string): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series (Daily)'];
    return Object.entries(timeSeries)
      .slice(0, 100)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
  } catch (error) {
    console.error('Error fetching daily data:', error);
    throw error;
  }
}

// Get cryptocurrency data
export async function getCryptoQuote(
  symbol: string,
  market: string = 'USD'
): Promise<CryptoData> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol,
        to_currency: market,
        apikey: API_KEY,
      },
    });

    const data = response.data['Realtime Currency Exchange Rate'];
    return {
      symbol: data['1. From_Currency Code'],
      price: data['5. Exchange Rate'],
      marketCap: data['8. Bid Price'],
      change24h: '0', // API doesn't provide this directly
    };
  } catch (error) {
    console.error('Error fetching crypto quote:', error);
    throw error;
  }
}

// Get forex rate
export async function getForexRate(
  fromCurrency: string,
  toCurrency: string
): Promise<ForexRate> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: API_KEY,
      },
    });

    const data = response.data['Realtime Currency Exchange Rate'];
    return {
      fromCurrency: data['1. From_Currency Code'],
      toCurrency: data['3. To_Currency Code'],
      rate: data['5. Exchange Rate'],
      lastRefreshed: data['6. Last Refreshed'],
    };
  } catch (error) {
    console.error('Error fetching forex rate:', error);
    throw error;
  }
}

// Get crypto daily time series
export async function getCryptoDailyTimeSeries(
  symbol: string,
  market: string = 'USD'
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'DIGITAL_CURRENCY_DAILY',
        symbol,
        market,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series (Digital Currency Daily)'];
    if (!timeSeries) {
      throw new Error('No data available');
    }

    return Object.entries(timeSeries)
      .slice(0, 100)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values[`1a. open (${market})`] || values['1a. open (USD)']),
        high: parseFloat(values[`2a. high (${market})`] || values['2a. high (USD)']),
        low: parseFloat(values[`3a. low (${market})`] || values['3a. low (USD)']),
        close: parseFloat(values[`4a. close (${market})`] || values['4a. close (USD)']),
        volume: parseFloat(values['5. volume']),
      }));
  } catch (error) {
    console.error('Error fetching crypto daily data:', error);
    throw error;
  }
}

// Get forex daily time series
export async function getForexDailyTimeSeries(
  fromCurrency: string,
  toCurrency: string
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'FX_DAILY',
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series FX (Daily)'];
    if (!timeSeries) {
      throw new Error('No data available');
    }

    return Object.entries(timeSeries)
      .slice(0, 100)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: 0, // Forex doesn't have volume
      }));
  } catch (error) {
    console.error('Error fetching forex daily data:', error);
    throw error;
  }
}

// Get forex intraday time series
export async function getForexIntradayTimeSeries(
  fromCurrency: string,
  toCurrency: string,
  interval: '1min' | '5min' | '15min' | '30min' | '60min' = '5min'
): Promise<TimeSeriesData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'FX_INTRADAY',
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
        interval,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data[`Time Series FX (${interval})`];
    if (!timeSeries) {
      throw new Error('No data available');
    }

    return Object.entries(timeSeries)
      .slice(0, 100)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: 0, // Forex doesn't have volume
      }));
  } catch (error) {
    console.error('Error fetching forex intraday data:', error);
    throw error;
  }
}

// Get market news and sentiment
export async function getMarketNews(tickers?: string) {
  try {
    const params: any = {
      function: 'NEWS_SENTIMENT',
      apikey: API_KEY,
    };

    if (tickers) {
      params.tickers = tickers;
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data.feed || [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    throw error;
  }
}

// Get technical indicators - RSI
export async function getRSI(
  symbol: string,
  interval: string = 'daily',
  timePeriod: number = 14
) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'RSI',
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close',
        apikey: API_KEY,
      },
    });

    return response.data['Technical Analysis: RSI'];
  } catch (error) {
    console.error('Error fetching RSI:', error);
    throw error;
  }
}

// Get technical indicators - SMA (Simple Moving Average)
export async function getSMA(
  symbol: string,
  interval: string = 'daily',
  timePeriod: number = 50
) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SMA',
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close',
        apikey: API_KEY,
      },
    });

    return response.data['Technical Analysis: SMA'];
  } catch (error) {
    console.error('Error fetching SMA:', error);
    throw error;
  }
}
