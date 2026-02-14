"use client";
import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther } from "viem";
import { truncateAddress, explorerUrl, explorerName } from "../lib/utils";
import { useMandates } from "../hooks/useMandates";
import { getContracts, DELEGATION_POLICY_ABI } from "../lib/contracts";

const DURATION_OPTIONS = [
  { label: "7 days", seconds: 7 * 24 * 60 * 60 },
  { label: "30 days", seconds: 30 * 24 * 60 * 60 },
  { label: "90 days", seconds: 90 * 24 * 60 * 60 },
];

export function MandatesView() {
  const { mandates, isLoading, isConnected, refetch } = useMandates();
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const [showCreate, setShowCreate] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [maxTradeSize, setMaxTradeSize] = useState("");
  const [durationIdx, setDurationIdx] = useState(0);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const policyConfig = {
    address: contracts.DelegationPolicy as `0x${string}`,
    abi: DELEGATION_POLICY_ABI,
  } as const;

  // Revoke mandate
  const {
    writeContract: revokeWrite,
    data: revokeTxHash,
    isPending: revokeWritePending,
  } = useWriteContract();

  const { isLoading: revokeConfirming, isSuccess: revokeConfirmed } =
    useWaitForTransactionReceipt({
      hash: revokeTxHash,
    });

  if (revokeConfirmed && revokingId !== null) {
    refetch();
    setRevokingId(null);
  }

  const handleRevoke = (mandateId: number) => {
    setRevokingId(mandateId);
    revokeWrite({
      ...policyConfig,
      functionName: "revokeMandate",
      args: [BigInt(mandateId)],
    });
  };

  // Create mandate
  const {
    writeContract: createWrite,
    data: createTxHash,
    isPending: createWritePending,
    error: createError,
    reset: createReset,
  } = useWriteContract();

  const { isLoading: createConfirming, isSuccess: createConfirmed } =
    useWaitForTransactionReceipt({
      hash: createTxHash,
    });

  if (createConfirmed && showCreate) {
    refetch();
  }

  const handleCreate = () => {
    if (!agentId || !maxTradeSize) return;
    const expiryTimestamp = BigInt(
      Math.floor(Date.now() / 1000) + DURATION_OPTIONS[durationIdx].seconds
    );
    createWrite({
      ...policyConfig,
      functionName: "createMandate",
      args: [
        BigInt(agentId),
        parseEther(maxTradeSize),
        [contracts.PredictionMarket as `0x${string}`],
        expiryTimestamp,
      ],
    });
  };

  if (!isConnected) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Connect wallet to view mandates
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Your Mandates
        </div>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            createReset();
          }}
          style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.65rem",
            background: showCreate
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,255,136,0.08)",
            border: showCreate
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,255,136,0.2)",
            borderRadius: "6px",
            color: showCreate ? "rgba(255,255,255,0.4)" : "#00ff88",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          {showCreate ? "Cancel" : "+ Create Mandate"}
        </button>
      </div>

      {/* Create Mandate Form */}
      {showCreate && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(0,255,136,0.02)",
            border: "1px solid rgba(0,255,136,0.1)",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Agent ID
            </label>
            <input type="number" min="0" value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="0" style={{ width: "100%", padding: "0.55rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", fontFamily: "var(--font-source-code-pro), monospace", outline: "none" }} />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Max Trade Size (ETH)
            </label>
            <input type="number" step="0.01" min="0" value={maxTradeSize} onChange={(e) => setMaxTradeSize(e.target.value)} placeholder="0.5" style={{ width: "100%", padding: "0.55rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", fontFamily: "var(--font-source-code-pro), monospace", outline: "none" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Duration
            </label>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {DURATION_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => setDurationIdx(i)}
                  style={{
                    flex: 1, padding: "0.4rem", fontSize: "0.7rem", borderRadius: "6px",
                    border: durationIdx === i ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    background: durationIdx === i ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.02)",
                    color: durationIdx === i ? "#00ff88" : "rgba(255,255,255,0.4)",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
            Market: PredictionMarket ({truncateAddress(contracts.PredictionMarket)})
          </div>

          {createError && (
            <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255,51,68,0.06)", border: "1px solid rgba(255,51,68,0.15)", borderRadius: "6px", marginBottom: "0.75rem", fontSize: "0.65rem", color: "#ff3344" }}>
              {createError.message.includes("User rejected") ? "Transaction rejected" : "Failed to create mandate"}
            </div>
          )}

          {createConfirmed && createTxHash && (
            <div style={{ padding: "0.5rem 0.75rem", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "6px", marginBottom: "0.75rem", fontSize: "0.65rem", color: "#00ff88" }}>
              Mandate created!{" "}
              <a href={explorerUrl(chainId, createTxHash)} target="_blank" rel="noopener noreferrer" style={{ color: "#00ff88", textDecoration: "underline", opacity: 0.8 }}>
                View on {explorerName(chainId)}
              </a>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!agentId || !maxTradeSize || createWritePending || createConfirming}
            style={{
              width: "100%", padding: "0.7rem",
              background: !agentId || !maxTradeSize ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
              border: "none", borderRadius: "8px",
              color: !agentId || !maxTradeSize ? "rgba(255,255,255,0.3)" : "#0a0a0a",
              fontSize: "0.8rem", fontWeight: 600,
              cursor: !agentId || !maxTradeSize || createWritePending || createConfirming ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {createWritePending ? "Confirm in Wallet..." : createConfirming ? "Confirming..." : "Create Mandate"}
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: "60px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && mandates.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
          No mandates yet. Create one to delegate to an agent.
        </div>
      )}

      {/* Mandate list */}
      {!isLoading && mandates.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {mandates.map((mandate) => {
            const isRevoking = revokingId === mandate.id && (revokeWritePending || revokeConfirming);
            return (
              <div
                key={mandate.id}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem 1rem", background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${mandate.active ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: "10px", opacity: mandate.active ? 1 : 0.5,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: mandate.active ? "#00ff88" : "#ff3344", boxShadow: mandate.active ? "0 0 6px rgba(0,255,136,0.4)" : "none", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-source-code-pro), monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", marginBottom: "0.2rem" }}>
                    Agent #{mandate.agentId}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                    Max {mandate.maxTradeSize} · Expires {mandate.expiry}
                  </div>
                </div>
                {mandate.active && (
                  <button
                    onClick={() => handleRevoke(mandate.id)}
                    disabled={isRevoking}
                    style={{
                      padding: "0.35rem 0.65rem", fontSize: "0.65rem",
                      background: "rgba(255,51,68,0.08)", border: "1px solid rgba(255,51,68,0.2)",
                      borderRadius: "6px", color: "#ff3344",
                      cursor: isRevoking ? "not-allowed" : "pointer",
                      fontFamily: "inherit", fontWeight: 500, whiteSpace: "nowrap",
                      opacity: isRevoking ? 0.6 : 1,
                    }}
                  >
                    {isRevoking ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
        Mandates are enforced onchain.
        <br />
        Agents cannot exceed the limits you set.
      </div>
    </div>
  );
}
