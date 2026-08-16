import React, { useState } from 'react';
import { X, Check, ShieldCheck, ArrowRight, Lock, Sparkles, Building, User } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface AccountModalProps {
  isOpen: boolean;
  mode: 'open_account' | 'login';
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, mode, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'individual' | 'institutional'>('individual');
  const [selectedTier, setSelectedTier] = useState<'standard' | 'pro' | 'prime'>('pro');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess(
        mode === 'open_account'
          ? `Welcome to NEXORA! Demo sandbox credentials issued for ${email || 'trader@nexora.io'}.`
          : `Signed into NEXORA Sandbox session for ${email || 'trader@nexora.io'}.`
      );
      onClose();
      setIsSubmitted(false);
    }, 600);
  };

  return (
    <div
      id="account-modal-overlay"
      className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto ${
        isLight ? 'bg-slate-900/50' : 'bg-[#0A0E14]/80'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border ${
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
        <div className="mb-6">
          <Logo size="sm" />
          <h3 className={`text-xl sm:text-2xl font-bold mt-4 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {mode === 'open_account' ? 'Open Institutional Account' : 'Log In to Portal'}
          </h3>
          <p className={`text-xs mt-1 ${
            isLight ? 'text-slate-500' : 'text-gray-400'
          }`}>
            {mode === 'open_account'
              ? 'Access global currencies, commodities, indices, and digital asset markets with sub-millisecond execution.'
              : 'Enter your credentials or launch an instant demo session.'}
          </p>
        </div>

        {mode === 'open_account' && (
          <>
            {/* Account Type Selector */}
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border mb-6 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'individual'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Active Trader</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('institutional')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'institutional'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Institutional / Fund</span>
              </button>
            </div>

            {/* Account Tier Selector */}
            <div className="space-y-2 mb-6">
              <span className={`text-[11px] font-mono uppercase tracking-wider block ${
                isLight ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Select Execution Tier
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', name: 'Standard', spread: 'From 0.6 pips' },
                  { id: 'pro', name: 'Pro Raw', spread: 'From 0.0 pips' },
                  { id: 'prime', name: 'Prime Direct', spread: 'Custom FIX API' },
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id as any)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTier === tier.id
                        ? isLight ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-sm' : 'bg-black/60 border-blue-500 text-white shadow-sm'
                        : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300' : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{tier.name}</div>
                    <div className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{tier.spread}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'open_account' && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 font-mono ${
                isLight ? 'text-slate-700' : 'text-gray-300'
              }`}>
                Full Name / Organization
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan / Apex Capital"
                className={`w-full rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-mono border ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-black/40 border-white/10 text-white placeholder:text-gray-500'
                }`}
              />
            </div>
          )}

          <div>
            <label className={`block text-xs font-medium mb-1.5 font-mono ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}>
              Business or Personal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@nexora.io"
              className={`w-full rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-mono border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-black/40 border-white/10 text-white placeholder:text-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 font-mono ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}>
              Password / Access Key
            </label>
            <input
              type="password"
              defaultValue="••••••••••••"
              className={`w-full rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-mono border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-black/40 border-white/10 text-white placeholder:text-gray-500'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitted}
            className="w-full mt-6 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-blue-600/20 disabled:opacity-70"
          >
            <span>{mode === 'open_account' ? 'Launch Demo Workspace' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Demo Disclaimer in Modal */}
        <div className={`mt-5 pt-4 border-t text-center text-[11px] font-mono ${
          isLight ? 'border-slate-100 text-slate-400' : 'border-white/10 text-gray-500'
        }`}>
          Simulation prototype • No real capital required to explore
        </div>
      </div>
    </div>
  );
};
