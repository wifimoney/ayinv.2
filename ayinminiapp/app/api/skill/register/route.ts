import { encodeFunctionData, keccak256, toHex } from "viem";
import { getContracts, AGENT_REGISTRY_ABI } from "../../../lib/contracts";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    operator,
    strategyDescription,
    agentType = 0,
    chain = 8453,
  } = body;

  if (!operator || !strategyDescription) {
    return Response.json(
      { error: "operator and strategyDescription required" },
      { status: 400 }
    );
  }

  const contracts = getContracts(chain);
  const strategyHash = keccak256(toHex(strategyDescription));

  const calldata = encodeFunctionData({
    abi: AGENT_REGISTRY_ABI,
    functionName: "registerAgent",
    args: [operator as `0x${string}`, strategyHash, agentType],
  });

  return Response.json(
    {
      skill: "ayin.register",
      version: "0.3.0",
      action: {
        to: contracts.AgentRegistry,
        data: calldata,
        value: "0",
        chain,
        description: `Register agent ${operator.slice(0, 10)}... in AYIN AgentRegistry`,
      },
      verification: {
        strategyHash,
        note: "Submit this transaction from the agent's operator wallet",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
