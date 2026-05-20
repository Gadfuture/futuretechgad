import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import {
  buyMinerAction,
  claimMiningAction,
  createWithdrawalAction,
  placeTradeAction
} from "@/app/dashboard/mining-actions";
import { SiteShell } from "@/components/site-shell";
import {
  calculatePendingCoins,
  coinSymbol,
  coinsPerUsd,
  minimumWithdrawCoins,
  minerPlans,
  nextClaimAt,
  tradeAssets
} from "@/lib/futuretech";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

type UserMiner = {
  id: string;
  plan_name: string;
  cost: number;
  daily_yield: number;
  last_claimed_at: string;
  status: "active" | "paused";
  created_at: string;
};

type WithdrawalRequest = {
  id: string;
  amount_coins: number;
  usd_value: number;
  network: string;
  wallet_address: string;
  status: "pending" | "approved" | "paid" | "rejected";
  created_at: string;
};

type TradeOrder = {
  id: string;
  asset: string;
  direction: "buy" | "sell";
  stake: number;
  pnl: number;
  status: string;
  created_at: string;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const { supabase, user, profile } = await requireUser();

  if (!profile) {
    redirect("/auth/login?error=Account profile not found. Run the SQL setup and sign in again.");
  }

  const [{ data: miners }, { data: withdrawals }, { data: trades }] = await Promise.all([
    supabase
      .from("user_miners")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("trade_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6)
  ]);

  const activeMiners = ((miners ?? []) as UserMiner[]).filter((miner) => miner.status === "active");
  const pendingCoins = calculatePendingCoins(activeMiners);
  const dailyYield = activeMiners.reduce((total, miner) => total + Number(miner.daily_yield), 0);
  const projectedBalance = Number(profile.coin_balance ?? 0) + pendingCoins;
  const claimDate = nextClaimAt(activeMiners);

  return (
    <SiteShell>
      <section className="dashboard-layout app-dashboard">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Android + Web Account</span>
            <h1>{profile.full_name ?? profile.email}</h1>
            <p>
              Mine FUTURETECHGAD coins, activate miners, trade internal coin markets, and request
              withdrawals to TRX, BNB, or USDT wallets.
            </p>
          </div>
          <form action={signOutAction}>
            <button type="submit" className="button secondary">
              Sign out
            </button>
          </form>
        </div>

        {params.error ? <div className="notice">{params.error}</div> : null}
        {params.message ? <div className="chip success">{params.message}</div> : null}

        <div className="stat-strip">
          <div>
            <span>Available balance</span>
            <strong>
              {projectedBalance.toFixed(2)} {coinSymbol}
            </strong>
          </div>
          <div>
            <span>Pending mining</span>
            <strong>{pendingCoins.toFixed(4)}</strong>
          </div>
          <div>
            <span>Daily mining power</span>
            <strong>{dailyYield} / day</strong>
          </div>
          <div>
            <span>Next full cycle</span>
            <strong>{claimDate ? formatDate(claimDate.toISOString()) : "Buy a miner"}</strong>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="stack">
            <div className="form-card app-panel">
              <h3>Mining countdown</h3>
              <p>
                Active miners add coins every second. Claim any time, or wait for the daily cycle to
                fill.
              </p>
              <div className="countdown-ring">
                <span>{activeMiners.length}</span>
                <p>active miners</p>
              </div>
              <form action={claimMiningAction}>
                <button type="submit">Claim mined coins</button>
              </form>
            </div>

            <div className="form-card">
              <h3>Withdraw</h3>
              <p>
                Minimum withdraw is {minimumWithdrawCoins} coins. Every {coinsPerUsd} coins creates
                a $1 payout request for admin processing.
              </p>
              <form action={createWithdrawalAction}>
                <div className="form-grid">
                  <label>
                    Amount
                    <input
                      type="number"
                      name="amount"
                      min={minimumWithdrawCoins}
                      step="1"
                      defaultValue={minimumWithdrawCoins}
                      required
                    />
                  </label>
                  <label>
                    Network
                    <select name="network" defaultValue="USDT">
                      <option value="USDT">USDT</option>
                      <option value="TRX">TRX</option>
                      <option value="BNB">BNB</option>
                    </select>
                  </label>
                </div>
                <label>
                  Wallet address
                  <input type="text" name="walletAddress" placeholder="Paste your payout wallet" required />
                </label>
                <button type="submit">Request withdraw</button>
              </form>
            </div>
          </div>

          <div className="stack">
            <div className="table-card">
              <h3>Miner shop</h3>
              <div className="miner-grid">
                {minerPlans.map((plan) => (
                  <article key={plan.id} className="miner-card">
                    <div>
                      <strong>{plan.name}</strong>
                      <p>{plan.power}</p>
                    </div>
                    <div className="miner-rate">
                      <span>{plan.cost} coins</span>
                      <b>{plan.dailyYield}/day</b>
                    </div>
                    <form action={buyMinerAction}>
                      <input type="hidden" name="planId" value={plan.id} />
                      <button type="submit" className="button secondary">
                        Buy miner
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            </div>

            <div className="table-card">
              <h3>Trade coins</h3>
              <p>Use your mined coins in fast internal markets when you do not want to withdraw.</p>
              <form action={placeTradeAction}>
                <div className="form-grid">
                  <label>
                    Asset
                    <select name="asset" defaultValue="BTC">
                      {tradeAssets.map((asset) => (
                        <option key={asset} value={asset}>
                          {asset}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Direction
                    <select name="direction" defaultValue="buy">
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                  </label>
                </div>
                <label>
                  Stake
                  <input type="number" name="stake" min="10" step="1" defaultValue="50" required />
                </label>
                <button type="submit">Place trade</button>
              </form>
            </div>
          </div>
        </div>

        <div className="history-grid">
          <div className="table-card">
            <h3>Recent miners</h3>
            <div className="request-list">
              {activeMiners.length ? (
                activeMiners.slice(0, 5).map((miner) => (
                  <div key={miner.id} className="table-row history-row">
                    <span>{miner.plan_name}</span>
                    <strong>{miner.daily_yield} coins/day</strong>
                  </div>
                ))
              ) : (
                <div className="chip">No miner yet. Start with the 50 coin miner.</div>
              )}
            </div>
          </div>
          <div className="table-card">
            <h3>Withdrawals</h3>
            <div className="request-list">
              {((withdrawals ?? []) as WithdrawalRequest[]).length ? (
                ((withdrawals ?? []) as WithdrawalRequest[]).map((withdrawal) => (
                  <div key={withdrawal.id} className="table-row history-row">
                    <span>
                      {withdrawal.amount_coins} coins to {withdrawal.network}
                    </span>
                    <strong>${Number(withdrawal.usd_value).toFixed(2)}</strong>
                  </div>
                ))
              ) : (
                <div className="chip">No withdrawal requests yet.</div>
              )}
            </div>
          </div>
          <div className="table-card">
            <h3>Trades</h3>
            <div className="request-list">
              {((trades ?? []) as TradeOrder[]).length ? (
                ((trades ?? []) as TradeOrder[]).map((trade) => (
                  <div key={trade.id} className="table-row history-row">
                    <span>
                      {trade.direction.toUpperCase()} {trade.asset} with {trade.stake}
                    </span>
                    <strong>{Number(trade.pnl).toFixed(2)}</strong>
                  </div>
                ))
              ) : (
                <div className="chip">No trades yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
