import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield, BarChart2, Globe, Lock, ChevronDown, Wallet } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useTrading } from '../context/TradingContext';

interface NavbarProps {
  onOpenAccount: () => void;
  onLogIn: () => void;
  onExploreMarkets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAccount, onLogIn, onExploreMarkets }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { balance } = useTrading();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Markets', href: '#markets', onClick: onExploreMarkets },
    { name: 'Trading', href: '#terminal' },
    { name: 'Assets', href: '#markets' },
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Company', href: '#stats' },
  ];

  const handleNavClick = (href: string, customClick?: () => void) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    if (customClick) {
      customClick();
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        id="nexora-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isLight
            ? isScrolled
              ? 'py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md shadow-slate-200/50'
              : 'py-4 bg-white/85 backdrop-blur-md border-b border-slate-100'
            : isScrolled
              ? 'py-3.5 bg-[#0A0E14]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
              : 'py-4 bg-[#0A0E14]/80 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo & Links */}
            <div className="flex items-center gap-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group focus:outline-none"
                aria-label="NEXORA Home"
              >
                <Logo size="md" />
              </a>

              {/* Desktop Nav Links */}
              <nav
                className={`hidden lg:flex items-center gap-6 text-sm font-medium transition-colors ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    id={`nav-link-${link.name.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href, link.onClick);
                    }}
                    className={`transition-colors ${
                      isLight
                        ? 'hover:text-blue-600'
                        : 'hover:text-white'
                    } ${
                      link.name === 'Trading'
                        ? isLight ? 'text-blue-600 font-semibold' : 'text-blue-400'
                        : ''
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Live Sandbox Balance Pill */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('terminal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                title="Click to trade or withdraw"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all active:scale-95 ${
                  isLight
                    ? 'bg-slate-100/90 hover:bg-slate-200 border-slate-200 text-slate-800'
                    : 'bg-[#151921] hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>Demo:</span>
                <span className="font-bold text-emerald-500">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              <button
                type="button"
                id="navbar-login-btn"
                onClick={onLogIn}
                className={`text-sm font-medium px-3.5 py-2 rounded-md transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="navbar-open-account-btn"
                onClick={onOpenAccount}
                className={`text-sm font-semibold px-5 py-2 rounded-md transition-all active:scale-[0.98] ${
                  isLight
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                    : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5'
                }`}
              >
                Open Account
              </button>
            </div>

            {/* Mobile Hamburger Button & Theme Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <ThemeToggle variant="compact" />
              <button
                type="button"
                id="navbar-open-account-mobile-btn"
                onClick={onOpenAccount}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isLight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                Open
              </button>
              <button
                type="button"
                id="navbar-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md focus:outline-none transition-colors border ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 bg-slate-100 border-slate-200'
                    : 'text-gray-400 hover:text-white bg-[#151921] border-white/10'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className={`fixed inset-0 top-[60px] z-40 backdrop-blur-xl border-b p-6 lg:hidden flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 ${
            isLight
              ? 'bg-white/95 border-slate-200'
              : 'bg-[#0A0E14]/95 border-white/10'
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className={`pb-3 border-b flex items-center justify-between ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <span className={`text-[11px] font-mono uppercase tracking-widest ${
                isLight ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Institutional Navigation
              </span>
              <ThemeToggle variant="pill" />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.onClick);
                }}
                className={`flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.name}</span>
                <ArrowUpRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
              </a>
            ))}
          </div>

          <div className={`mt-8 pt-6 border-t flex flex-col gap-3 ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <button
              type="button"
              id="drawer-login-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogIn();
              }}
              className={`w-full py-3 text-center text-sm font-semibold rounded-lg transition-colors border ${
                isLight
                  ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                  : 'text-gray-200 bg-[#151921] hover:bg-white/10 border-white/10'
              }`}
            >
              Log In to Portal
            </button>
            <button
              type="button"
              id="drawer-open-account-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAccount();
              }}
              className={`w-full py-3 text-center text-sm font-bold rounded-lg transition-colors shadow-sm ${
                isLight
                  ? 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-black bg-white hover:bg-gray-200'
              }`}
            >
              Open Account
            </button>
          </div>
        </div>
      )}
    </>
  );
};

