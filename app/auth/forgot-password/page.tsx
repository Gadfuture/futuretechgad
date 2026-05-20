import { forgotPasswordAction } from "@/app/auth/actions";
import { SiteShell } from "@/components/site-shell";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <SiteShell>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="section-heading">
            <p>Recovery</p>
            <h1>Reset your password</h1>
            <span>Enter your account email and we will send a secure reset link.</span>
          </div>
          {params.error ? <div className="notice">{params.error}</div> : null}
          <form action={forgotPasswordAction}>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <button type="submit">Send reset link</button>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}
