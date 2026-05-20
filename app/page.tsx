import Link from "next/link";
import { CoinOrbit } from "@/components/coin-orbit";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { coinSymbol, minimumWithdrawCoins, minerPlans, welcomeBonus } from "@/lib/futuretech";

const appFeatures = [
  {
    title: "Start with 1000 coins",
    copy: "Every new account receives a welcome balance after sign up so the first miner can start working immediately."
  },
  {
    title: "Buy miners",
    copy: "The first miner costs 50 coins and mines 10 coins per day. The maximum miner costs 1000 coins and mines 250 per day."
  },
  {
    title: "Withdraw or trade",
    copy: "Request a wallet withdrawal when the balance reaches 3000 coins, or keep using the balance in the coin trading panel."
  }
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-panel">
          <span className="eyebrow">Android-first crypto coin app</span>
          <h1>FUTURETECHGAD</h1>
          <p className="hero-copy">
            Sign in, receive {welcomeBonus} {coinSymbol}, activate miners, watch the countdown,
            trade your balance, and request crypto wallet withdrawals from one dark mobile-ready
            dashboard.
          </p>
          <div className="cta-row">
            <Link href="/auth/sign-up" className="button">
              Create Account
            </Link>
            <Link href="/auth/login" className="button secondary">
              Login
            </Link>
          </div>
          <div className="pill-row">
            <div className="chip">Welcome balance: {welcomeBonus} coins</div>
            <div className="chip">Minimum withdraw: {minimumWithdrawCoins} coins</div>
            <div className="chip">Wallet support: TRX, BNB, USDT</div>
          </div>
        </div>
        <CoinOrbit />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Mining System"
          title="A complete coin dashboard for web and Android."
          description="The app includes account login, miner purchasing, live balance accrual, trade actions, withdrawal requests, and mobile install support."
        />
        <div className="grid-3">
          {appFeatures.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="highlight-card">
          <SectionHeading
            eyebrow="Miner Prices"
            title="Upgrade from starter power to maximum daily output."
            description="Users can buy more miners as their balance grows. Mining accrues continuously and can be claimed from the account dashboard."
          />
          <div className="metric-row">
            {minerPlans.map((plan) => (
              <div key={plan.id} className="metric">
                <strong>{plan.cost}</strong>
                <p>
                  {plan.name}: {plan.dailyYield} coins per day
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
