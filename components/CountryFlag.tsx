import React from 'react';
import * as FlagIcons from 'country-flag-icons/react/3x2';

export type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CountryFlagProps {
  flag?: string;
  title?: string;
  size?: FlagSize;
  className?: string;
}

const SIZE_CLASSES: Record<FlagSize, string> = {
  xs: 'w-4 h-[11px]',
  sm: 'w-5 h-[13px]',
  md: 'w-6 h-4',
  lg: 'w-8 h-[21px]',
  xl: 'w-11 h-[29px]',
};

export const flagEmojiToIso = (flag?: string): string | null => {
  if (!flag) return null;
  const trimmed = flag.trim();
  if (!trimmed) return null;

  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const codePoints = Array.from(trimmed)
    .map((ch) => ch.codePointAt(0))
    .filter((cp): cp is number => cp !== undefined && cp >= 0x1f1e6 && cp <= 0x1f1ff);

  if (codePoints.length >= 2) {
    return String.fromCharCode(
      codePoints[0] - 0x1f1e6 + 65,
      codePoints[1] - 0x1f1e6 + 65
    );
  }

  return null;
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  flag,
  title,
  size = 'md',
  className = '',
}) => {
  if (!flag) return null;

  const iso = flagEmojiToIso(flag);
  const candidate = iso
    ? (FlagIcons as unknown as Record<string, unknown>)[iso]
    : undefined;
  const FlagSvg =
    typeof candidate === 'function'
      ? (candidate as React.ComponentType<React.SVGProps<SVGSVGElement>>)
      : null;

  if (FlagSvg) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 shadow-xs leading-none select-none ${SIZE_CLASSES[size]} ${className}`}
        title={title || iso || undefined}
        role="img"
        aria-label={title || iso || 'Bandiera'}
      >
        <FlagSvg className="w-full h-full block" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 leading-none select-none ${className}`}
      title={title}
      role="img"
      aria-label={title || 'Icona'}
    >
      {flag}
    </span>
  );
};
