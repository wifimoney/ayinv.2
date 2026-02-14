"use client";
import { scoreColor, scoreTier } from "../lib/utils";

export function ScoreRing({
  score,
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const color = scoreColor(score);
  const tier = scoreTier(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: size * 0.3,
            fontWeight: 700,
            color,
            fontFamily: "var(--font-source-code-pro), monospace",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: size * 0.1,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          {tier}
        </span>
      </div>
    </div>
  );
}
