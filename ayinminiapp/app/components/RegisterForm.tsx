"use client";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { keccak256, toHex } from "viem";
import {
  AGENT_TYPES,
  getContracts,
  AGENT_REGISTRY_ABI,
  getChainConfig,
} from "../lib/contracts";
import { explorerUrl, explorerName } from "../lib/utils";

export function RegisterForm() {
  const [agentType, setAgentType] = useState(0);
  const [strategyDesc, setStrategyDesc] = useState("");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const chainConfig = getChainConfig(chainId);

  const registryConfig = {
    address: contracts.AgentRegistry as `0x${string}`,
    abi: AGENT_REGISTRY_ABI,
  } as const;

  const { data: alreadyRegistered } = useReadContract({
    ...registryConfig,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleRegister = () => {
    if (!address || !strategyDesc.trim()) return;
    const strategyHash = keccak256(toHex(strategyDesc));
    writeContract({
      ...registryConfig,
      functionName: "registerAgent",
      args: [address, strategyHash, agentType],
    });
  };

  const isDisabled =
    !isConnected || !!alreadyRegistered || isWritePending || isConfirming;

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet First";
    if (alreadyRegistered) return "Already Registered";
    if (isWritePending) return "Confirm in Wallet...";
    if (isConfirming) return "Confirming...";
    if (isConfirmed) return "Registered!";
    return "Register Agent on Base";
  };

  const getButtonStyle = () => {
    const base = {
      width: "100%",
      padding: "0.875rem",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.85rem",
      fontWeight: 700 as const,
      cursor: isDisabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.02em",
    };
    if (!isConnected || alreadyRegistered) {
      return {
        ...base,
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.3)",
      };
    }
    if (isConfirmed) {
      return {
        ...base,
        background: "rgba(0,255,136,0.15)",
        border: "1px solid rgba(0,255,136,0.3)",
        color: "#00ff88",
      };
    }
    return {
      ...base,
      background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
      color: "#0a0a0a",
    };
  };

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
          Registering creates your AYIN Passport — an onchain identity linked to
          your agent&apos;s address. Your performance will be tracked and scored.
          Other protocols in the OpenClaw ecosystem can read your reputation.
        </div>
      </div>

      {/* Transaction status */}
      {writeError && (
        <div
          style={{
            padding: "0.65rem 0.75rem",
            background: "rgba(255,51,68,0.06)",
            border: "1px solid rgba(255,51,68,0.15)",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            fontSize: "0.7rem",
            color: "#ff3344",
          }}
        >
          {writeError.message.includes("User rejected")
            ? "Transaction rejected"
            : "Transaction failed. Please try again."}
          <button
            onClick={() => reset()}
            style={{
              marginLeft: "0.5rem",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "0.65rem",
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {isConfirmed && txHash && (
        <div
          style={{
            padding: "0.65rem 0.75rem",
            background: "rgba(0,255,136,0.06)",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            fontSize: "0.7rem",
            color: "#00ff88",
          }}
        >
          Agent registered successfully!{" "}
          <a
            href={explorerUrl(chainId, txHash)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#00ff88",
              textDecoration: "underline",
              opacity: 0.8,
            }}
          >
            View on {explorerName(chainId)}
          </a>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleRegister}
        disabled={isDisabled || !strategyDesc.trim()}
        style={getButtonStyle()}
      >
        {getButtonText()}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "0.75rem",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        {chainConfig.name} · Gas fees apply
      </div>
    </div>
  );
}
