import Link from "next/link";
import { signInAction } from "@/app/auth/actions";
import { SiteShell } from "@/components/site-shell";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <SiteShell>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="section-heading">
            <p>Account Access</p>
            <h1>Login to FUTURETECHGAD</h1>
            <span>Open your miner dashboard, trade your coin balance, and request withdrawals.</span>
          </div>
          {params.error ? <div className="notice">{params.error}</div> : null}
          {params.message ? <div className="chip">{params.message}</div> : null}
          <form action={signInAction}>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" required />
            </label>
            <button type="submit">Login</button>
          </form>
          <p>
            New user?{" "}
            <Link href="/auth/sign-up" className="muted-link">
              Create an account
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link href="/auth/forgot-password" className="muted-link">
              Reset it
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
