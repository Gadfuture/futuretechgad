import { Resend } from "resend";

type EmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail({ to, subject, html }: EmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SUPPORT_EMAIL ?? "support@futuretechgad.com";

  if (!apiKey) {
    return { sent: false, reason: "Missing RESEND_API_KEY" as const };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: `FUTURETECHGAD <${from}>`,
    to,
    subject,
    html
  });

  return { sent: true as const };
}
