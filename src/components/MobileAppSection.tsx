import React from 'react';
import { Smartphone, Apple, ShieldCheck, BellRing, Zap, ArrowUpRight, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MobileAppSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const highlights = [
    { title: 'Instant Price Alerts', desc: 'Custom volatility and price threshold push notifications.' },
    { title: 'Biometric Security', desc: 'Face ID and fingerprint authentication with localized keys.' },
    { title: 'Sub-Second Execution', desc: 'One-tap order routing optimized for low-latency mobile networks.' },
    { title: 'Synchronized Portfolio', desc: 'Seamless state parity between desktop terminal and mobile.' },
  ];

  return (
    <section
      id="mobile"
      className={`py-20 lg:py-28 border-t relative overflow-hidden transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase block mb-3 font-mono">
              MOBILE TRADING
            </span>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Markets in your pocket.
            </h2>

            <p className={`mt-4 text-base sm:text-lg leading-relaxed max-w-lg ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              Monitor your portfolio, explore markets and stay connected wherever you are with the NEXORA mobile companion.
            </p>

            {/* Feature List */}
            <div className="mt-8 space-y-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold leading-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs mt-0.5 ${
                      isLight ? 'text-slate-500' : 'text-gray-400'
                    }`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* iOS and Android Download Badges */}
            <div className={`mt-10 pt-6 border-t flex flex-wrap items-center gap-4 ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <button
                type="button"
                id="ios-download-btn"
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all shadow-sm group active:scale-[0.98] border ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-[#151921] hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <Apple className={`w-6 h-6 group-hover:scale-105 transition-transform ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`} />
                <div className="text-left">
                  <span className={`block text-[9px] uppercase tracking-wider font-mono ${
                    isLight ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    Download on the
                  </span>
                  <span className={`block text-xs font-bold leading-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Apple App Store
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="android-download-btn"
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all shadow-sm group active:scale-[0.98] border ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-[#151921] hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <svg className="w-5 h-5 text-blue-500 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a1.95 1.95 0 0 1-.22-.962V2.776c0-.36.08-.69.22-.962zM15.207 13.414l2.457 2.457-11.458 6.547 9.001-9.004zM15.207 10.586L6.206 1.582l11.458 6.547-2.457 2.457zm2.457-1.043l3.655 2.088c.907.518.907 1.366 0 1.884l-3.655 2.088-2.115-2.115 2.115-2.045z" />
                </svg>
                <div className="text-left">
                  <span className={`block text-[9px] uppercase tracking-wider font-mono ${
                    isLight ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    Get it on
                  </span>
                  <span className={`block text-xs font-bold leading-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Google Play
                  </span>
                </div>
              </button>
            </div>

            <span className={`text-[11px] mt-3 block font-mono ${
              isLight ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Compatible with iOS 16.0+ and Android 12.0+
            </span>
          </div>

          {/* Right Column: Smartphone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Phone Frame */}
              <div className={`relative border-[6px] rounded-[40px] shadow-2xl p-3.5 ring-1 ${
                isLight
                  ? 'bg-slate-900 border-slate-700 shadow-slate-300 ring-slate-800'
                  : 'bg-[#0A0E14] border-[#1E293B] shadow-black ring-white/10'
              }`}>
                
                {/* Speaker / Dynamic Island notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B] mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>

                {/* Inner Screen UI */}
                <div className="mt-6 rounded-[28px] bg-[#151921] border border-white/10 p-4 text-white overflow-hidden select-none">
                  
                  {/* Mobile App Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                        N
                      </div>
                      <span className="text-xs font-bold font-mono">NEXORA</span>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  {/* Account Summary in App */}
                  <div className="mt-4">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Total Portfolio</span>
                    <div className="text-2xl font-bold font-mono mt-0.5 text-white">
                      $124,850.32
                    </div>
                    <div className="text-[11px] font-semibold text-green-400 font-mono mt-0.5">
                      +$4,284.18 (+3.55%)
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="my-4 h-16 bg-black/40 rounded-lg p-2 flex items-center justify-center border border-white/5">
                    <svg viewBox="0 0 200 40" className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        points="0,35 25,32 50,34 75,20 100,24 125,12 150,15 175,6 200,4"
                      />
                    </svg>
                  </div>

                  {/* Fast Action Buttons in Mobile Screen */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <span className="block text-[9px] text-gray-400 font-mono">Quick Buy</span>
                      <span className="text-xs font-bold font-mono text-green-400">BTC $118,420</span>
                    </div>
                    <div className="p-2 bg-black/40 border border-white/10 rounded-lg text-center">
                      <span className="block text-[9px] text-gray-400 font-mono">Watchlist</span>
                      <span className="text-xs font-bold font-mono text-white">6 Active</span>
                    </div>
                  </div>

                  {/* Micro Watchlist in Mobile Screen */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <div>
                        <span className="font-bold text-white block">ETH/USD</span>
                        <span className="text-[9px] text-gray-500">Ethereum</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white block">$4,285.20</span>
                        <span className="text-[10px] text-green-400">+1.72%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <div>
                        <span className="font-bold text-white block">EUR/USD</span>
                        <span className="text-[9px] text-gray-500">Forex Major</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white block">1.1684</span>
                        <span className="text-[10px] text-green-400">+0.42%</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Bar inside Phone */}
                  <div className="mt-4 pt-2.5 border-t border-white/10 flex justify-around text-[9px] font-mono text-gray-500">
                    <span className="text-blue-400 font-bold">Trade</span>
                    <span>Markets</span>
                    <span>Wallets</span>
                    <span>Settings</span>
                  </div>

                </div>
              </div>

              {/* Decorative Subtle Ambient Behind Phone */}
              <div className="absolute -inset-4 bg-blue-600/5 blur-2xl rounded-full -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
