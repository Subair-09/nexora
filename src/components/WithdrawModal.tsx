import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Landmark, 
  CreditCard, 
  Sparkles, 
  DollarSign, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { useTheme } from '../context/ThemeContext';
import { WithdrawalRecord } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { balance, withdrawFunds } = useTrading();

  const [method, setMethod] = useState<'crypto_usdt' | 'bank_wire' | 'crypto_btc' | 'instant_card'>('crypto_usdt');
  const [amount, setAmount] = useState<string>('5000');
  const [destination, setDestination] = useState<string>('0x71C...8e3b');
  const [step, setStep] = useState<'input' | 'processing' | 'receipt'>('input');
  const [progressStage, setProgressStage] = useState<number>(0);
  const [latestReceipt, setLatestReceipt] = useState<WithdrawalRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount || '0');
  const fee = method === 'bank_wire' ? 15.00 : method === 'crypto_btc' ? 8.50 : 1.50;
  const netDisbursement = Math.max(0, numAmount);

  const handleQuickPercent = (pct: number) => {
    const maxAvailable = Math.max(0, balance - fee);
    const calculated = (maxAvailable * (pct / 100)).toFixed(2);
    setAmount(calculated);
    setErrorMsg(null);
  };

  const handleStartWithdraw = () => {
    setErrorMsg(null);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }

    if (numAmount + fee > balance) {
      setErrorMsg(`Insufficient cash. Balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} (including $${fee} fee).`);
      return;
    }

    if (!destination.trim()) {
      setErrorMsg('Please enter a destination account or address.');
      return;
    }

    // Begin animated settlement flow
    setStep('processing');
    setProgressStage(1);

    setTimeout(() => {
      setProgressStage(2);
    }, 700);

    setTimeout(() => {
      setProgressStage(3);
    }, 1400);

    setTimeout(() => {
      const result = withdrawFunds({
        amount: numAmount,
        method,
        destination,
        currency: method === 'crypto_btc' ? 'BTC' : method === 'crypto_usdt' ? 'USDT' : 'USD',
      });

      if (result.success && result.record) {
        setLatestReceipt(result.record);
        setStep('receipt');
        onSuccessToast(
          'Withdrawal Disbursed & Settled!',
          `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been sent to ${destination}`
        );
      } else {
        setErrorMsg(result.message);
        setStep('input');
      }
    }, 2100);
  };

  const handleCopyReceipt = () => {
    if (latestReceipt) {
      navigator.clipboard?.writeText(
        `NEXORA SETTLEMENT RECEIPT\nTxID: ${latestReceipt.txHash}\nAmount: $${latestReceipt.amount.toLocaleString()}\nFee: $${latestReceipt.fee}\nDestination: ${latestReceipt.destination}\nStatus: SETTLED`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setStep('input');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      id="withdraw-modal-overlay"
      className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
        isLight ? 'bg-slate-900/50' : 'bg-[#0A0E14]/85'
      }`}
      onClick={step === 'processing' ? undefined : resetAndClose}
    >
      <div
        className={`relative rounded-2xl max-w-lg w-full p-5 sm:p-7 max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150 border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-[#151921] border-white/10 text-white shadow-black'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            type="button"
            onClick={resetAndClose}
            className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: INPUT VIEW */}
        {step === 'input' && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Simulated Withdrawal
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold">
                    FASTPAY
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Disburse profits and demo funds to simulated crypto or bank rails.
                </p>
              </div>
            </div>

            {/* Balance Bar */}
            <div className={`p-3.5 rounded-xl flex items-center justify-between mb-4 border font-mono ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
            }`}>
              <div>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Available To Withdraw</span>
                <span className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Max Clearance</span>
                <span className={`text-xs font-semibold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Instant Sub-Second</span>
              </div>
            </div>

            {/* Method Selection */}
            <div className="mb-4">
              <label className={`block text-xs font-mono mb-2 font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Payout Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'crypto_usdt', label: 'USDT (TRC20)', icon: Sparkles, fee: '$1.50' },
                  { id: 'bank_wire', label: 'Bank Wire', icon: Landmark, fee: '$15.00' },
                  { id: 'crypto_btc', label: 'Bitcoin (SegWit)', icon: Zap, fee: '$8.50' },
                  { id: 'instant_card', label: 'Visa / MC', icon: CreditCard, fee: '$1.50' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMethod(m.id as any);
                      if (m.id === 'bank_wire') setDestination('CH93 0076 2011 6238 5295 7');
                      else if (m.id === 'crypto_btc') setDestination('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
                      else if (m.id === 'instant_card') setDestination('**** **** **** 4092');
                      else setDestination('0x71C...8e3b (USDT-TRC20)');
                    }}
                    className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                      method === m.id
                        ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                        : isLight
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <m.icon className={`w-4 h-4 mb-1 ${method === m.id ? 'text-blue-500' : isLight ? 'text-slate-500' : 'text-gray-400'}`} />
                    <div className={`text-xs font-bold truncate ${method === m.id ? 'text-blue-600' : isLight ? 'text-slate-900' : 'text-white'}`}>
                      {m.label}
                    </div>
                    <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Fee: {m.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Input */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="withdraw-destination-input" className={`font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {method === 'bank_wire' ? 'IBAN / Swift Routing' : method === 'instant_card' ? 'Card Number' : 'Recipient Wallet Address'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (method === 'bank_wire') setDestination('US44 CITI 0210 0002 9847 2194');
                    else if (method === 'crypto_btc') setDestination('bc1q9e728fx8jkae39fjd9w1074kdk2kd');
                    else setDestination('0x9a8f27b7d07C16fAc940c3132e49c7162b45E1B9');
                  }}
                  className="text-blue-600 hover:underline text-[10px]"
                >
                  Use Demo Address
                </button>
              </div>
              <input
                id="withdraw-destination-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl font-mono text-xs border focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                }`}
                placeholder="Enter address or account"
              />
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="withdraw-amount-input" className={`font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Withdrawal Amount (USD)
                </label>
                <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>Min: $10.00</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DollarSign className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="withdraw-amount-input"
                  type="number"
                  min="10"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl font-mono text-sm font-bold border focus:outline-none focus:border-blue-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                  }`}
                  placeholder="5000"
                />
              </div>

              {/* Percentage pills */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className={`py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        : 'bg-black/30 hover:bg-white/10 border-white/5 text-gray-300'
                    }`}
                  >
                    {pct === 100 ? 'MAX (100%)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* Summary breakdown */}
            <div className={`p-3.5 rounded-xl space-y-1.5 text-xs font-mono mb-5 border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'
            }`}>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Requested Payout</span>
                <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Network / Routing Fee</span>
                <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>-${fee.toFixed(2)}</span>
              </div>
              <div className={`pt-1.5 mt-1 border-t flex justify-between font-bold ${
                isLight ? 'border-slate-200 text-emerald-700' : 'border-white/10 text-green-400'
              }`}>
                <span>Net Credited</span>
                <span>${netDisbursement.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              id="confirm-withdrawal-button"
              onClick={handleStartWithdraw}
              disabled={numAmount <= 0 || numAmount + fee > balance}
              className="w-full py-3 px-4 rounded-xl font-mono font-bold text-xs bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Confirm & Disburse ${numAmount.toLocaleString()}</span>
            </button>
          </div>
        )}

        {/* STEP 2: PROCESSING SETTLEMENT ANIMATION */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>

            <div>
              <h4 className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Broadcasting Settlement
              </h4>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Executing sub-second cryptographic proof & liquidity clearance...
              </p>
            </div>

            {/* Stepper Status Indicators */}
            <div className={`max-w-xs mx-auto text-left space-y-2.5 p-4 rounded-xl text-xs font-mono border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                {progressStage >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-400" />
                )}
                <span className={progressStage >= 1 ? (isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold') : 'text-slate-400'}>
                  1. Zero-Knowledge Proof Generated
                </span>
              </div>

              <div className="flex items-center gap-2">
                {progressStage >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-400" />
                )}
                <span className={progressStage >= 2 ? (isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold') : 'text-slate-400'}>
                  2. Institutional Liquidity Matched
                </span>
              </div>

              <div className="flex items-center gap-2">
                {progressStage >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-400" />
                )}
                <span className={progressStage >= 3 ? (isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold') : 'text-slate-400'}>
                  3. Ledger On-Wire Settlement Confirmed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RECEIPT VIEW */}
        {step === 'receipt' && latestReceipt && (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-bold tracking-wider uppercase mb-2">
              <Lock className="w-3 h-3" /> SETTLEMENT FINALIZED
            </div>

            <h4 className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ${latestReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h4>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Disbursed to <span className={`font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{latestReceipt.destination}</span>
            </p>

            {/* Receipt Details Box */}
            <div className={`mt-5 p-4 rounded-xl text-left space-y-2 text-xs font-mono border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/40 border-white/10 text-gray-300'
            }`}>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Transaction ID</span>
                <span className="font-semibold">{latestReceipt.txHash}</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Method</span>
                <span className="capitalize">{latestReceipt.method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Timestamp</span>
                <span>{new Date().toLocaleTimeString()} (Sub-second)</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Remaining Demo Cash</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    : 'bg-black/30 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <span>Back to Terminal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
