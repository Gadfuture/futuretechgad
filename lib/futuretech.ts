export const coinName = "Mined Coin";
export const coinSymbol = "FTG";
export const welcomeBonus = 1000;
export const minimumWithdrawCoins = 3000;
export const usdPerWithdrawUnit = 1;
export const coinsPerUsd = 3000;

export type MinerPlan = {
  id: string;
  name: string;
  cost: number;
  dailyYield: number;
  power: string;
};

export const minerPlans: MinerPlan[] = [
  { id: "starter-50", name: "Starter Miner", cost: 50, dailyYield: 10, power: "Nano hash" },
  { id: "core-150", name: "Core Miner", cost: 150, dailyYield: 35, power: "Edge hash" },
  { id: "turbo-400", name: "Turbo Miner", cost: 400, dailyYield: 100, power: "Cloud hash" },
  { id: "max-1000", name: "Maximum Miner", cost: 1000, dailyYield: 250, power: "Fusion hash" }
];

export const tradeAssets = ["BTC", "USDT", "LTC", "BNB", "ETH", "TRX"] as const;

export function getMinerPlan(planId: string) {
  return minerPlans.find((plan) => plan.id === planId);
}

export function calculatePendingCoins(
  miners: Array<{ daily_yield: number; last_claimed_at: string }>
) {
  const now = Date.now();
  return miners.reduce((total, miner) => {
    const lastClaimed = new Date(miner.last_claimed_at).getTime();
    const elapsedSeconds = Math.max(0, (now - lastClaimed) / 1000);
    return total + (Number(miner.daily_yield) * elapsedSeconds) / 86400;
  }, 0);
}

export function nextClaimAt(miners: Array<{ last_claimed_at: string }>) {
  if (!miners.length) {
    return null;
  }

  return miners
    .map((miner) => new Date(new Date(miner.last_claimed_at).getTime() + 86400 * 1000))
    .sort((a, b) => a.getTime() - b.getTime())[0];
}
