import React, { useState } from 'react';
import { X, ArrowDownLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, CreditCard, DollarSign } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { useTheme } from '../context/ThemeContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { balance, depositFunds } = useTrading();

  const [amount, setAmount] = useState<string>('10000');
  const [selectedChannel, setSelectedChannel] = useState<'instant' | 'crypto' | 'wire'>('instant');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const PRESET_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleDeposit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const channelName = 
        selectedChannel === 'instant' ? 'Direct Liquidity Faucet' :
        selectedChannel === 'crypto' ? 'USDT On-Chain Faucet' : 'Simulated Bank Ingress';

      depositFunds(num, channelName);
      onSuccessToast(
        'Deposit Credited Instantly!',
        `+$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been added to your demo cash balance.`
      );

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 750);
  };

  return (
    <div
      id="deposit-modal-overlay"
      className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
        isLight ? 'bg-slate-900/50' : 'bg-[#0A0E14]/85'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative rounded-2xl max-w-md w-full p-5 sm:p-7 max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150 border ${
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
          disabled={isProcessing}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Deposit Demo Funds
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                INSTANT
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Top up your simulated trading balance with free sandbox capital.
            </p>
          </div>
        </div>

        {/* Current Balance Display */}
        <div className={`p-3.5 rounded-xl flex items-center justify-between mb-5 border font-mono ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
        }`}>
          <div>
            <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Current Cash Balance</span>
            <span className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Settlement</span>
            <span className={`text-xs font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>0.00s Instant</span>
          </div>
        </div>

        {/* Deposit Channel Selector */}
        <div className="mb-4">
          <label className={`block text-xs font-mono mb-2 font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
            Funding Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'instant', label: 'Fast Faucet', icon: Zap, sub: 'Instant Credit' },
              { id: 'crypto', label: 'Crypto USDT', icon: Sparkles, sub: 'Zero Gas' },
              { id: 'wire', label: 'Demo Card', icon: CreditCard, sub: 'Direct Ingress' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedChannel(c.id as any)}
                className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                  selectedChannel === c.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <c.icon className={`w-4 h-4 mb-1 ${selectedChannel === c.id ? 'text-blue-500' : isLight ? 'text-slate-500' : 'text-gray-400'}`} />
                <div className={`text-xs font-bold ${selectedChannel === c.id ? 'text-blue-600' : isLight ? 'text-slate-900' : 'text-white'}`}>
                  {c.label}
                </div>
                <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{c.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <label htmlFor="deposit-amount-input" className={`font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              Deposit Amount (USD)
            </label>
            <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>No limits</span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <DollarSign className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
            </div>
            <input
              id="deposit-amount-input"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl font-mono text-sm font-bold border focus:outline-none focus:border-blue-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
              }`}
              placeholder="10000"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className={`py-1 text-xs font-mono rounded-lg border transition-all ${
                  amount === amt.toString()
                    ? 'bg-blue-600 border-blue-600 text-white font-bold'
                    : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-black/30 hover:bg-white/10 border-white/5 text-gray-300'
                }`}
              >
                +${amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className={`p-3 rounded-xl flex items-center gap-2 mb-5 text-[11px] font-mono border ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-black/20 border-white/5 text-gray-400'
        }`}>
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Simulated capital credited immediately to trade live crypto, forex, and commodities.</span>
        </div>

        {/* Submit Action */}
        <button
          type="button"
          id="confirm-deposit-button"
          onClick={handleDeposit}
          disabled={isProcessing || isSuccess || !amount || parseFloat(amount) <= 0}
          className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            isSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white shadow-blue-600/25'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Simulating Clearance...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Deposited Successfully!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-white" />
              <span>Deposit ${parseFloat(amount || '0').toLocaleString()} to Sandbox</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
