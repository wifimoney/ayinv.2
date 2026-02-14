"use client";
import { AgentReputation, AGENT_TYPES } from "../lib/contracts";
import {
  truncateAddress,
  scoreColor,
  formatTimeAgo,
  formatPercent,
  formatNumber,
} from "../lib/utils";
import { ScoreRing } from "./ScoreRing";

export function AgentCard({
  agent,
  rank,
  onSelect,
}: {
  agent: AgentReputation;
  rank: number;
  onSelect?: () => void;
}) {
  const color = scoreColor(agent.score);

  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: "0.875rem 1rem",
        background:
          rank === 1
            ? "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(0,0,0,0) 60%)"
            : "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        color: "inherit",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = `${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          rank === 1
            ? "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(0,0,0,0) 60%)"
            : "rgba(255,255,255,0.02)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 28,
          textAlign: "center",
          fontFamily: "var(--font-source-code-pro), monospace",
          fontSize: "0.75rem",
          color: rank <= 3 ? color : "rgba(255,255,255,0.3)",
          fontWeight: rank <= 3 ? 700 : 400,
        }}
      >
        #{rank}
      </div>

      {/* Score Ring */}
      <ScoreRing score={agent.score} size={52} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-source-code-pro), monospace",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {truncateAddress(agent.address)}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              padding: "1px 6px",
              background: `${color}15`,
              border: `1px solid ${color}30`,
              borderRadius: "4px",
              color,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {AGENT_TYPES[agent.agentId % 5] || "Agent"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span>Win {formatPercent(agent.winRate)}</span>
          <span>Sharpe {formatNumber(agent.sharpeRatio)}</span>
          <span>DD {formatPercent(agent.maxDrawdown)}</span>
        </div>
      </div>

      {/* Activity */}
      <div
        style={{
          textAlign: "right",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.25)",
          whiteSpace: "nowrap",
        }}
      >
        <div>{agent.totalTrades} trades</div>
        <div>{formatTimeAgo(agent.lastActive)}</div>
      </div>
    </button>
  );
}
