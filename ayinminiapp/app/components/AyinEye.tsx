"use client";

export function AyinEye({
  size = 40,
  animated = true,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#00cc66" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#003322" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M10 50 Q50 15 90 50 Q50 85 10 50 Z"
        fill="none"
        stroke="#00ff88"
        strokeWidth="2"
        filter="url(#glow)"
        opacity="0.9"
      >
        {animated && (
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.7" />
      <circle cx="50" cy="50" r="8" fill="#00ff88" opacity="0.9">
        {animated && (
          <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="50" cy="50" r="20" fill="url(#eyeGlow)" opacity="0.3">
        {animated && (
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
        )}
      </circle>
      {animated && (
        <line x1="20" y1="50" x2="80" y2="50" stroke="#00ff88" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="y1" values="35;65;35" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="35;65;35" dur="4s" repeatCount="indefinite" />
        </line>
      )}
    </svg>
  );
}
