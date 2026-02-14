// TODO: Gate with x402 payment verification when ready
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { baseSepolia } from "viem/chains";
import {
  CONTRACTS,
  AGENT_REGISTRY_ABI,
  AGENT_TYPES,
  DELEGATION_POLICY_ABI,
} from "../../../lib/contracts";

const client = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid address format", address },
      { status: 400 }
    );
  }

  try {
    const registered = await client.readContract({
      address: CONTRACTS.AgentRegistry as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: "isRegistered",
      args: [address as `0x${string}`],
    });

    if (!registered) {
      return NextResponse.json(
        { error: "Agent not registered", address },
        { status: 404 }
      );
    }

    const agent = (await client.readContract({
      address: CONTRACTS.AgentRegistry as `0x${string}`,
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

    // Get mandate count for this agent
    let mandateIds: bigint[] = [];
    try {
      mandateIds = (await client.readContract({
        address: CONTRACTS.DelegationPolicy as `0x${string}`,
        abi: DELEGATION_POLICY_ABI,
        functionName: "getMandatesByAgent",
        args: [agent.id],
      })) as bigint[];
    } catch {
      // Contract may not have mandates for this agent
    }

    // Count active mandates
    let activeMandates = 0;
    for (const mandateId of mandateIds) {
      try {
        const mandate = (await client.readContract({
          address: CONTRACTS.DelegationPolicy as `0x${string}`,
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

    return NextResponse.json({
      protocol: "ayin",
      version: "0.1.0",
      network: "base-sepolia",
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read contract data", details: String(error) },
      { status: 500 }
    );
  }
}
