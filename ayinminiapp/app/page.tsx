"use client";
import { useEffect, useState, useMemo } from "react";
import { useChainId } from "wagmi";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { AyinEye } from "./components/AyinEye";
import { NavTabs, Tab } from "./components/NavTabs";
import { StatBar } from "./components/StatBar";
import { AgentCard } from "./components/AgentCard";
import { AgentDetail } from "./components/AgentDetail";
import { RegisterForm } from "./components/RegisterForm";
import { MandatesView } from "./components/MandatesView";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AgentReputation, getChainConfig } from "./lib/contracts";
import { useAgents } from "./hooks/useAgents";

function Skeleton({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: "rgba(255,255,255,0.04)",
        borderRadius: "4px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
      }}
    >
      <Skeleton width="28px" height="16px" />
      <Skeleton width="52px" height="52px" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <Skeleton width="60%" height="14px" />
        <Skeleton width="80%" height="10px" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
        <Skeleton width="50px" height="10px" />
        <Skeleton width="40px" height="10px" />
      </div>
    </div>
  );
}

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [selectedAgent, setSelectedAgent] = useState<AgentReputation | null>(null);
  const chainId = useChainId();
  const chainConfig = getChainConfig(chainId);
  const isTestnet = chainId === 84532;

  const { agents, isLoading, totalAgents } = useAgents();

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  const sortedAgents = useMemo(
    () => [...agents].sort((a, b) => b.score - a.score),
    [agents]
  );

  const protocolStats = useMemo(
    () => [
      { label: "Agents", value: totalAgents.toString() },
      { label: "Avg Score", value: "\u2014" },
      { label: "Trades", value: "\u2014" },
      { label: "Mandates", value: "\u2014" },
    ],
    [totalAgents]
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
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AyinEye size={28} animated={true} />
          <div>
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
            <span
              style={{
                fontSize: "0.55rem",
                color: isTestnet ? "rgba(255,255,255,0.2)" : "#00ff88",
                marginLeft: "0.5rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {chainConfig.name}
            </span>
          </div>
        </div>
        <Wallet />
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "1rem", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
        <ErrorBoundary>
          {selectedAgent ? (
            <AgentDetail
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
            />
          ) : (
            <>
              {/* Protocol tagline */}
              <div style={{ textAlign: "center", padding: "1rem 0 0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.35rem",
                  }}
                >
                  Agent Oversight Protocol
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                    fontStyle: "italic",
                  }}
                >
                  Every agent has a record. Every mandate has a score.
                </div>
              </div>

              {/* Stats */}
              <StatBar stats={protocolStats} />

              {/* Navigation */}
              <div style={{ marginTop: "1rem" }}>
                <NavTabs active={activeTab} onChange={setActiveTab} />
              </div>

              {/* Tab content */}
              {activeTab === "leaderboard" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {isLoading ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : agents.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "2.5rem 1rem",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.8rem",
                      }}
                    >
                      <div style={{ marginBottom: "0.5rem" }}>
                        No agents registered yet. Be the first!
                      </div>
                      <button
                        onClick={() => setActiveTab("register")}
                        style={{
                          background: "rgba(0,255,136,0.1)",
                          border: "1px solid rgba(0,255,136,0.2)",
                          color: "#00ff88",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        Register Agent
                      </button>
                    </div>
                  ) : (
                    sortedAgents.map((agent, i) => (
                      <AgentCard
                        key={agent.agentId}
                        agent={agent}
                        rank={i + 1}
                        onSelect={() => setSelectedAgent(agent)}
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === "mandates" && <MandatesView />}

              {activeTab === "register" && <RegisterForm />}
            </>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.12)",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          letterSpacing: "0.05em",
        }}
      >
        AYIN · Built on Base · Integrated with OpenClaw
      </footer>
    </div>
  );
}
