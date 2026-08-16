import React from 'react';
import { PLATFORM_STATS } from '../data/marketData';
import { useTheme } from '../context/ThemeContext';

export const StatsSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="stats"
      className={`py-16 lg:py-24 border-t relative transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Disclaimer Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 mb-10 border-b ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div>
            <span className="text-[10px] font-mono font-semibold tracking-widest text-blue-600 uppercase block">
              PLATFORM SPECIFICATIONS
            </span>
            <h3 className={`text-xl font-bold tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Infrastructure Benchmarks
            </h3>
          </div>
          <span className={`text-[11px] font-mono px-2.5 py-1 rounded border ${
            isLight
              ? 'bg-white border-slate-200 text-slate-600 shadow-sm'
              : 'bg-[#151921] border-white/10 text-gray-500'
          }`}>
            Sample / Demo Targets for Prototype
          </span>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 transition-all duration-200 border ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm'
                  : 'bg-[#151921] border-white/10 hover:border-blue-500/40'
              }`}
            >
              <span className="text-[10px] font-mono font-semibold text-blue-600 uppercase tracking-wider block mb-2">
                {stat.badge}
              </span>

              <div className={`text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {stat.value}
              </div>

              <div className={`text-sm font-bold mb-1 ${
                isLight ? 'text-slate-800' : 'text-gray-200'
              }`}>
                {stat.label}
              </div>

              <p className={`text-xs leading-relaxed ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
