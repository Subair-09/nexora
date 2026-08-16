import React from 'react';
import { Shield, Lock, Eye, Sliders, KeyRound, Server, AlertCircle } from 'lucide-react';
import { SECURITY_FEATURES } from '../data/marketData';
import { useTheme } from '../context/ThemeContext';

export const SecuritySection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const icons = [KeyRound, Lock, Eye, Sliders];

  return (
    <section
      id="security"
      className={`py-20 lg:py-28 border-t relative transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-blue-600 shadow-sm'
              : 'bg-[#151921] border-white/10 text-gray-400'
          }`}>
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase">
              PLATFORM RESILIENCE
            </span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Security is built into every interaction.
          </h2>

          <p className={`mt-4 text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            Our platform architecture is designed with layered defenses, proactive telemetry, and user-empowered security controls.
          </p>
        </div>

        {/* 4 Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECURITY_FEATURES.map((item, idx) => {
            const IconComponent = icons[idx] || Shield;
            return (
              <div
                key={item.id}
                id={`security-card-${item.id}`}
                className={`rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between border ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm'
                    : 'bg-[#151921] border-white/10 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-black/50'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 border ${
                    isLight
                      ? 'bg-blue-50 border-blue-100 text-blue-600'
                      : 'bg-black/40 border-white/10 text-blue-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    {item.tag}
                  </span>

                  <h3 className={`text-base font-bold mb-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t text-[11px] font-mono ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-gray-500'
                }`}>
                  Status: <span className={isLight ? 'text-emerald-600 font-semibold' : 'text-green-400 font-semibold'}>Active Protocols</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsible Compliance Notice Banner */}
        <div className={`mt-12 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5 text-xs border ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-600'
            : 'bg-[#151921] border-white/10 text-gray-400'
        }`}>
          <div className={`p-2 rounded flex-shrink-0 border ${
            isLight ? 'bg-white border-slate-200 text-blue-600' : 'bg-black/40 border-white/10 text-blue-400'
          }`}>
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className={`font-bold block sm:inline mr-1 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Architecture Overview:
            </span>
            <span>
              All authentication requests and session tokens are isolated with continuous telemetry. Account safeguards include optional hardware security keys, configurable IP whitelisting, and rate-limited API access keys.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
