import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Search, ArrowRight, Layers, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { ALL_MARKETS_DATA } from '../data/marketData';
import { MarketAsset, AssetCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MarketsSectionProps {
  onSelectMarket: (market: MarketAsset) => void;
  onOpenAccount: () => void;
}

export const MarketsSection: React.FC<MarketsSectionProps> = ({ onSelectMarket, onOpenAccount }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const categories: { label: string; value: AssetCategory }[] = [
    { label: 'All Markets', value: 'all' },
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Commodities', value: 'commodities' },
    { label: 'Indices', value: 'indices' },
    { label: 'Digital Assets', value: 'digital_assets' },
  ];

  const filteredMarkets = ALL_MARKETS_DATA.filter((market) => {
    const matchesCat = selectedCategory === 'all' || market.category === selectedCategory;
    const matchesSearch =
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.pair.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const displayedMarkets = showAll ? filteredMarkets : filteredMarkets.slice(0, 8);

  const renderMiniChart = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 36;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });

    const pathString = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaString = `${pathString} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    const strokeColor = isPositive
      ? isLight ? '#059669' : '#10B981'
      : isLight ? '#DC2626' : '#EF4444';
    const gradId = `market-grad-${Math.random().toString(36).substring(2, 7)}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={isLight ? '0.25' : '0.2'} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaString} fill={`url(#${gradId})`} />
        <path
          d={pathString}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <section
      id="markets"
      className={`py-20 lg:py-28 border-t relative transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase block mb-2 font-mono">
              MARKETS & ASSETS
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Everything you need. Across global markets.
            </h2>
            <p className={`mt-3 text-base max-w-2xl ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              Explore a broad range of markets from a single, intuitive platform with institutional-grade pricing, tight spreads, and real-time execution.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              id="markets-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pairs, indices..."
              className={`w-full pl-9 pr-4 py-2.5 text-xs rounded-lg focus:outline-none focus:border-blue-500 transition-colors font-mono border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-[#151921] border-white/10 text-white placeholder:text-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Asset Category Navigation */}
        <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 border-b ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              id={`cat-btn-${cat.value}`}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Market Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayedMarkets.map((item) => {
            const isPositive = item.change24h >= 0;
            return (
              <div
                key={item.id}
                id={`market-card-${item.id}`}
                onClick={() => onSelectMarket(item)}
                className={`group relative rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between border ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm text-slate-900'
                    : 'bg-[#151921] border-white/10 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-black/60 text-white'
                }`}
              >
                <div>
                  {/* Top Bar: Pair, Category, Arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold group-hover:text-blue-600 transition-colors">
                        {item.pair}
                      </span>
                      <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        isLight
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-black/40 text-gray-400 border-white/5'
                      }`}>
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                      isLight ? 'text-slate-400 group-hover:text-slate-900' : 'text-gray-500 group-hover:text-white'
                    }`} />
                  </div>

                  {/* Asset Full Name */}
                  <div className={`text-xs font-medium truncate mb-4 ${
                    isLight ? 'text-slate-500' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </div>

                  {/* Price & Movement */}
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight">
                        {item.displayPrice}
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${
                        isLight ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        Spread: <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>{item.spread}</span>
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
                        isPositive
                          ? isLight
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                          : isLight
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.change24h.toFixed(2)}%
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="py-2 flex justify-center">
                    {renderMiniChart(item.sparkline, isPositive)}
                  </div>
                </div>

                {/* Card Footer: Buy/Sell Indicators & Action */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-slate-100' : 'border-white/10'
                }`}>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMarket(item);
                      }}
                      className={`py-1.5 px-2 text-[11px] font-mono font-bold rounded transition-colors text-center border ${
                        isLight
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                          : 'text-green-400 bg-green-500/10 hover:bg-green-500/20 border-green-500/20'
                      }`}
                    >
                      BUY {item.bidPrice.split('.')[0] === '$' ? item.bidPrice : item.bidPrice.slice(0, 7)}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMarket(item);
                      }}
                      className={`py-1.5 px-2 text-[11px] font-mono font-bold rounded transition-colors text-center border ${
                        isLight
                          ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          : 'text-red-400 bg-red-500/10 hover:bg-red-500/20 border-red-500/20'
                      }`}
                    >
                      SELL {item.askPrice.split('.')[0] === '$' ? item.askPrice : item.askPrice.slice(0, 7)}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA / View All Button */}
        <div className={`mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl border ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-900'
            : 'bg-[#151921] border-white/10 text-white'
        }`}>
          <div>
            <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Over 120+ asset pairs and index instruments available
            </div>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Access deep liquidity pools with transparent institutional pricing.
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              id="view-all-markets-toggle-btn"
              onClick={() => setShowAll(!showAll)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all border ${
                isLight
                  ? 'text-slate-800 bg-white hover:bg-slate-100 border-slate-300 shadow-sm'
                  : 'text-white bg-black/40 hover:bg-white/10 border-white/10'
              }`}
            >
              <span>{showAll ? 'Show Fewer Markets' : 'View All Markets'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenAccount}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all shadow-md ${
                isLight
                  ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'text-black bg-white hover:bg-gray-200 shadow-white/5'
              }`}
            >
              Trade Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
