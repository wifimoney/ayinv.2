"use client";
import { useReadContract, useReadContracts } from "wagmi";
import {
  CONTRACTS,
  AGENT_REGISTRY_ABI,
  AgentReputation,
  MOCK_AGENTS,
} from "../lib/contracts";

const registryConfig = {
  address: CONTRACTS.AgentRegistry as `0x${string}`,
  abi: AGENT_REGISTRY_ABI,
} as const;

export function useAgents() {
  const { data: count, isLoading: countLoading } = useReadContract({
    ...registryConfig,
    functionName: "agentCount",
  });

  const agentCount = Number(count ?? 0);
  const contracts = Array.from({ length: agentCount }, (_, i) => ({
    ...registryConfig,
    functionName: "getAgent" as const,
    args: [BigInt(i)] as const,
  }));

  const { data: agentResults, isLoading: agentsLoading } = useReadContracts({
    contracts: agentCount > 0 ? contracts : [],
  });

  const agents: AgentReputation[] = agentResults
    ? agentResults
        .filter((r) => r.status === "success" && r.result)
        .map((r) => {
          const a = r.result as {
            id: bigint;
            operator: string;
            strategyHash: string;
            agentType: number;
            registeredAt: bigint;
            active: boolean;
          };
          return {
            agentId: Number(a.id),
            address: a.operator,
            score: 50,
            winRate: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            totalTrades: 0,
            mandatesCompleted: 0,
            mandatesRevoked: 0,
            lastActive: Number(a.registeredAt) * 1000,
          };
        })
    : [];

  const isLoading = countLoading || agentsLoading;
  const useMock = !isLoading && agents.length === 0;

  return {
    agents: useMock ? MOCK_AGENTS : agents,
    isLoading,
    isMockData: useMock,
    totalAgents: useMock ? MOCK_AGENTS.length : agentCount,
  };
}
