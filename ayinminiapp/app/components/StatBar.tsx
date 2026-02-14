"use client";

export function StatBar({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "0.75rem 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "var(--font-source-code-pro), monospace",
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: "0.15rem",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
