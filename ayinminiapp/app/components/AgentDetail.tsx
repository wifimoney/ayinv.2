"use client";
import { AgentReputation, AGENT_TYPES } from "../lib/contracts";
import {
  truncateAddress,
  scoreColor,
  scoreTier,
  formatPercent,
  formatNumber,
  formatTimeAgo,
} from "../lib/utils";
import { ScoreRing } from "./ScoreRing";

export function AgentDetail({
  agent,
  onBack,
}: {
  agent: AgentReputation;
  onBack: () => void;
}) {
  const color = scoreColor(agent.score);
  const _tier = scoreTier(agent.score);

  const metrics = [
    { label: "Win Rate", value: formatPercent(agent.winRate) },
    { label: "Sharpe Ratio", value: formatNumber(agent.sharpeRatio) },
    { label: "Max Drawdown", value: formatPercent(agent.maxDrawdown) },
    { label: "Total Trades", value: agent.totalTrades.toString() },
    {
      label: "Mandates Done",
      value: agent.mandatesCompleted.toString(),
    },
    {
      label: "Mandates Revoked",
      value: agent.mandatesRevoked.toString(),
    },
  ];

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.8rem",
          cursor: "pointer",
          padding: "0.25rem 0",
          marginBottom: "1rem",
          fontFamily: "inherit",
        }}
      >
        ← Back to Agents
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <ScoreRing score={agent.score} size={100} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-source-code-pro), monospace",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.25rem",
            }}
          >
            {truncateAddress(agent.address)}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <span
              style={{
                fontSize: "0.65rem",
                padding: "2px 8px",
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
            <span
              style={{
                fontSize: "0.65rem",
                padding: "2px 8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              ID #{agent.agentId}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.25rem",
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              padding: "0.75rem",
              background: "rgba(10,10,10,0.95)",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.2rem",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-source-code-pro), monospace",
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.25)",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Last active {formatTimeAgo(agent.lastActive)}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          style={{
            flex: 1,
            padding: "0.75rem",
            background: `${color}15`,
            border: `1px solid ${color}30`,
            borderRadius: "10px",
            color,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Create Mandate
        </button>
        <button
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ⋯
        </button>
      </div>
    </div>
  );
}
