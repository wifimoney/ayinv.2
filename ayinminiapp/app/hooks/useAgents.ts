"use client";
import { useReadContract, useReadContracts, useChainId } from "wagmi";
import {
  getContracts,
  AGENT_REGISTRY_ABI,
  AgentReputation,
} from "../lib/contracts";

export function useAgents() {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const registryConfig = {
    address: contracts.AgentRegistry as `0x${string}`,
    abi: AGENT_REGISTRY_ABI,
  } as const;

  const { data: count, isLoading: countLoading } = useReadContract({
    ...registryConfig,
    functionName: "agentCount",
  });

  const agentCount = Number(count ?? 0);
  const agentContracts = Array.from({ length: agentCount }, (_, i) => ({
    ...registryConfig,
    functionName: "getAgent" as const,
    args: [BigInt(i)] as const,
  }));

  const { data: agentResults, isLoading: agentsLoading } = useReadContracts({
    contracts: agentCount > 0 ? agentContracts : [],
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

  return {
    agents,
    isLoading,
    totalAgents: agentCount,
  };
}
