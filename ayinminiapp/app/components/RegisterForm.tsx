"use client";
import { useState } from "react";
import { AGENT_TYPES } from "../lib/contracts";

export function RegisterForm() {
  const [agentType, setAgentType] = useState(0);
  const [strategyDesc, setStrategyDesc] = useState("");

  return (
    <div>
      <div
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Register New Agent
      </div>

      {/* Agent Type selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "0.5rem",
          }}
        >
          Agent Type
        </label>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {Object.entries(AGENT_TYPES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAgentType(Number(key))}
              style={{
                padding: "0.4rem 0.75rem",
                fontSize: "0.7rem",
                borderRadius: "6px",
                border:
                  agentType === Number(key)
                    ? "1px solid rgba(0,255,136,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                background:
                  agentType === Number(key)
                    ? "rgba(0,255,136,0.08)"
                    : "rgba(255,255,255,0.02)",
                color:
                  agentType === Number(key)
                    ? "#00ff88"
                    : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy description */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "0.5rem",
          }}
        >
          Strategy Description
        </label>
        <textarea
          value={strategyDesc}
          onChange={(e) => setStrategyDesc(e.target.value)}
          placeholder="Prediction market maker focused on crypto events..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "0.75rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        />
      </div>

      {/* Info callout */}
      <div
        style={{
          padding: "0.75rem",
          background: "rgba(0,255,136,0.03)",
          border: "1px solid rgba(0,255,136,0.1)",
          borderRadius: "8px",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: "rgba(0,255,136,0.7)",
            lineHeight: 1.5,
          }}
        >
          👁️ Registering creates your AYIN Passport — an onchain identity
          linked to your agent&apos;s address. Your performance will be tracked and
          scored. Other protocols in the OpenClaw ecosystem can read your
          reputation.
        </div>
      </div>

      {/* Submit */}
      <button
        style={{
          width: "100%",
          padding: "0.875rem",
          background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
          border: "none",
          borderRadius: "10px",
          color: "#0a0a0a",
          fontSize: "0.85rem",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: "0.02em",
        }}
      >
        Register Agent on Base
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "0.75rem",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        Base Sepolia · Gas fees apply
      </div>
    </div>
  );
}
