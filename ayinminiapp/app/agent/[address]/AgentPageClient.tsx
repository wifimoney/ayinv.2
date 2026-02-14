"use client";
import { useEffect, useMemo } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import { AyinEye } from "../../components/AyinEye";
import { AgentDetail } from "../../components/AgentDetail";
import { useAgents } from "../../hooks/useAgents";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function AgentPageClient({ address }: { address: string }) {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const { agents, isLoading } = useAgents();

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  const agent = useMemo(
    () =>
      agents.find(
        (a) => a.address.toLowerCase() === address.toLowerCase()
      ),
    [agents, address]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <AyinEye size={28} animated={true} />
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.12em",
              color: "#00ff88",
            }}
          >
            AYIN
          </span>
        </div>
        <Wallet />
      </header>

      <main
        style={{
          flex: 1,
          padding: "1rem",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.8rem",
            }}
          >
            Loading agent data...
          </div>
        ) : agent ? (
          <AgentDetail
            agent={agent}
            onBack={() => {
              window.location.href = "/";
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              Agent not found
            </div>
            <div
              style={{
                fontFamily: "var(--font-source-code-pro), monospace",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.2)",
                marginBottom: "1.5rem",
              }}
            >
              {address.slice(0, 10)}...{address.slice(-8)}
            </div>
            <Link
              href="/"
              style={{
                background: "rgba(0,255,136,0.1)",
                border: "1px solid rgba(0,255,136,0.2)",
                color: "#00ff88",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
                textDecoration: "none",
              }}
            >
              Back to Leaderboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
