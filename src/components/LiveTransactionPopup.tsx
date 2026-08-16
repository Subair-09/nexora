import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDownLeft, ArrowUpRight, Send, RefreshCw, X, ShieldCheck, Volume2, VolumeX, Eye } from 'lucide-react';
import { LiveTransaction } from '../types';
import { getActionVerb } from '../data/transactionData';
import { useTheme } from '../context/ThemeContext';

interface LiveTransactionPopupProps {
  currentTransaction: LiveTransaction | null;
  onViewLedger?: () => void;
  onSelectTransaction?: (tx: LiveTransaction) => void;
}

export const LiveTransactionPopup: React.FC<LiveTransactionPopupProps> = ({
  currentTransaction,
  onViewLedger,
  onSelectTransaction,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Play subtle sound when unmuted and new transaction comes in
  useEffect(() => {
    if (!isMuted && currentTransaction && isVisible) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(currentTransaction.type === 'deposit' ? 880 : 660, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        // Ignore audio playback errors
      }
    }
  }, [currentTransaction, isMuted, isVisible]);

  if (!currentTransaction || !isVisible) return null;

  const getTypeStyles = () => {
    switch (currentTransaction.type) {
      case 'deposit':
        return {
          icon: ArrowDownLeft,
          color: isLight ? 'text-emerald-700' : 'text-green-400',
          bg: isLight ? 'bg-emerald-50' : 'bg-green-500/10',
          border: isLight ? 'border-emerald-200' : 'border-green-500/30',
          badgeText: 'DEPOSIT',
        };
      case 'withdrawal':
        return {
          icon: ArrowUpRight,
          color: isLight ? 'text-amber-700' : 'text-amber-400',
          bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
          border: isLight ? 'border-amber-200' : 'border-amber-500/30',
          badgeText: 'WITHDRAWAL',
        };
      case 'sent':
        return {
          icon: Send,
          color: isLight ? 'text-blue-700' : 'text-blue-400',
          bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10',
          border: isLight ? 'border-blue-200' : 'border-blue-500/30',
          badgeText: 'SENT / TRANSFER',
        };
      case 'trade':
        return {
          icon: RefreshCw,
          color: isLight ? 'text-purple-700' : 'text-purple-400',
          bg: isLight ? 'bg-purple-50' : 'bg-purple-500/10',
          border: isLight ? 'border-purple-200' : 'border-purple-500/30',
          badgeText: 'TRADE EXECUTED',
        };
    }
  };

  const style = getTypeStyles();
  const IconComponent = style.icon;

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-3 right-3 sm:right-auto sm:left-5 z-40 max-w-sm sm:w-full pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTransaction.id}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`pointer-events-auto rounded-xl p-3.5 shadow-2xl backdrop-blur-md transition-all border ${
            isLight
              ? 'bg-white/95 border-slate-200 shadow-slate-900/15'
              : 'bg-[#111622] border-white/10 hover:border-white/25 shadow-black/80'
          }`}
        >
          {/* Header Row: Live Badge & Controls */}
          <div className={`flex items-center justify-between gap-2 mb-2 pb-1.5 border-b ${
            isLight ? 'border-slate-100' : 'border-white/5'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                REAL-TIME TRANSACTION
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Enable transaction sound' : 'Mute sound'}
                className={`p-1 rounded transition-colors ${
                  isLight
                    ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className={`p-1 rounded transition-colors ${
                  isLight
                    ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-gray-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Transaction Body */}
          <div
            className="cursor-pointer group flex items-start gap-3"
            onClick={() => {
              if (onSelectTransaction) onSelectTransaction(currentTransaction);
              else if (onViewLedger) onViewLedger();
            }}
          >
            {/* Left Type Icon with Country Flag */}
            <div className="relative flex-shrink-0">
              <div className={`w-9 h-9 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center ${style.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs" role="img" aria-label={currentTransaction.country}>
                {currentTransaction.flag}
              </span>
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0">
              <div className="text-xs leading-snug">
                <span className={`font-bold transition-colors ${
                  isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'
                }`}>
                  {currentTransaction.userName}
                </span>{' '}
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>from</span>{' '}
                <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{currentTransaction.country}</span>{' '}
                <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{getActionVerb(currentTransaction.type)}</span>
              </div>

              {/* Amount and Asset */}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-bold font-mono ${style.color}`}>
                  {currentTransaction.formattedAmount}
                </span>
                {currentTransaction.asset && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border truncate max-w-[120px] ${
                    isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-black/40 text-gray-400 border-white/5'
                  }`}>
                    {currentTransaction.asset}
                  </span>
                )}
              </div>

              {/* Sub-info: TxHash & Time */}
              <div className={`flex items-center justify-between text-[10px] font-mono mt-1.5 pt-1 border-t ${
                isLight ? 'border-slate-100 text-slate-400' : 'border-white/5 text-gray-500'
              }`}>
                <span className="flex items-center gap-1">
                  <ShieldCheck className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-green-400'}`} />
                  <span>{currentTransaction.txHash}</span>
                </span>
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>{currentTransaction.relativeTime}</span>
              </div>
            </div>
          </div>

          {/* Quick Ledger link */}
          {onViewLedger && (
            <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
              isLight ? 'border-slate-100' : 'border-white/5'
            }`}>
              <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Sub-second global clearance</span>
              <button
                type="button"
                onClick={onViewLedger}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Live Ledger</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
