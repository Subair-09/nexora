import React, { useEffect, useState } from 'react';
import { ALL_MARKETS_DATA } from '../data/marketData';
import { MarketAsset } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MarketTickerProps {
  onSelectMarket?: (market: MarketAsset) => void;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ onSelectMarket }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [tickerItems, setTickerItems] = useState<MarketAsset[]>(ALL_MARKETS_DATA);

  // Micro updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.4) return item;
          const shift = (Math.random() - 0.49) * 0.001;
          const newPrice = Number((item.price * (1 + shift)).toFixed(item.category === 'forex' ? 4 : 2));
          return {
            ...item,
            price: newPrice,
            displayPrice: item.category === 'forex' ? newPrice.toFixed(4) : `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div
      id="market-ticker"
      className={`h-12 sm:h-14 border-y flex items-center overflow-hidden select-none text-xs font-mono transition-colors ${
        isLight
          ? 'bg-slate-100/90 border-slate-200 text-slate-800'
          : 'bg-black border-white/10 text-white'
      }`}
    >
      <div className="animate-marquee items-center gap-8 py-2">
        {duplicatedItems.map((item, idx) => {
          const isPositive = item.change24h >= 0;
          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectMarket && onSelectMarket(item)}
              className="flex items-center gap-2 cursor-pointer whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              <span className={`font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {item.pair}
              </span>
              <span className={`font-mono ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                {item.displayPrice}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  isPositive
                    ? isLight ? 'text-emerald-600' : 'text-green-400'
                    : isLight ? 'text-rose-600' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}
                {item.change24h.toFixed(2)}%
              </span>
              <span className={`ml-4 ${isLight ? 'text-slate-300' : 'text-white/30'}`}>|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


