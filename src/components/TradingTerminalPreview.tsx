import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Sliders, 
  Compass, 
  Eye, 
  Briefcase, 
  FileText, 
  Activity, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  Zap,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  RefreshCw,
  Trophy,
  Volume2,
  VolumeX,
  PlusCircle,
  MinusCircle,
  XCircle,
  Info,
  DollarSign,
  Award,
  Wallet,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CANDLESTICK_DATA_BTC } from '../data/marketData';
import { INITIAL_LIVE_TRANSACTIONS, generateRandomTransaction, getActionVerb } from '../data/transactionData';
import { CandlestickData, TimeInterval, LiveTransaction, TradePosition, TerminalOrder } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useTrading, LiveMarketQuote } from '../context/TradingContext';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { InteractiveTradingChart } from './InteractiveTradingChart';

interface TradingTerminalPreviewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const TradingTerminalPreview: React.FC<TradingTerminalPreviewProps> = ({ onShowToast }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const {
    balance,
    equity,
    marginUsed,
    freeMargin,
    realizedPnl,
    unrealizedPnl,
    positions,
    orders,
    holdings,
    stats,
    markets,
    achievements,
    executeTrade,
    closePosition,
    cancelOrder,
    resetSandbox,
    toggleSound,
  } = useTrading();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'overview' | 'positions' | 'portfolio' | 'orders' | 'game' | 'activity'>('overview');
  const [selectedPair, setSelectedPair] = useState('BTC/USD');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('1D');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Order Form State
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderAmount, setOrderAmount] = useState('0.25');
  const [leverage, setLeverage] = useState<number>(1);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [hoveredCandle, setHoveredCandle] = useState<CandlestickData | null>(null);

  // Modals state
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Live transactions in terminal
  const [terminalTxs, setTerminalTxs] = useState<LiveTransaction[]>(INITIAL_LIVE_TRANSACTIONS);
  const [latestTerminalTx, setLatestTerminalTx] = useState<LiveTransaction>(INITIAL_LIVE_TRANSACTIONS[0]);

  const currentMarket: LiveMarketQuote = markets[selectedPair] || markets['BTC/USD'];

  // Update order amount / price defaults when pair changes
  useEffect(() => {
    if (selectedPair.includes('BTC')) setOrderAmount('0.25');
    else if (selectedPair.includes('ETH')) setOrderAmount('1.5');
    else if (selectedPair.includes('SOL')) setOrderAmount('10');
    else if (selectedPair.includes('XAU')) setOrderAmount('1');
    else if (selectedPair.includes('EUR') || selectedPair.includes('GBP')) setOrderAmount('10000');
    else setOrderAmount('25');
  }, [selectedPair]);

  // Global background transactions stream
  useEffect(() => {
    const txInterval = setInterval(() => {
      const newTx = generateRandomTransaction();
      setLatestTerminalTx(newTx);
      setTerminalTxs((prev) => [newTx, ...prev.slice(0, 9)]);
    }, 3800);

    return () => clearInterval(txInterval);
  }, []);

  const candleDataset = CANDLESTICK_DATA_BTC[timeInterval] || CANDLESTICK_DATA_BTC['1D'];

  const sidebarTabs = [
    { id: 'overview', label: 'Trading Desk', icon: Compass, count: null },
    { id: 'positions', label: 'Positions', icon: Layers, count: positions.length },
    { id: 'portfolio', label: 'Portfolio & Funds', icon: Briefcase, count: null },
    { id: 'orders', label: 'Order History', icon: FileText, count: orders.length },
    { id: 'game', label: 'Trader XP & Badges', icon: Trophy, count: stats.level },
    { id: 'activity', label: 'Live Network Flow', icon: Activity, count: null },
  ];

  // Calculated Order Values
  const orderPriceNumber = currentMarket ? currentMarket.price : 118420.50;
  const numAmount = parseFloat(orderAmount) || 0;
  const totalValue = numAmount * orderPriceNumber;
  const requiredMargin = totalValue / leverage;
  const estimatedFee = totalValue * 0.0005;

  const handleExecuteTrade = () => {
    if (numAmount <= 0) {
      onShowToast('Invalid Amount', 'Please specify an order size greater than zero.', 'info');
      return;
    }

    const res = executeTrade({
      pair: selectedPair,
      side: orderSide,
      type: orderType,
      amount: numAmount,
      price: orderPriceNumber,
      leverage,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
    });

    if (res.success) {
      onShowToast(
        orderSide === 'buy' ? 'BUY ORDER EXECUTED' : 'SELL SHORT EXECUTED',
        res.message,
        'success'
      );
    } else {
      onShowToast('Execution Blocked', res.message, 'info');
    }
  };

  // Handle close position
  const handleClosePosition = (posId: string) => {
    const res = closePosition(posId);
    if (res.success) {
      onShowToast(
        res.pnl >= 0 ? '🏆 PROFIT REALIZED' : 'POSITION CLOSED',
        res.message,
        res.pnl >= 0 ? 'success' : 'info'
      );
    }
  };

  return (
    <section
      id="terminal"
      className={`py-20 lg:py-28 border-t transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
              : 'bg-[#151921] border-white/10 text-gray-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase">
              INTERACTIVE REAL-TIME TRADING SIMULATOR
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            NEXORA Trading Terminal
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            Place live buy/sell orders, manage leverage, monitor real-time P&L, withdraw profits, and level up your institutional trader rank in a real sandbox.
          </p>
        </div>

        {/* Large Trading Terminal Container */}
        <div
          id="nexora-terminal-wrapper"
          className={`border rounded-2xl shadow-2xl overflow-hidden transition-colors ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-200/50'
              : 'bg-[#151921] border-white/10 shadow-black/80'
          }`}
        >
          {/* Top Bar: Controls, Live Balance, Deposit & Withdraw Buttons */}
          <div className={`border-b px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
          }`}>
            {/* Left: Terminal Badge & Trader Rank */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`font-mono font-bold text-xs uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  NEXORA SIMULATOR
                </span>
              </div>

              {/* Trader Level Pill */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                isLight ? 'bg-white border-slate-300 text-blue-700' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}>
                <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
                <span>Lv.{stats.level} {stats.rank}</span>
              </div>
            </div>

            {/* Middle: Live Cash & Equity Summary */}
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
              <div>
                <span className={`text-[9px] sm:text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Demo Cash</span>
                <span className={`font-bold text-xs sm:text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="hidden xs:block">
                <span className={`text-[9px] sm:text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Total Equity</span>
                <span className={`font-bold text-xs sm:text-sm ${equity >= balance ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                  ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="hidden md:block">
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Unrealized P&L</span>
                <span className={`font-bold text-xs sm:text-sm ${unrealizedPnl >= 0 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                  {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Right: Quick Deposit / Withdraw / Sound buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono flex-shrink-0">
              <button
                type="button"
                id="terminal-deposit-btn"
                onClick={() => setDepositOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm shadow-emerald-600/20"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Deposit</span>
              </button>

              <button
                type="button"
                id="terminal-withdraw-btn"
                onClick={() => setWithdrawOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-sm shadow-amber-500/20"
              >
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Withdraw</span>
              </button>

              <button
                type="button"
                onClick={toggleSound}
                title={stats.soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {stats.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={resetSandbox}
                title="Reset Simulator to $100k Cash"
                className={`p-1.5 rounded-lg border text-[10px] transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Terminal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* Left Navigation Sidebar */}
            <div className={`lg:col-span-2 border-b lg:border-b-0 lg:border-r p-2 sm:p-3 flex flex-row lg:flex-col justify-between overflow-x-auto no-scrollbar ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0E14] border-white/10'
            }`}>
              <div className="flex flex-row lg:flex-col gap-1 w-full flex-nowrap">
                <div className={`hidden lg:block px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider ${
                  isLight ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  Terminal Views
                </div>
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSidebarTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSidebarTab(tab.id as any)}
                      className={`flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-left flex-shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                          : isLight
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? 'text-white' : isLight ? 'text-slate-500' : 'text-gray-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== null && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-1.5 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Quick Status & Level Progress */}
              <div className={`hidden lg:block mt-auto p-3 rounded-xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151921] border-white/10'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Trader XP</span>
                  <span className="font-bold text-amber-500">{stats.xp} / {stats.nextLevelXp} XP</span>
                </div>
                {/* XP Progress Bar */}
                <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${
                  isLight ? 'bg-slate-200' : 'bg-black/40'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.xp / stats.nextLevelXp) * 100)}%` }}
                  />
                </div>
                <div className={`text-[10px] mt-2 flex items-center justify-between font-mono ${
                  isLight ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  <span>Win Rate</span>
                  <span className="font-bold text-emerald-500">
                    {stats.totalTrades > 0 ? `${Math.round((stats.winningTrades / stats.totalTrades) * 100)}%` : '100%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Center Area: Dynamic Tabs (Trading Desk, Open Positions, Portfolio, Orders, Game, Activity) */}
            <div className={`lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 border-b lg:border-b-0 lg:border-r ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#10141D] border-white/10'
            }`}>
              
              {/* TAB 1: TRADING DESK & LIVE INTERACTIVE CHART */}
              {activeSidebarTab === 'overview' && (
                <div className="space-y-3">
                  {/* Pair quick switch pill bar */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {Object.keys(markets).map((p) => {
                        const m = markets[p];
                        const isSelected = selectedPair === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSelectedPair(p)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                : isLight
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                                : 'bg-[#151921] text-gray-300 hover:text-white hover:bg-white/10 border-white/5'
                            }`}
                          >
                            <span>{p}</span>
                            <span className={`text-[10px] ${m.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* High-Precision Animated Live Trading Graph */}
                  <InteractiveTradingChart
                    pair={selectedPair}
                    currentQuote={currentMarket}
                    positions={positions}
                    isLight={isLight}
                    onClosePosition={handleClosePosition}
                    onShowToast={onShowToast}
                  />
                </div>
              )}

              {/* TAB 2: OPEN POSITIONS */}
              {activeSidebarTab === 'positions' && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`text-base font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Active Open Positions ({positions.length})
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        Live margin trades with real-time floating profit/loss calculation.
                      </p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      unrealizedPnl >= 0
                        ? isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      Floating P&L: {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)}
                    </span>
                  </div>

                  {positions.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <Layers className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-gray-600'}`} />
                      <div className={`text-sm font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                        No Active Positions Open
                      </div>
                      <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                        Use the order panel on the right to open a Buy (Long) or Sell (Short) position with up to 50x simulated leverage.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveSidebarTab('overview')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
                      >
                        Go to Order Desk
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {positions.map((pos) => {
                        const isLong = pos.side === 'long';
                        const isWin = pos.pnl >= 0;
                        return (
                          <div
                            key={pos.id}
                            className={`p-3.5 rounded-xl border font-mono text-xs transition-all ${
                              isLight
                                ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                : 'bg-black/30 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {/* Left: Side Badge, Pair, Leverage */}
                              <div className="flex items-center gap-2.5">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                  isLong
                                    ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'
                                    : isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {pos.side.toUpperCase()} {pos.leverage}x
                                </span>
                                <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  {pos.pair}
                                </span>
                                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>
                                  {pos.amount} {pos.pair.split('/')[0]}
                                </span>
                              </div>

                              {/* Right: Floating PnL & Close Button */}
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className={`font-bold text-sm ${
                                    isWin
                                      ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                                      : isLight ? 'text-rose-700' : 'text-rose-400'
                                  }`}>
                                    {isWin ? '+' : ''}${pos.pnl.toFixed(2)} ({isWin ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)
                                  </div>
                                  <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Margin: ${pos.margin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleClosePosition(pos.id)}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 border ${
                                    isWin
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                                      : isLight
                                        ? 'bg-white hover:bg-rose-50 border-rose-200 text-rose-700'
                                        : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                                  }`}
                                >
                                  Close
                                </button>
                              </div>
                            </div>

                            {/* Details Row */}
                            <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between text-[10px] ${
                              isLight ? 'border-slate-200 text-slate-500' : 'border-white/5 text-gray-400'
                            }`}>
                              <span>Entry: ${pos.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                              <span>Mark: ${pos.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                              <span>Opened: {pos.openTime}</span>
                              <span className="text-blue-500 font-semibold">Sub-second Clearance</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PORTFOLIO & ASSET HOLDINGS */}
              {activeSidebarTab === 'portfolio' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Portfolio Breakdown & Wallet
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        Simulated treasury management, margin capacity, and settled holdings.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDepositOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                      >
                        + Deposit
                      </button>
                      <button
                        type="button"
                        onClick={() => setWithdrawOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px]"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                      <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Cash Balance</span>
                      <span className={`text-sm font-bold block mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                      <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Total Equity</span>
                      <span className={`text-sm font-bold block mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        ${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                      <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Margin In Use</span>
                      <span className={`text-sm font-bold block mt-0.5 ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                        ${marginUsed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                      <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Realized Gain/Loss</span>
                      <span className={`text-sm font-bold block mt-0.5 ${realizedPnl >= 0 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                        {realizedPnl >= 0 ? '+' : ''}${realizedPnl.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Spot Asset Holdings List */}
                  <div>
                    <h4 className={`text-xs font-bold uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                      Active Asset Exposures ({holdings.length})
                    </h4>
                    {holdings.length === 0 ? (
                      <div className={`p-6 rounded-xl text-center border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                        No spot holdings currently open. Execute Buy orders to hold assets.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {holdings.map((h) => (
                          <div
                            key={h.symbol}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-sm">{h.name} ({h.symbol})</div>
                              <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                                Holding: {h.amount} {h.symbol} • Avg: ${h.avgBuyPrice.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${h.currentValue.toLocaleString()}</div>
                              <div className={`text-[10px] font-bold ${h.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)} ({h.pnlPercent.toFixed(2)}%)
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS & EXECUTION LOG */}
              {activeSidebarTab === 'orders' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Order Audit Trail ({orders.length})
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        Sub-second timestamped order matches and executions.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            ord.side === 'buy'
                              ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'
                              : isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {ord.side}
                          </span>
                          <div>
                            <div className="font-bold">{ord.amount} {ord.pair} @ ${ord.price.toLocaleString()}</div>
                            <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                              {ord.timestamp} • Fee: ${ord.fee.toFixed(2)} • {ord.type.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase">
                            {ord.status}
                          </span>
                          {ord.pnlRealized !== undefined && (
                            <div className={`text-[10px] font-bold mt-1 ${ord.pnlRealized >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              PnL: {ord.pnlRealized >= 0 ? '+' : ''}${ord.pnlRealized.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TRADER GAME LEVEL & ACHIEVEMENTS */}
              {activeSidebarTab === 'game' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Trader Rank & Achievements
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        Earn XP through trading volume, green closes, and fast withdrawals.
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold">
                      🏆 Level {stats.level}
                    </div>
                  </div>

                  {/* Level Card */}
                  <div className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-slate-900' : 'bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-blue-500/20 text-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Current Classification</div>
                        <div className="text-lg font-bold mt-0.5">{stats.rank}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-500">{stats.xp} / {stats.nextLevelXp} XP</div>
                        <div className="text-[10px] text-slate-500">Next Rank: Level {stats.level + 1}</div>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 mt-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (stats.xp / stats.nextLevelXp) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {achievements.map((ach) => {
                      const isUnlocked = 
                        ach.id === 'first_trade' ? stats.totalTrades > 0 :
                        ach.id === 'profit_maker' ? stats.winningTrades > 0 :
                        ach.id === 'first_withdraw' ? stats.xp >= 200 :
                        ach.id === 'whale_status' ? equity >= 150000 : false;

                      return (
                        <div
                          key={ach.id}
                          className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                            isUnlocked
                              ? isLight ? 'bg-emerald-50/60 border-emerald-200 text-slate-900' : 'bg-emerald-950/20 border-emerald-500/30 text-white'
                              : isLight ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60' : 'bg-black/20 border-white/5 text-gray-500 opacity-60'
                          }`}
                        >
                          <span className="text-2xl">{ach.icon}</span>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{ach.title}</span>
                              {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            </div>
                            <p className="text-[10px] mt-0.5">{ach.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: ACTIVITY & STREAM */}
              {activeSidebarTab === 'activity' && (
                <div className="space-y-2 font-mono">
                  <div className={`flex items-center justify-between pb-2 border-b text-xs ${
                    isLight ? 'border-slate-100' : 'border-white/5'
                  }`}>
                    <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Global Institutional Settlement Stream
                    </span>
                    <span className="text-blue-600 font-bold">100% On-Wire Verified</span>
                  </div>

                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {terminalTxs.map((tx) => {
                        const isDeposit = tx.type === 'deposit';
                        const isWithdrawal = tx.type === 'withdrawal';
                        const isSent = tx.type === 'sent';
                        const color = isDeposit
                          ? isLight ? 'text-emerald-600' : 'text-green-400'
                          : isWithdrawal
                          ? isLight ? 'text-amber-600' : 'text-amber-400'
                          : isSent
                          ? isLight ? 'text-blue-600' : 'text-blue-400'
                          : isLight ? 'text-purple-600' : 'text-purple-400';

                        return (
                          <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                              isLight
                                ? 'bg-slate-50 border-slate-100 hover:border-slate-300'
                                : 'bg-black/40 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-base" role="img" aria-label={tx.country}>
                                {tx.flag}
                              </span>
                              <div>
                                <div className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  <span>{tx.userName}</span>{' '}
                                  <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>from</span> {tx.country}{' '}
                                  <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{getActionVerb(tx.type)}</span>
                                </div>
                                <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                                  <span>{tx.asset}</span> • <span>{tx.relativeTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className={`font-bold ${color}`}>
                                {isDeposit ? '+' : isWithdrawal ? '-' : ''}
                                {tx.formattedAmount}
                              </div>
                              <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{tx.txHash}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Bottom Live Broadcast Strip */}
              <div className={`mt-3 py-2 px-3 border rounded-lg flex items-center justify-between text-[11px] font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
              }`}>
                <div className={`flex items-center gap-2 truncate ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  <span className="text-blue-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-600" /> TICKER FEED:
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={latestTerminalTx.id}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.2 }}
                      className={`truncate ${isLight ? 'text-slate-700' : 'text-gray-300'}`}
                    >
                      <b className={isLight ? 'text-slate-900' : 'text-white'}>{latestTerminalTx.userName}</b> ({latestTerminalTx.country}){' '}
                      {getActionVerb(latestTerminalTx.type)}{' '}
                      <span className={isLight ? 'text-emerald-600 font-bold' : 'text-green-400 font-bold'}>
                        {latestTerminalTx.formattedAmount}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className={`text-[10px] hidden sm:inline ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>&lt;10ms broadcast</span>
              </div>
            </div>

            {/* Right Panel: Interactive BUY & SELL Order Placement */}
            <div className={`lg:col-span-3 p-4 sm:p-5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50' : 'bg-[#151921]'
            }`}>
              <div>
                {/* Header */}
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isLight ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Trade Execution
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    isLight
                      ? 'bg-white border-slate-200 text-emerald-700 shadow-sm'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    LIVE MATCHING
                  </span>
                </div>

                {/* BUY / SELL Tabs */}
                <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border mt-3 ${
                  isLight ? 'bg-slate-200/70 border-slate-300' : 'bg-black/40 border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => setOrderSide('buy')}
                    className={`py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                      orderSide === 'buy'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide('sell')}
                    className={`py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                      orderSide === 'sell'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                {/* Leverage Selector (Game multiplier) */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className={isLight ? 'text-slate-600 font-semibold' : 'text-gray-300 font-semibold'}>Leverage Multiplier</span>
                    <span className="text-blue-500 font-bold">{leverage}x</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 5, 10, 20].map((lev) => (
                      <button
                        key={lev}
                        type="button"
                        onClick={() => setLeverage(lev)}
                        className={`py-1 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                          leverage === lev
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : isLight
                              ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-black/30 hover:bg-white/10 border-white/5 text-gray-300'
                        }`}
                      >
                        {lev}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <label htmlFor="terminal-order-amount-input" className={isLight ? 'text-slate-700 font-semibold' : 'text-gray-300 font-semibold'}>
                      Size ({selectedPair.split('/')[0]})
                    </label>
                    <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                      Avail: ${(balance * leverage / orderPriceNumber).toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="terminal-order-amount-input"
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
                        : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                  {/* Quick percentage buttons */}
                  <div className="grid grid-cols-4 gap-1 mt-1.5">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          const maxUnits = (balance * leverage * 0.95) / orderPriceNumber;
                          const calculated = (maxUnits * (pct / 100)).toFixed(2);
                          setOrderAmount(calculated);
                        }}
                        className={`py-0.5 text-[10px] font-mono rounded transition-colors border ${
                          isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                            : 'bg-black/40 hover:bg-white/10 border-white/5 text-gray-400'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimated Margin & Value Breakdown */}
                <div className={`mt-3 p-2.5 rounded-xl space-y-1.5 text-[11px] font-mono border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                    : 'bg-black/40 border-white/5 text-gray-400'
                }`}>
                  <div className="flex justify-between">
                    <span>Order Value</span>
                    <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Margin</span>
                    <span className={`font-bold ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                      ${requiredMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Fee (0.05%)</span>
                    <span>${estimatedFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Order Action Button */}
              <div className="mt-4">
                <button
                  type="button"
                  id="terminal-submit-order-btn"
                  onClick={handleExecuteTrade}
                  className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-xs transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                    orderSide === 'buy'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{orderSide === 'buy' ? `BUY / LONG ${selectedPair}` : `SELL / SHORT ${selectedPair}`}</span>
                </button>
                <div className={`flex items-center justify-between text-[10px] mt-2 font-mono ${
                  isLight ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  <span>Instant Match Engine</span>
                  <span className="text-emerald-500 font-semibold">1.2ms Fill</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Interactive Deposit & Withdraw Modals */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccessToast={onShowToast}
      />

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccessToast={onShowToast}
      />
    </section>
  );
};
