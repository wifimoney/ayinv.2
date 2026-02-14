// TODO: Gate with x402 payment verification when ready
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { base, baseSepolia } from "viem/chains";
import {
  getChainConfig,
  getContracts,
  AGENT_REGISTRY_ABI,
  AGENT_TYPES,
  DELEGATION_POLICY_ABI,
} from "../../../lib/contracts";
import { checkRateLimit } from "../../middleware/rateLimit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(0),
    });
  }

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
          ...corsHeaders(0),
        },
      }
    );
  }

  const { address } = await params;
  const url = new URL(request.url);
  const chainId = parseInt(url.searchParams.get("chain") || "8453");
  const config = getChainConfig(chainId);
  const contracts = getContracts(chainId);

  if (!isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid address format", address },
      { status: 400, headers: corsHeaders(remaining) }
    );
  }

  const client = createPublicClient({
    chain: chainId === 8453 ? base : baseSepolia,
    transport: http(config.rpc),
  });

  try {
    const registered = await client.readContract({
      address: contracts.AgentRegistry as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: "isRegistered",
      args: [address as `0x${string}`],
    });

    if (!registered) {
      return NextResponse.json(
        { error: "Agent not registered", address },
        { status: 404, headers: corsHeaders(remaining) }
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
      strategyHash: string;
      agentType: number;
      registeredAt: bigint;
      active: boolean;
    };

    let mandateIds: bigint[] = [];
    try {
      mandateIds = (await client.readContract({
        address: contracts.DelegationPolicy as `0x${string}`,
        abi: DELEGATION_POLICY_ABI,
        functionName: "getMandatesByAgent",
        args: [agent.id],
      })) as bigint[];
    } catch {
      // Contract may not have mandates for this agent
    }

    let activeMandates = 0;
    for (const mandateId of mandateIds) {
      try {
        const mandate = (await client.readContract({
          address: contracts.DelegationPolicy as `0x${string}`,
          abi: DELEGATION_POLICY_ABI,
          functionName: "getMandate",
          args: [mandateId],
        })) as { active: boolean };
        if (mandate.active) activeMandates++;
      } catch {
        // Skip invalid mandates
      }
    }

    const registeredAt = new Date(
      Number(agent.registeredAt) * 1000
    ).toISOString();

    return NextResponse.json(
      {
        protocol: "ayin",
        version: "0.3.0",
        network: chainId === 8453 ? "base" : "base-sepolia",
        chainId,
        agent: {
          id: Number(agent.id),
          operator: agent.operator,
          agentType: agent.agentType,
          agentTypeName: AGENT_TYPES[agent.agentType] || "Unknown",
          registeredAt,
          active: agent.active,
        },
        reputation: {
          score: 50,
          tier: "EMERGING",
          note: "Reputation scoring not yet live. Default score assigned.",
        },
        mandate_summary: {
          total: mandateIds.length,
          active: activeMandates,
        },
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders(remaining) }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read contract data", details: String(error) },
      { status: 500, headers: corsHeaders(remaining) }
    );
  }
}

function corsHeaders(remaining: number): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-PAYMENT",
    "X-RateLimit-Remaining": remaining.toString(),
    "Cache-Control": "public, max-age=30",
  };
}
