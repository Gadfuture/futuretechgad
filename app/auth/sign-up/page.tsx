import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";
import { SiteShell } from "@/components/site-shell";

type SignUpPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <SiteShell>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="section-heading">
            <p>Open Account</p>
            <h1>Create your mining account</h1>
            <span>
              Sign up, confirm your inbox, and receive 1000 FUTURETECHGAD coins in your dashboard.
            </span>
          </div>
          {params.error ? <div className="notice">{params.error}</div> : null}
          <form action={signUpAction}>
            <div className="form-grid">
              <label>
                Full name
                <input type="text" name="fullName" required />
              </label>
              <label>
                Referral or tag
                <input type="text" name="company" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Email
                <input type="email" name="email" required />
              </label>
              <label>
                WhatsApp or phone
                <input type="text" name="phone" />
              </label>
            </div>
            <label>
              Password
              <input type="password" name="password" minLength={8} required />
            </label>
            <button type="submit">Create account</button>
          </form>
          <p>
            Already registered?{" "}
            <Link href="/auth/login" className="muted-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
