import React from 'react';

interface BottleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function SlimBottleIcon({ className = 'size-12', ...props }: BottleIconProps) {
  return (
    <svg
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Bottle Cap */}
      <rect x="18" y="4" width="12" height="5" rx="1.5" fill="#55736f" />
      {/* Bottle Body */}
      <rect
        x="10"
        y="9"
        width="28"
        height="50"
        rx="5"
        fill="#e6f4f2"
        stroke="#1f3431"
        strokeWidth="2.5"
      />
      {/* Water level indicator line */}
      <path
        d="M12 24 C 18 22, 30 26, 36 24"
        stroke="#087f74"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {/* Water Body Fill */}
      <path
        d="M12 24 C 18 22, 30 26, 36 24 V 54 C 36 56.5 34 57 32 57 H 16 C 14 57 12 56.5 12 54 Z"
        fill="#087f74"
        fillOpacity="0.12"
      />
      {/* Dispenser Spigot / Tap */}
      <rect x="22" y="44" width="4" height="6" rx="1" fill="#1f3431" />
      <circle cx="24" cy="52" r="2.5" fill="#087f74" />
      <path d="M24 54.5 V 58" stroke="#1f3431" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function RoundBottleIcon({ className = 'size-12', ...props }: BottleIconProps) {
  return (
    <svg
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Cap */}
      <rect x="20" y="4" width="8" height="5" rx="1.5" fill="#55736f" />
      {/* Neck */}
      <path
        d="M19 9 H 29 V 15 C 29 17, 36 20, 37 25 V 52 C 37 56 34 58 30 58 H 18 C 14 58 11 56 11 52 V 25 C 12 20, 19 17, 19 15 Z"
        fill="#e6f4f2"
        stroke="#1f3431"
        strokeWidth="2.5"
      />
      {/* Ribbed lines */}
      <line x1="12" y1="32" x2="36" y2="32" stroke="#d2e2df" strokeWidth="2" />
      <line x1="12" y1="41" x2="36" y2="41" stroke="#d2e2df" strokeWidth="2" />
      {/* Water Fill */}
      <path
        d="M12 28 C 18 26, 30 30, 36 28 V 52 C 36 55 33 56.5 30 56.5 H 18 C 15 56.5 12 55 12 52 Z"
        fill="#087f74"
        fillOpacity="0.12"
      />
    </svg>
  );
}
