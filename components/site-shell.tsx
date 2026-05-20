import Link from "next/link";
import { navigation } from "@/lib/site-content";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-frame">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <div>
            <strong>FUTURETECHGAD</strong>
            <p>Android-first mining and coin trading app</p>
          </div>
        </Link>
        <nav className="nav">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/auth/login" className="nav-cta">
            Login
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>
          <h3>FUTURETECHGAD</h3>
          <p>Mine coins, activate miners, trade balances, and request wallet withdrawals.</p>
        </div>
        <div>
          <p>Minimum withdraw: 3000 coins = $1 request</p>
          <p>Wallets: TRX, BNB, USDT</p>
        </div>
      </footer>
    </div>
  );
}
