export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function scoreColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#ffcc00";
  if (score >= 40) return "#ff8800";
  return "#ff3344";
}

export function scoreTier(score: number): string {
  if (score >= 90) return "ELITE";
  if (score >= 75) return "TRUSTED";
  if (score >= 55) return "EMERGING";
  if (score >= 35) return "CAUTIOUS";
  return "UNPROVEN";
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export function explorerUrl(
  chainId: number,
  hashOrAddress: string,
  type: "tx" | "address" = "tx"
): string {
  const explorer =
    chainId === 8453 ? "https://basescan.org" : "https://sepolia.basescan.org";
  return `${explorer}/${type}/${hashOrAddress}`;
}

export function explorerName(chainId: number): string {
  return chainId === 8453 ? "BaseScan" : "Sepolia BaseScan";
}
