import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe2, Zap, ShieldCheck, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Send, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_MARKET_ROWS } from '../data/marketData';
import { INITIAL_LIVE_TRANSACTIONS, generateRandomTransaction, getActionVerb } from '../data/transactionData';
import { MarketAsset, LiveTransaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onOpenAccount: () => void;
  onExploreMarkets: () => void;
  onSelectMarket?: (market: MarketAsset) => void;
  onViewLedger?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAccount, onExploreMarkets, onSelectMarket, onViewLedger }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'markets' | 'live_feed'>('markets');
  const [marketRows, setMarketRows] = useState<MarketAsset[]>(HERO_MARKET_ROWS);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string } | null>(null);
  
  // Real-time live transactions state
  const [transactions, setTransactions] = useState<LiveTransaction[]>(INITIAL_LIVE_TRANSACTIONS.slice(0, 5));
  const [latestTx, setLatestTx] = useState<LiveTransaction>(INITIAL_LIVE_TRANSACTIONS[0]);
  const [balance, setBalance] = useState<number>(124850.32);
  const [balanceDelta, setBalanceDelta] = useState<number | null>(null);

  // Portfolio chart datasets for different timeframes
  const portfolioCharts = {
    '1D': {
      data: [120566, 121100, 120900, 122400, 121800, 123200, 122900, 124100, 123800, 124850.32],
      labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'],
      change: '+$4,284.18 (+3.55%)',
      isPositive: true,
    },
    '1W': {
      data: [116200, 117800, 118400, 117200, 120100, 122800, 124850.32],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      change: '+$8,650.32 (+7.44%)',
      isPositive: true,
    },
    '1M': {
      data: [108500, 111200, 110400, 114500, 117200, 119800, 124850.32],
      labels: ['W1', 'W2', 'W3', 'W4'],
      change: '+$16,350.32 (+15.06%)',
      isPositive: true,
    },
    '1Y': {
      data: [92000, 96500, 102100, 108400, 114200, 118900, 124850.32],
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      change: '+$32,850.32 (+35.70%)',
      isPositive: true,
    },
  };

  const currentChart = portfolioCharts[activeTimeframe];

  // Subtle real-time market micro-simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketRows((prev) =>
        prev.map((row) => {
          if (Math.random() > 0.3) return row;
          const deltaFactor = (Math.random() - 0.48) * 0.0012;
          const newPrice = Number((row.price * (1 + deltaFactor)).toFixed(row.category === 'forex' ? 4 : 2));
          return {
            ...row,
            price: newPrice,
            displayPrice: row.category === 'forex' ? newPrice.toFixed(4) : `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          };
        })
      );
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Continuous Live Transaction Simulator
  useEffect(() => {
    const txInterval = setInterval(() => {
      const newTx = generateRandomTransaction();
      setLatestTx(newTx);
      setTransactions((prev) => [newTx, ...prev.slice(0, 7)]);

      // Micro balance adjustment for visual realism
      if (newTx.type === 'deposit') {
        const delta = Math.min(newTx.amount * 0.1, 250);
        setBalance((prev) => prev + delta);
        setBalanceDelta(delta);
      } else if (newTx.type === 'withdrawal') {
        const delta = Math.min(newTx.amount * 0.05, 120);
        setBalance((prev) => Math.max(prev - delta, 100000));
        setBalanceDelta(-delta);
      }

      setTimeout(() => setBalanceDelta(null), 1800);
    }, 3800);

    return () => clearInterval(txInterval);
  }, []);

  // SVG Line Chart Generator
  const renderLineChart = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 400;
    const height = 90;
    const padding = 8;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x, y, val: val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) };
    });

    const pathString = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaString = `${pathString} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <div className="relative w-full h-[110px] mb-4 group select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroPortfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={isLight ? '0.35' : '0.4'} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaString} fill="url(#heroPortfolioGradient)" />

          {/* Line stroke */}
          <path
            d={pathString}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive point markers */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.val === pt.val ? 4.5 : 2.5}
              className={`transition-all duration-150 cursor-pointer ${
                hoveredPoint?.val === pt.val
                  ? 'fill-white stroke-blue-500 stroke-2'
                  : 'fill-blue-500 hover:fill-white'
              }`}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Floating point value tooltip */}
        {hoveredPoint && (
          <div
            className={`absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 text-[11px] font-mono font-bold rounded shadow-lg pointer-events-none z-10 ${
              isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'
            }`}
            style={{ left: `${(hoveredPoint.x / width) * 100}%` }}
          >
            {hoveredPoint.val}
          </div>
        )}
      </div>
    );
  };

  const getTxTypeBadge = (tx: LiveTransaction) => {
    switch (tx.type) {
      case 'deposit':
        return {
          icon: ArrowDownLeft,
          color: isLight ? 'text-emerald-600' : 'text-green-400',
          bg: isLight ? 'bg-emerald-50' : 'bg-green-500/10',
          border: isLight ? 'border-emerald-200' : 'border-green-500/30',
        };
      case 'withdrawal':
        return {
          icon: ArrowUpRight,
          color: isLight ? 'text-amber-600' : 'text-amber-400',
          bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
          border: isLight ? 'border-amber-200' : 'border-amber-500/30',
        };
      case 'sent':
        return {
          icon: Send,
          color: isLight ? 'text-blue-600' : 'text-blue-400',
          bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10',
          border: isLight ? 'border-blue-200' : 'border-blue-500/30',
        };
      case 'trade':
        return {
          icon: RefreshCw,
          color: isLight ? 'text-purple-600' : 'text-purple-400',
          bg: isLight ? 'bg-purple-50' : 'bg-purple-500/10',
          border: isLight ? 'border-purple-200' : 'border-purple-500/30',
        };
    }
  };

  return (
    <section
      id="hero"
      className={`relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden transition-colors ${
        isLight ? 'bg-[#F8FAFC]' : 'bg-[#0A0E14]'
      }`}
    >
      {/* Background financial grid & technical glow */}
      <div className="absolute inset-0 bg-financial-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* Live Activity Telemetry Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
                isLight
                  ? 'bg-white border-slate-200 text-blue-600'
                  : 'bg-[#151921] border-white/10 text-blue-400'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-bold tracking-[0.18em] uppercase font-mono">
                  LIVE TRANSACTION NETWORK
                </span>
              </div>
            </div>

            {/* Large Bold Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Trade the world <br className="hidden sm:inline" />
              from one <span className="text-blue-600">powerful</span> platform.
            </h1>

            {/* Supporting Text */}
            <p className={`text-base sm:text-lg mb-6 leading-relaxed max-w-md ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              Access currencies, digital assets, and commodities through a secure, institutional trading engine with real-time settlement across 120+ global nodes.
            </p>

            {/* Live Popping Mini Notification Card right in Left Hero */}
            <div className={`mb-8 p-3 rounded-xl border shadow-lg ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-[#151921] border-white/10 text-white'
            }`}>
              <div className={`flex items-center justify-between text-[10px] font-mono pb-1.5 mb-1.5 border-b ${
                isLight ? 'text-slate-500 border-slate-100' : 'text-gray-500 border-white/5'
              }`}>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <Activity className="w-3 h-3 animate-pulse" /> LATEST CONFIRMED ACTIVITY
                </span>
                <span>Sub-second settlement</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={latestTx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" role="img" aria-label={latestTx.country}>
                      {latestTx.flag}
                    </span>
                    <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>
                      <b className={isLight ? 'text-slate-900' : 'text-white'}>{latestTx.userName}</b> from {latestTx.country}{' '}
                      <span className={isLight ? 'text-slate-500 font-normal' : 'text-gray-400 font-normal'}>
                        {getActionVerb(latestTx.type)}
                      </span>
                    </span>
                  </div>

                  <div className="font-mono font-bold text-emerald-500 flex items-center gap-1">
                    {latestTx.formattedAmount}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                id="hero-open-account-cta"
                onClick={onOpenAccount}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] text-center"
              >
                Open Account
              </button>

              <button
                type="button"
                id="hero-explore-markets-cta"
                onClick={onExploreMarkets}
                className={`px-8 py-4 font-bold rounded-lg transition-all active:scale-[0.98] text-center flex items-center justify-center gap-2 border ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 shadow-sm'
                    : 'border-white/10 hover:bg-white/5 text-white'
                }`}
              >
                <span>Explore Markets</span>
                <span>→</span>
              </button>
            </div>

            {/* Technical Trust Indicators */}
            <div className={`flex gap-6 border-t pt-8 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
              <div className="flex flex-col gap-1">
                <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Global Markets</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">120+ Pairs</span>
              </div>
              <div className={`flex flex-col gap-1 border-l pl-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Real-Time Routing</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">&lt;1.2ms Clearing</span>
              </div>
              <div className={`flex flex-col gap-1 border-l pl-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Active Volume</span>
                <span className="text-xs text-emerald-500 uppercase tracking-wider font-mono">Live $89M/day</span>
              </div>
            </div>

          </div>

          {/* Right Column: Technical Dashboard UI with Live Transactions */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div
              id="hero-trading-dashboard"
              className={`relative border rounded-xl shadow-2xl overflow-hidden flex flex-col transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-[#151921] border-white/10 text-white'
              }`}
            >
              {/* Dashboard Header Bar */}
              <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 p-1 rounded-lg border text-[11px] font-mono ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setActiveDashboardTab('markets')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeDashboardTab === 'markets'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Portfolio & Markets
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDashboardTab('live_feed')}
                      className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                        activeDashboardTab === 'live_feed'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span>Live Flow</span>
                    </button>
                  </div>
                </div>

                {/* Window Controls + Timeframe */}
                <div className="flex items-center gap-3">
                  {activeDashboardTab === 'markets' && (
                    <div className={`hidden sm:flex items-center gap-1 p-0.5 rounded border ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
                    }`}>
                      {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setActiveTimeframe(tf)}
                          className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded transition-colors ${
                            activeTimeframe === tf
                              ? 'bg-blue-600 text-white'
                              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                </div>
              </div>

              {/* Dynamic Live Transaction Stream Strip */}
              <div className={`px-5 py-2 border-b flex items-center justify-between gap-3 text-[11px] font-mono ${
                isLight ? 'bg-slate-50 border-slate-100' : 'bg-black/40 border-white/5'
              }`}>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> STREAM:
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={latestTx.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className={`truncate ${isLight ? 'text-slate-600' : 'text-gray-300'}`}
                    >
                      <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {latestTx.userName}
                      </span>{' '}
                      from {latestTx.country}{' '}
                      <span className={isLight ? 'text-slate-400' : 'text-gray-400'}>{getActionVerb(latestTx.type)}</span>{' '}
                      <span className="text-emerald-500 font-bold">{latestTx.formattedAmount}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {onViewLedger && (
                  <button
                    type="button"
                    onClick={onViewLedger}
                    className="text-blue-600 hover:text-blue-700 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 transition-colors"
                  >
                    View All &gt;
                  </button>
                )}
              </div>

              {/* Main Metric Section */}
              <div className="p-6 flex-1 overflow-hidden">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className={`text-xs uppercase tracking-widest mb-1 font-mono flex items-center gap-2 ${
                      isLight ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      <span>Total Liquid Portfolio</span>
                      {balanceDelta !== null && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            balanceDelta > 0
                              ? isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-green-500/20 text-green-400'
                              : isLight ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {balanceDelta > 0 ? `+$${balanceDelta.toFixed(2)}` : `-$${Math.abs(balanceDelta).toFixed(2)}`}
                        </motion.span>
                      )}
                    </div>
                    <div className={`text-3xl sm:text-4xl font-mono font-bold tracking-tighter ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs uppercase tracking-widest mb-1 font-mono ${
                      isLight ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      24h Return
                    </div>
                    <div className={`text-lg sm:text-xl font-mono font-bold ${
                      isLight ? 'text-emerald-600' : 'text-green-400'
                    }`}>
                      {currentChart.change}
                    </div>
                  </div>
                </div>

                {/* Tab 1: Markets & Chart Overview */}
                {activeDashboardTab === 'markets' ? (
                  <>
                    {/* Line Chart */}
                    {renderLineChart(currentChart.data)}

                    {/* 2-Column Technical Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {marketRows.map((item, idx) => {
                        const isPositive = item.change24h >= 0;
                        const isFirst = idx === 0;
                        return (
                          <div
                            key={item.id}
                            id={`hero-row-${item.id}`}
                            onClick={() => onSelectMarket && onSelectMarket(item)}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer border ${
                              isLight
                                ? isFirst
                                  ? 'bg-slate-50 border-slate-200'
                                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                : isFirst
                                  ? 'bg-black/40 border-white/10'
                                  : 'bg-black/20 border-transparent hover:border-white/10 hover:bg-black/30'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-bold font-mono ${
                                isLight ? 'text-slate-400' : 'text-gray-500'
                              }`}>
                                {item.pair}
                              </span>
                              <span className={`text-sm font-mono font-medium ${
                                isLight ? 'text-slate-900' : 'text-white'
                              }`}>
                                {item.displayPrice}
                              </span>
                            </div>

                            <div className="text-right flex items-center gap-2">
                              <div
                                className={`text-xs font-mono font-bold ${
                                  isPositive
                                    ? isLight ? 'text-emerald-600' : 'text-green-400'
                                    : isLight ? 'text-rose-600' : 'text-red-400'
                                }`}
                              >
                                {isPositive ? '+' : ''}
                                {item.change24h.toFixed(2)}%
                              </div>
                              <div className="w-10 h-4 overflow-hidden hidden xs:block">
                                <svg viewBox="0 0 50 20" className={`w-full h-full stroke-1 fill-none ${
                                  isPositive
                                    ? isLight ? 'stroke-emerald-600' : 'stroke-green-400'
                                    : isLight ? 'stroke-rose-600' : 'stroke-red-400'
                                }`}>
                                  <polyline points={isPositive ? '0,15 10,12 20,18 30,5 40,8 50,2' : '0,5 10,8 20,4 30,15 40,12 50,18'} />
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* Tab 2: Live Transaction Stream Activity Feed */
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {transactions.map((tx) => {
                        const badge = getTxTypeBadge(tx);
                        const IconComponent = badge.icon;
                        return (
                          <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                              isLight
                                ? 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                : 'bg-black/30 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-md ${badge.bg} ${badge.border} border flex items-center justify-center ${badge.color}`}>
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className={`font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  <span>{tx.userName}</span>{' '}
                                  <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>from</span>{' '}
                                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{tx.country}</span> {tx.flag}{' '}
                                  <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{getActionVerb(tx.type)}</span>
                                </div>
                                <div className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                                  <span>{tx.asset}</span> • <span>{tx.relativeTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right font-mono">
                              <div className={`font-bold ${badge.color}`}>
                                {tx.formattedAmount}
                              </div>
                              <div className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{tx.txHash}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Data Grid Bottom Bar with Live Ping */}
              <div className={`px-6 py-3 border-t flex justify-between items-center text-[10px] font-mono ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-black/40 border-white/10 text-gray-500'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>TRANSACTION THROUGHPUT: 3,420 TPS</span>
                </div>
                <span className="text-blue-600 font-semibold">120+ GLOBAL NODES ACTIVE</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
