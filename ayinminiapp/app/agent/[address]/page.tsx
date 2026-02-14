import { Metadata } from "next";

type Props = { params: Promise<{ address: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const ROOT_URL = process.env.NEXT_PUBLIC_URL || "https://ayin.app";
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const imageUrl = `${ROOT_URL}/api/og/agent/${address}`;

  return {
    title: `AYIN Agent: ${shortAddr}`,
    description: "View this agent's AYIN reputation score",
    openGraph: {
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "1",
        imageUrl,
        button: {
          title: "View Agent",
          action: {
            type: "launch_frame",
            name: "AYIN",
            url: `${ROOT_URL}/agent/${address}`,
            splashImageUrl: `${ROOT_URL}/splash.png`,
            splashBackgroundColor: "#060608",
          },
        },
      }),
    },
  };
}

import AgentPageClient from "./AgentPageClient";

export default async function AgentPage({ params }: Props) {
  const { address } = await params;
  return <AgentPageClient address={address} />;
}
