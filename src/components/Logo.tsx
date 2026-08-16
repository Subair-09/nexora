import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const iconSizes = {
    sm: 'w-7 h-7 text-base',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
  };

  const textSizes = {
    sm: 'text-base tracking-tight',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
  };

  return (
    <div id="nexora-brand-logo" className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Technical Polygon Monogram */}
      <div
        className={`${iconSizes[size]} bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 transition-transform group-hover:scale-105`}
        style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        }}
      >
        N
      </div>

      {showText && (
        <span className={`font-bold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'} ${textSizes[size]}`}>
          NEXORA
        </span>
      )}
    </div>
  );
};


