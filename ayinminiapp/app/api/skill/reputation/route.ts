import { createPublicClient, http, isAddress } from "viem";
import { base, baseSepolia } from "viem/chains";
import {
  getChainConfig,
  getContracts,
  AGENT_REGISTRY_ABI,
  AGENT_TYPES,
} from "../../../lib/contracts";
import { scoreTier } from "../../../lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const chainId = parseInt(url.searchParams.get("chain") || "8453");

  if (!address || !isAddress(address)) {
    return Response.json(
      { error: "Valid address required" },
      { status: 400 }
    );
  }

  const config = getChainConfig(chainId);
  const contracts = getContracts(chainId);

  const client = createPublicClient({
    chain: chainId === 8453 ? base : baseSepolia,
    transport: http(config.rpc),
  });

  try {
    const registered = (await client.readContract({
      address: contracts.AgentRegistry as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: "isRegistered",
      args: [address as `0x${string}`],
    })) as boolean;

    if (!registered) {
      return Response.json(
        {
          skill: "ayin.reputation",
          version: "0.3.0",
          agent: address,
          registered: false,
          score: 0,
          tier: "UNREGISTERED",
          recommendation: "NOT_REGISTERED",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const agent = (await client.readContract({
      address: contracts.AgentRegistry as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: "getAgentByOperator",
      args: [address as `0x${string}`],
    })) as {
      id: bigint;
      operator: string;
      agentType: number;
      registeredAt: bigint;
      active: boolean;
    };

    const score = 50;
    const tier = scoreTier(score);

    return Response.json(
      {
        skill: "ayin.reputation",
        version: "0.3.0",
        agent: address,
        registered: true,
        agentId: Number(agent.id),
        agentType: AGENT_TYPES[agent.agentType] || "Unknown",
        active: agent.active,
        score,
        tier,
        recommendation: score >= 55 ? "SAFE_TO_DELEGATE" : "EXERCISE_CAUTION",
        registeredAt: new Date(
          Number(agent.registeredAt) * 1000
        ).toISOString(),
        chainId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to query reputation", details: String(error) },
      { status: 500 }
    );
  }
}
