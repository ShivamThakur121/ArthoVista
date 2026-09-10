import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Official ArthoVista Brand Logo Component
 * 
 * Features:
 * - High-definition AV emblem with orange person apex, blue orbital swoosh, and green growth arrow
 * - Bold brand title: "Artho Vista"
 * - Hindi Tagline: "सपनों से समृद्धि तक"
 * - Theme variants: 'dark' (for dark navy headers/footers), 'light' (for light/white backgrounds), 'auto' (adapts to system theme)
 * - Size presets: 'sm', 'md', 'lg', 'xl'
 */
const Logo = ({
  variant = 'auto', // 'auto' | 'light' | 'dark'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = true,
  href = '/',
  className = '',
  onClick,
}) => {
  // Size mappings
  const sizeConfig = {
    sm: {
      icon: 'h-8 w-auto',
      title: 'text-base font-extrabold',
      tagline: 'text-[9px] tracking-wide font-bold -mt-0.5',
      gap: 'gap-2',
    },
    md: {
      icon: 'h-10 sm:h-11 w-auto',
      title: 'text-lg sm:text-xl font-black tracking-tight',
      tagline: 'text-[11px] sm:text-xs tracking-normal font-bold -mt-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'h-12 sm:h-14 w-auto',
      title: 'text-xl sm:text-2xl font-black tracking-tight',
      tagline: 'text-xs sm:text-sm tracking-normal font-bold -mt-0.5',
      gap: 'gap-3',
    },
    xl: {
      icon: 'h-16 sm:h-20 w-auto',
      title: 'text-2xl sm:text-3xl font-black tracking-tight',
      tagline: 'text-sm sm:text-base tracking-normal font-bold -mt-0.5',
      gap: 'gap-3.5',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Color mappings based on variant
  let titleColor = 'text-slate-900 dark:text-white';
  let taglineColor = 'text-emerald-600 dark:text-emerald-400';

  if (variant === 'dark') {
    titleColor = 'text-white';
    taglineColor = 'text-emerald-400';
  } else if (variant === 'light') {
    titleColor = 'text-slate-900';
    taglineColor = 'text-emerald-600';
  }

  const content = (
    <div className={`flex items-center ${currentSize.gap} group select-none ${className}`}>
      {/* Official AV Emblem Icon */}
      <img
        src="/logo-emblem.png"
        alt="Artho Vista Logo"
        className={`${currentSize.icon} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs`}
        onError={(e) => {
          // Fallback to logo-icon.png if needed
          e.currentTarget.src = '/logo-icon.png';
        }}
      />

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center leading-tight">
        <span className={`font-display ${currentSize.title} ${titleColor} transition-colors`}>
          Artho <span className={variant === 'dark' ? 'text-orange-400' : 'text-orange-500 dark:text-orange-400'}>Vista</span>
        </span>
        {showTagline && (
          <span className={`font-hindi ${currentSize.tagline} ${taglineColor} whitespace-nowrap`}>
            सपनों से समृद्धि तक
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} onClick={onClick} className="inline-flex items-center shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
