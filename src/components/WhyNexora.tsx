import React from 'react';
import { Globe2, BarChart3, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const WhyNexora: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const features = [
    {
      id: 'global-access',
      title: 'Global Access',
      description: 'Explore multiple asset classes from one unified platform with consolidated margin and global routing.',
      icon: Globe2,
      accent: '#38BDF8',
      metric: '120+ Pairs',
    },
    {
      id: 'intelligent-trading',
      title: 'Intelligent Trading',
      description: 'Powerful tools designed to help you analyze markets and manage positions with precision.',
      icon: BarChart3,
      accent: '#94A3B8',
      metric: 'Advanced Charting',
    },
    {
      id: 'real-time-experience',
      title: 'Real-Time Experience',
      description: 'Stay informed with market data and portfolio visibility driven by low-latency streaming infrastructure.',
      icon: Activity,
      accent: '#10B981',
      metric: 'Sub-Millisecond Feeds',
    },
    {
      id: 'security-first',
      title: 'Security First',
      description: 'Protect your account with modern security practices, transparent controls, and multi-layered authentication.',
      icon: ShieldCheck,
      accent: '#F8FAFC',
      metric: '2FA & Isolation',
    },
  ];

  return (
    <section
      id="features"
      className={`py-20 lg:py-28 border-t relative transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase block mb-3 font-mono">
            WHY NEXORA
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Built for the way modern markets move.
          </h2>
          <p className={`mt-4 text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            Engineered from the ground up for speed, reliability, and analytical clarity across volatile global financial environments.
          </p>
        </div>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={`feature-card-${feat.id}`}
                className={`group relative rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between border ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm'
                    : 'bg-[#151921] border-white/10 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-black/50'
                }`}
              >
                <div>
                  {/* Icon & Metric Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center border transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-blue-600 group-hover:border-blue-500/50'
                        : 'bg-black/40 border-white/10 text-white group-hover:border-blue-500/50'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded border ${
                      isLight
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-black/40 text-gray-400 border-white/5'
                    }`}>
                      {feat.metric}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className={`text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {feat.title}
                  </h3>

                  {/* Feature Description */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-gray-400'
                  }`}>
                    {feat.description}
                  </p>
                </div>

                {/* Subtle Card Footer Indicator */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono ${
                  isLight ? 'border-slate-100 text-slate-400' : 'border-white/5 text-gray-500'
                }`}>
                  <span>Institutional Standard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
