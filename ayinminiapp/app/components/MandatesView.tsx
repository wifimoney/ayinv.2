"use client";
import { truncateAddress } from "../lib/utils";

interface MandateDisplay {
  id: number;
  agentAddress: string;
  maxTradeSize: string;
  expiry: string;
  active: boolean;
}

const MOCK_MANDATES: MandateDisplay[] = [
  {
    id: 1,
    agentAddress: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    maxTradeSize: "0.5 ETH",
    expiry: "2026-03-15",
    active: true,
  },
  {
    id: 2,
    agentAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    maxTradeSize: "1.0 ETH",
    expiry: "2026-04-01",
    active: true,
  },
  {
    id: 3,
    agentAddress: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    maxTradeSize: "0.2 ETH",
    expiry: "2026-02-10",
    active: false,
  },
];

export function MandatesView() {
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
        Your Mandates
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {MOCK_MANDATES.map((mandate) => (
          <div
            key={mandate.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1rem",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${
                mandate.active
                  ? "rgba(0,255,136,0.1)"
                  : "rgba(255,255,255,0.04)"
              }`,
              borderRadius: "10px",
              opacity: mandate.active ? 1 : 0.5,
            }}
          >
            {/* Status dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: mandate.active ? "#00ff88" : "#ff3344",
                boxShadow: mandate.active
                  ? "0 0 6px rgba(0,255,136,0.4)"
                  : "none",
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-source-code-pro), monospace",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: "0.2rem",
                }}
              >
                {truncateAddress(mandate.agentAddress)}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Max {mandate.maxTradeSize} · Expires {mandate.expiry}
              </div>
            </div>

            {/* Revoke button */}
            {mandate.active && (
              <button
                style={{
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.65rem",
                  background: "rgba(255,51,68,0.08)",
                  border: "1px solid rgba(255,51,68,0.2)",
                  borderRadius: "6px",
                  color: "#ff3344",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty state note */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.2)",
          lineHeight: 1.6,
        }}
      >
        Mandates are enforced onchain.
        <br />
        Agents cannot exceed the limits you set.
      </div>
    </div>
  );
}
