import React from 'react';
import { ArrowRight, ArrowUpRight, ShieldCheck, Globe2, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FinalCTAProps {
  onOpenAccount: () => void;
  onExploreMarkets: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenAccount, onExploreMarkets }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="final-cta"
      className={`py-20 lg:py-28 border-t relative overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      {/* Background Financial Grid & Subtle Lighting */}
      <div className={`absolute inset-0 bg-financial-grid pointer-events-none ${isLight ? 'opacity-30' : 'opacity-75'}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-[120px] rounded-full pointer-events-none ${
        isLight ? 'bg-blue-500/10' : 'bg-blue-600/5'
      }`} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 shadow-sm ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#151921] border-white/10 text-gray-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[11px] font-mono font-semibold tracking-widest uppercase">
            INSTITUTIONAL ACCESS • ZERO COMPLEXITY
          </span>
        </div>

        {/* Headline */}
        <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          Your next move starts here.
        </h2>

        {/* Supporting Text */}
        <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-gray-400'
        }`}>
          Explore global markets through a modern trading experience designed around clarity, speed and control.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            type="button"
            id="final-cta-open-account-btn"
            onClick={onOpenAccount}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            <span>Open Account</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <button
            type="button"
            id="final-cta-explore-markets-btn"
            onClick={onExploreMarkets}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg transition-all active:scale-[0.98] border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-[#151921] hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <span>Explore Markets</span>
            <ArrowUpRight className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Assurance Line */}
        <div className={`flex flex-wrap items-center justify-center gap-6 text-xs font-mono ${
          isLight ? 'text-slate-500' : 'text-gray-500'
        }`}>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-green-400'}`} /> Multi-Factor Safeguards
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} /> Low Latency Execution
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`} /> Multi-Asset Routing
          </span>
        </div>

      </div>
    </section>
  );
};
