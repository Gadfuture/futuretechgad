import { SiteShell } from "@/components/site-shell";

export default function ContactPage() {
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@futuretechgad.com";
  const supportWhatsApp = process.env.SUPPORT_WHATSAPP ?? "";
  const whatsappLink = supportWhatsApp
    ? `https://wa.me/${supportWhatsApp.replace(/\D/g, "")}`
    : "mailto:support@futuretechgad.com";

  return (
    <SiteShell>
      <div className="content-shell">
        <div className="section-heading">
          <p>Contact</p>
          <h1>Reach FUTURETECHGAD support</h1>
          <span>
            Ask about accounts, miners, trading, and pending withdrawal requests.
          </span>
        </div>
        <div className="grid-2">
          <article className="highlight-card">
            <h3>WhatsApp support</h3>
            <p>Primary contact: {supportWhatsApp || "Coming soon"}</p>
            <p>Use WhatsApp for quick communication and withdrawal follow-up.</p>
            <a className="button" href={whatsappLink}>
              Open WhatsApp
            </a>
          </article>
          <article className="highlight-card">
            <h3>Email support</h3>
            <p>Official inbox: {supportEmail}</p>
            <p>
              Email is ideal for account reviews, wallet correction requests, and business
              support.
            </p>
            <a className="button secondary" href={`mailto:${supportEmail}`}>
              Send Email
            </a>
          </article>
        </div>
      </div>
    </SiteShell>
  );
}
