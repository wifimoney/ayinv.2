"use client";
import { useAccount, useReadContract, useReadContracts, useChainId } from "wagmi";
import { formatEther } from "viem";
import { getContracts, DELEGATION_POLICY_ABI } from "../lib/contracts";

export interface MandateData {
  id: number;
  delegator: string;
  agentId: number;
  maxTradeSize: string;
  maxTradeSizeWei: bigint;
  expiry: string;
  expiryTimestamp: number;
  active: boolean;
  createdAt: number;
}

export function useMandates() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const policyConfig = {
    address: contracts.DelegationPolicy as `0x${string}`,
    abi: DELEGATION_POLICY_ABI,
  } as const;

  const {
    data: mandateIds,
    isLoading: idsLoading,
    refetch: refetchIds,
  } = useReadContract({
    ...policyConfig,
    functionName: "getMandatesByDelegator",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const ids = (mandateIds as bigint[]) ?? [];
  const mandateContracts = ids.map((id) => ({
    ...policyConfig,
    functionName: "getMandate" as const,
    args: [id] as const,
  }));

  const {
    data: mandateResults,
    isLoading: mandatesLoading,
    refetch: refetchMandates,
  } = useReadContracts({
    contracts: ids.length > 0 ? mandateContracts : [],
  });

  const mandates: MandateData[] = mandateResults
    ? mandateResults
        .filter((r) => r.status === "success" && r.result)
        .map((r) => {
          const m = r.result as {
            id: bigint;
            delegator: string;
            agentId: bigint;
            maxTradeSize: bigint;
            expiry: bigint;
            active: boolean;
            createdAt: bigint;
          };
          const expiryDate = new Date(Number(m.expiry) * 1000);
          return {
            id: Number(m.id),
            delegator: m.delegator,
            agentId: Number(m.agentId),
            maxTradeSize: `${formatEther(m.maxTradeSize)} ETH`,
            maxTradeSizeWei: m.maxTradeSize,
            expiry: expiryDate.toISOString().split("T")[0],
            expiryTimestamp: Number(m.expiry),
            active: m.active,
            createdAt: Number(m.createdAt) * 1000,
          };
        })
    : [];

  const isLoading = idsLoading || mandatesLoading;

  const refetch = () => {
    refetchIds();
    refetchMandates();
  };

  return {
    mandates,
    isLoading,
    isConnected,
    address,
    mandateCount: ids.length,
    refetch,
  };
}
