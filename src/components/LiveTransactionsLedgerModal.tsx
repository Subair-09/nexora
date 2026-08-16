import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Send, RefreshCw, ShieldCheck, Activity, Filter, Check, Copy } from 'lucide-react';
import { LiveTransaction, TransactionType } from '../types';
import { getActionVerb } from '../data/transactionData';
import { useTheme } from '../context/ThemeContext';

interface LiveTransactionsLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: LiveTransaction[];
  onSelectTransaction?: (tx: LiveTransaction) => void;
}

export const LiveTransactionsLedgerModal: React.FC<LiveTransactionsLedgerModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeFilter, setActiveFilter] = useState<'all' | TransactionType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = transactions.filter((tx) => {
    if (activeFilter === 'all') return true;
    return tx.type === activeFilter;
  });

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStyle = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return {
          icon: ArrowDownLeft,
          color: isLight ? 'text-emerald-700' : 'text-green-400',
          bg: isLight ? 'bg-emerald-50' : 'bg-green-500/10',
          border: isLight ? 'border-emerald-200' : 'border-green-500/20',
          label: 'Deposit',
        };
      case 'withdrawal':
        return {
          icon: ArrowUpRight,
          color: isLight ? 'text-amber-700' : 'text-amber-400',
          bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
          border: isLight ? 'border-amber-200' : 'border-amber-500/20',
          label: 'Withdrawal',
        };
      case 'sent':
        return {
          icon: Send,
          color: isLight ? 'text-blue-700' : 'text-blue-400',
          bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10',
          border: isLight ? 'border-blue-200' : 'border-blue-500/20',
          label: 'Sent / Transfer',
        };
      case 'trade':
        return {
          icon: RefreshCw,
          color: isLight ? 'text-purple-700' : 'text-purple-400',
          bg: isLight ? 'bg-purple-50' : 'bg-purple-500/10',
          border: isLight ? 'border-purple-200' : 'border-purple-500/20',
          label: 'Trade',
        };
    }
  };

  return (
    <div
      id="live-ledger-modal-overlay"
      className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
        isLight ? 'bg-slate-900/50' : 'bg-[#0A0E14]/80'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative rounded-2xl max-w-3xl w-full p-4 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] border ${
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

        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                GLOBAL REAL-TIME AUDIT LEDGER
              </span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Live Network Transactions
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Streaming real-time global deposits, withdrawals, transfers and order executions across all tiers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className={`flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl border text-xs font-mono ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : 'bg-black/40 border-white/10'
          }`}>
            <div>
              <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Total Monitored</span>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{transactions.length} events</span>
            </div>
            <div className={`h-6 w-px mx-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
            <div>
              <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Throughput</span>
              <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-green-400'}`}>99.99% Fill</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className={`flex items-center gap-2 py-3 overflow-x-auto border-b scrollbar-none ${
          isLight ? 'border-slate-100' : 'border-white/5'
        }`}>
          <span className={`text-xs font-mono flex items-center gap-1 mr-1 ${
            isLight ? 'text-slate-400' : 'text-gray-500'
          }`}>
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {(['all', 'deposit', 'withdrawal', 'sent', 'trade'] as const).map((filterType) => (
            <button
              key={filterType}
              type="button"
              onClick={() => setActiveFilter(filterType)}
              className={`px-3 py-1 text-xs font-mono rounded-lg capitalize whitespace-nowrap transition-all border ${
                activeFilter === filterType
                  ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                  : isLight
                    ? 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                    : 'bg-black/30 text-gray-400 hover:text-white hover:bg-black/50 border-white/5'
              }`}
            >
              {filterType === 'all' ? 'All Activity' : filterType === 'sent' ? 'Sent / Transfer' : filterType}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className={`flex-1 overflow-y-auto divide-y pr-1 py-2 space-y-1 ${
          isLight ? 'divide-slate-100' : 'divide-white/5'
        }`}>
          {filtered.length === 0 ? (
            <div className={`py-12 text-center text-xs font-mono ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
              No transactions matching filter criteria.
            </div>
          ) : (
            filtered.map((tx) => {
              const style = getStyle(tx.type);
              const IconComp = style.icon;
              return (
                <div
                  key={tx.id}
                  className={`p-3 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    isLight
                      ? 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                      : 'hover:bg-black/30 border-transparent hover:border-white/5'
                  }`}
                >
                  {/* Left Side: Avatar/Flag, User, Description */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center ${style.color} relative flex-shrink-0`}>
                      <IconComp className="w-4 h-4" />
                      <span className="absolute -bottom-1 -right-1 text-[11px]">{tx.flag}</span>
                    </div>

                    <div>
                      <div className="text-xs">
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{tx.userName}</span>{' '}
                        <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>from</span>{' '}
                        <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{tx.country}</span>{' '}
                        <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{getActionVerb(tx.type)}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] font-mono mt-0.5 ${
                        isLight ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        <span>{tx.asset || style.label}</span>
                        <span>•</span>
                        <span>{tx.relativeTime}</span>
                        <span>•</span>
                        <span className={`flex items-center gap-0.5 ${isLight ? 'text-emerald-700' : 'text-green-400'}`}>
                          <ShieldCheck className="w-3 h-3 inline" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Amount, TxHash Copy */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                    <div className="text-left sm:text-right">
                      <div className={`text-sm font-bold ${style.color}`}>
                        {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                        {tx.formattedAmount}
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                        {tx.currency}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(tx.txHash, tx.id)}
                      title="Copy transaction hash"
                      className={`p-1.5 rounded border transition-colors flex items-center gap-1 text-[10px] ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                          : 'bg-black/40 hover:bg-black/60 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{tx.txHash}</span>
                      {copiedId === tx.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`pt-4 mt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono ${
          isLight ? 'border-slate-200 text-slate-400' : 'border-white/10 text-gray-500'
        }`}>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Telemetry verified • Continuous sub-second reconciliation</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg border transition-colors text-xs ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                : 'bg-black/40 hover:bg-black/60 text-white border-white/10'
            }`}
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
