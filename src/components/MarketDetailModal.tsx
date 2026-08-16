import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ArrowRight, BarChart2, ShieldCheck, Activity } from 'lucide-react';
import { MarketAsset } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MarketDetailModalProps {
  market: MarketAsset | null;
  onClose: () => void;
  onTradeInTerminal: (pair: string) => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  market,
  onClose,
  onTradeInTerminal,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!market) return null;

  const isPositive = market.change24h >= 0;

  return (
    <div
      id="market-detail-modal-overlay"
      className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto ${
        isLight ? 'bg-slate-900/50' : 'bg-[#0A0E14]/80'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-[#151921] border-white/10 text-white shadow-black'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Pair, Name, Category */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono border ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-900'
              : 'bg-black/40 border-white/10 text-white'
          }`}>
            {market.pair.split('/')[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{market.pair}</h3>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}>
                {market.category.replace('_', ' ')}
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{market.name}</p>
          </div>
        </div>

        {/* Price & Change Banner */}
        <div className={`p-4 rounded-xl flex items-center justify-between mb-6 border ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-black/40 border-white/10'
        }`}>
          <div>
            <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Current Price</span>
            <div className={`text-2xl sm:text-3xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {market.displayPrice}
            </div>
          </div>

          <div
            className={`text-sm font-bold font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 border ${
              isPositive
                ? isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-green-500/10 text-green-400 border-green-500/30'
                : isLight
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? '+' : ''}
              {market.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono">
          <div className={`p-3 rounded-lg border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
          }`}>
            <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>24h High</span>
            <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{market.high24h}</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
          }`}>
            <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>24h Low</span>
            <span className={`font-bold mt-0.5 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{market.low24h}</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
          }`}>
            <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>24h Volume</span>
            <span className={`font-bold mt-0.5 block ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>{market.volume24h}</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
          }`}>
            <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Spread</span>
            <span className={`font-bold mt-0.5 block ${isLight ? 'text-emerald-700' : 'text-green-400'}`}>{market.spread}</span>
          </div>
        </div>

        {/* Bid / Ask Breakdown */}
        <div className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-mono mb-6 border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
        }`}>
          <div className="text-left">
            <span className={`text-[10px] font-bold block ${isLight ? 'text-emerald-700' : 'text-green-400'}`}>BID PRICE</span>
            <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{market.bidPrice}</span>
          </div>
          <div className={`h-6 w-px ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
          <div className="text-right">
            <span className={`text-[10px] font-bold block ${isLight ? 'text-rose-700' : 'text-red-400'}`}>ASK PRICE</span>
            <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{market.askPrice}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onTradeInTerminal(market.pair);
            }}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
          >
            <span>Open in Trading Terminal</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
