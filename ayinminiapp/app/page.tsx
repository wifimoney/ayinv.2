"use client";
import { useEffect, useState, useMemo } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { AyinEye } from "./components/AyinEye";
import { NavTabs, Tab } from "./components/NavTabs";
import { StatBar } from "./components/StatBar";
import { AgentCard } from "./components/AgentCard";
import { AgentDetail } from "./components/AgentDetail";
import { RegisterForm } from "./components/RegisterForm";
import { MandatesView } from "./components/MandatesView";
import { MOCK_AGENTS, AgentReputation } from "./lib/contracts";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [selectedAgent, setSelectedAgent] = useState<AgentReputation | null>(
    null
  );

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  const sortedAgents = useMemo(
    () => [...MOCK_AGENTS].sort((a, b) => b.score - a.score),
    []
  );

  const protocolStats = useMemo(
    () => [
      { label: "Agents", value: sortedAgents.length.toString() },
      {
        label: "Avg Score",
        value: Math.round(
          sortedAgents.reduce((s, a) => s + a.score, 0) / sortedAgents.length
        ).toString(),
      },
      {
        label: "Trades",
        value: sortedAgents
          .reduce((s, a) => s + a.totalTrades, 0)
          .toLocaleString(),
      },
      {
        label: "Mandates",
        value: sortedAgents
          .reduce((s, a) => s + a.mandatesCompleted, 0)
          .toString(),
      },
    ],
    [sortedAgents]
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
                color: "rgba(255,255,255,0.2)",
                marginLeft: "0.5rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Sepolia
            </span>
          </div>
        </div>
        <Wallet />
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "1rem", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
        {selectedAgent ? (
          <AgentDetail
            agent={selectedAgent}
            onBack={() => setSelectedAgent(null)}
          />
        ) : (
          <>
            {/* Protocol tagline */}
            <div
              style={{
                textAlign: "center",
                padding: "1rem 0 0.75rem",
              }}
            >
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                {sortedAgents.map((agent, i) => (
                  <AgentCard
                    key={agent.agentId}
                    agent={agent}
                    rank={i + 1}
                    onSelect={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
            )}

            {activeTab === "mandates" && <MandatesView />}

            {activeTab === "register" && <RegisterForm />}
          </>
        )}
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
        AYIN · Built on Base · Integrated with OpenClaw · 👁️
      </footer>
    </div>
  );
}
