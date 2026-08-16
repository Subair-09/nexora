import { CandlestickData } from '../types';

export interface BollingerBandPoint {
  upper: number;
  middle: number;
  lower: number;
}

export interface MacdPoint {
  macd: number;
  signal: number;
  histogram: number;
}

// Calculate EMA (Exponential Moving Average)
export function calculateEMA(data: CandlestickData[], period: number): (number | null)[] {
  if (data.length === 0) return [];
  const k = 2 / (period + 1);
  const emaArray: (number | null)[] = [];
  
  // First EMA is simple SMA of first 'period' items
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sum += data[i].close;
      emaArray.push(null);
    } else if (i === period - 1) {
      sum += data[i].close;
      const initialSMA = sum / period;
      emaArray.push(initialSMA);
    } else {
      const prevEMA = emaArray[i - 1]!;
      const currentEMA = data[i].close * k + prevEMA * (1 - k);
      emaArray.push(currentEMA);
    }
  }
  return emaArray;
}

// Calculate Bollinger Bands (20, 2)
export function calculateBollingerBands(data: CandlestickData[], period: number = 20, multiplier: number = 2): (BollingerBandPoint | null)[] {
  const bands: (BollingerBandPoint | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bands.push(null);
      continue;
    }

    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, d) => sum + d.close, 0) / period;
    
    // Variance & StdDev
    const variance = slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    bands.push({
      upper: mean + multiplier * stdDev,
      middle: mean,
      lower: mean - multiplier * stdDev,
    });
  }

  return bands;
}

// Calculate RSI (Relative Strength Index, default 14)
export function calculateRSI(data: CandlestickData[], period: number = 14): (number | null)[] {
  const rsiArray: (number | null)[] = [];
  if (data.length < period + 1) {
    return data.map(() => null);
  }

  let gains = 0;
  let losses = 0;

  // First period average gain/loss
  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Fill leading nulls
  for (let i = 0; i < period; i++) {
    rsiArray.push(null);
  }

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));
  rsiArray.push(rsi);

  // Smoothed RSI for subsequent candles
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
    rsiArray.push(rsi);
  }

  return rsiArray;
}

// Calculate MACD (12, 26, 9)
export function calculateMACD(data: CandlestickData[]): (MacdPoint | null)[] {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const macdLine: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (ema12[i] !== null && ema26[i] !== null) {
      macdLine.push(ema12[i]! - ema26[i]!);
    } else {
      macdLine.push(null);
    }
  }

  // Signal line is 9-EMA of MACD line
  const validMacdValues: CandlestickData[] = [];
  const validIndices: number[] = [];
  macdLine.forEach((val, idx) => {
    if (val !== null) {
      validMacdValues.push({
        time: '',
        open: val,
        high: val,
        low: val,
        close: val,
        volume: 0,
      });
      validIndices.push(idx);
    }
  });

  const signalEma = calculateEMA(validMacdValues, 9);
  const result: (MacdPoint | null)[] = data.map(() => null);

  validIndices.forEach((origIdx, subIdx) => {
    const macdVal = macdLine[origIdx];
    const sigVal = signalEma[subIdx];
    if (macdVal !== null && sigVal !== null) {
      result[origIdx] = {
        macd: macdVal,
        signal: sigVal,
        histogram: macdVal - sigVal,
      };
    }
  });

  return result;
}

// Transform standard candles to Heikin-Ashi
export function toHeikinAshi(data: CandlestickData[]): CandlestickData[] {
  if (data.length === 0) return [];
  const haData: CandlestickData[] = [];

  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const haClose = (current.open + current.high + current.low + current.close) / 4;
    
    let haOpen: number;
    if (i === 0) {
      haOpen = (current.open + current.close) / 2;
    } else {
      const prev = haData[i - 1];
      haOpen = (prev.open + prev.close) / 2;
    }

    const haHigh = Math.max(current.high, haOpen, haClose);
    const haLow = Math.min(current.low, haOpen, haClose);

    haData.push({
      ...current,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  }

  return haData;
}

// Generate realistic starting candlestick sequence for any pair & timeframe
export function generateInitialCandles(pair: string, basePrice: number, count: number = 32): CandlestickData[] {
  const candles: CandlestickData[] = [];
  const volatility = basePrice * 0.0035;
  let currentPrice = basePrice * (1 - (count * 0.001));

  const now = Date.now();
  const stepMs = 60 * 1000; // 1 min steps

  for (let i = 0; i < count; i++) {
    const timeObj = new Date(now - (count - i) * stepMs);
    const hours = timeObj.getHours().toString().padStart(2, '0');
    const mins = timeObj.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    const delta = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = Math.max(basePrice * 0.5, open + delta);
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = Math.floor(Math.random() * 2500) + 800;

    candles.push({
      time: timeStr,
      open: Number(open.toFixed(basePrice < 10 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 10 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 10 ? 4 : 2)),
      close: Number(close.toFixed(basePrice < 10 ? 4 : 2)),
      volume,
    });

    currentPrice = close;
  }

  // Ensure last candle close matches basePrice
  const last = candles[candles.length - 1];
  last.close = basePrice;
  last.high = Math.max(last.high, basePrice);
  last.low = Math.min(last.low, basePrice);

  return candles;
}
