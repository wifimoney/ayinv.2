"use client";
import { ReactNode } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ACTIVE_CHAIN = IS_PRODUCTION ? base : baseSepolia;

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={ACTIVE_CHAIN}
      config={{
        appearance: { mode: "auto" },
        wallet: { display: "modal", preference: "all" },
      }}
      miniKit={{ enabled: true, autoConnect: true }}
    >
      {children}
    </OnchainKitProvider>
  );
}
