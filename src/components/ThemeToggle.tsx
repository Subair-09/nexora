import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'pill' | 'compact';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        id="theme-toggle-pill"
        onClick={toggleTheme}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
          isLight
            ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
            : 'bg-[#151921] text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
        } ${className}`}
      >
        <span className="relative flex items-center justify-center w-4 h-4">
          {isLight ? (
            <Sun className="w-3.5 h-3.5 text-amber-500 animate-in spin-in-180 duration-200" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-blue-400 animate-in spin-in-180 duration-200" />
          )}
        </span>
        <span className="font-medium">{isLight ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        id="theme-toggle-compact"
        onClick={toggleTheme}
        title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        className={`p-1.5 rounded-md transition-all border ${
          isLight
            ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            : 'bg-[#151921] text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
        } ${className}`}
      >
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-blue-400" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={`relative inline-flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-mono transition-all border ${
        isLight
          ? 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 shadow-sm'
          : 'bg-[#151921] text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-blue-400 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium">
          {isLight ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
