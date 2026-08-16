import React from 'react';
import { Quote, UserCheck } from 'lucide-react';
import { SAMPLE_TESTIMONIALS } from '../data/marketData';
import { useTheme } from '../context/ThemeContext';

export const TestimonialsSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="testimonials"
      className={`py-20 lg:py-28 border-t relative transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0E14] border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-3 ${
            isLight
              ? 'bg-white border-slate-200 text-blue-600 shadow-sm'
              : 'bg-[#151921] border-white/10 text-gray-400'
          }`}>
            <span className="text-[10px] font-mono font-semibold tracking-widest text-blue-600 uppercase">
              PROTOTYPE DEMONSTRATION PERSPECTIVES
            </span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Designed for institutional clarity.
          </h2>

          <p className={`mt-4 text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            Illustrative feedback reflecting user experience priorities across quantitative, institutional, and independent active traders.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 border ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm'
                  : 'bg-[#151921] border-white/10 hover:border-blue-500/40'
              }`}
            >
              <div>
                <Quote className={`w-6 h-6 mb-4 ${isLight ? 'text-blue-500/60' : 'text-blue-500/40'}`} />
                <p className={`text-sm sm:text-base leading-relaxed italic mb-6 ${
                  isLight ? 'text-slate-700' : 'text-gray-300'
                }`}>
                  "{t.quote}"
                </p>
              </div>

              <div className={`pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.author}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isLight
                      ? 'text-blue-700 bg-blue-50 border-blue-200'
                      : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  }`}>
                    Sample Profile
                  </span>
                </div>
                <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t.role}</div>
                <div className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{t.organization} • {t.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Tagline */}
        <div className={`mt-8 text-center text-[11px] font-mono ${
          isLight ? 'text-slate-400' : 'text-gray-600'
        }`}>
          * All profile names and quotes above are simulated sample data for prototype interface demonstration only.
        </div>

      </div>
    </section>
  );
};
