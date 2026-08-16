import React from 'react';
import { Logo } from './Logo';
import { Shield, AlertTriangle, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenAccount: () => void;
  onExploreMarkets: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAccount, onExploreMarkets }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = {
    markets: [
      { name: 'Forex', href: '#markets' },
      { name: 'Crypto', href: '#markets' },
      { name: 'Commodities', href: '#markets' },
      { name: 'Indices', href: '#markets' },
      { name: 'Digital Assets', href: '#markets' },
    ],
    platform: [
      { name: 'Trading Terminal', href: '#terminal' },
      { name: 'Markets Overview', href: '#markets' },
      { name: 'Portfolio Analytics', href: '#hero' },
      { name: 'Security Architecture', href: '#security' },
      { name: 'Mobile Application', href: '#mobile' },
    ],
    company: [
      { name: 'About NEXORA', href: '#stats' },
      { name: 'Careers', href: '#stats' },
      { name: 'Contact Relations', href: '#stats' },
      { name: 'Help Center & Docs', href: '#stats' },
    ],
    legal: [
      { name: 'Terms of Service', href: '#legal' },
      { name: 'Privacy Policy', href: '#legal' },
      { name: 'Risk Disclosure', href: '#legal' },
      { name: 'Cookie Preferences', href: '#legal' },
    ],
  };

  return (
    <footer
      id="footer"
      className={`border-t pt-16 pb-12 text-xs transition-colors ${
        isLight
          ? 'bg-slate-900 border-slate-800 text-slate-400'
          : 'bg-[#05070A] border-white/5 text-gray-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand & Mission Column */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              NEXORA is a modern institutional-grade financial technology and trading platform interface prototype offering unified access across global asset classes.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational Status: Normal
              </span>
            </div>
          </div>

          {/* Markets Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Markets
            </h4>
            <ul className="space-y-2.5">
              {columns.markets.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onExploreMarkets();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {columns.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Company & Legal
            </h4>
            <ul className="space-y-2.5">
              {columns.company.concat(columns.legal).slice(0, 5).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Risk Warning & Disclosures */}
        <div className="py-8 border-b border-white/10 space-y-3">
          <div className="flex items-start gap-2.5 text-gray-400">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-[11px] leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-300">
                Trading involves risk. The value of investments can go up or down.
              </p>
              <p>
                Financial instruments, derivatives, forex, and digital assets carry a high level of risk and may not be suitable for all investors. You may lose some or all of your invested capital. You should ensure you fully understand the risks involved before trading.
              </p>
              <p>
                Disclaimer: This website is a technology and design landing page prototype for the fictional brand NEXORA. No real financial services, brokerage accounts, payment processing, or live trading executions are provided on this demonstration domain.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-mono">
          <div className="flex items-center gap-4">
            <span>NEXORA © 2026. All rights reserved.</span>
            <span>•</span>
            <span>Technical Grid UI Edition</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
