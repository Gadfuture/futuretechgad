import { SiteShell } from "@/components/site-shell";

export default function GiveawayPage() {
  const tiktokUrl = process.env.TIKTOK_URL ?? "https://www.tiktok.com/@futuretechgad";
  const xUrl = process.env.X_URL ?? "https://x.com/futuretechgad";

  return (
    <SiteShell>
      <div className="content-shell">
        <div className="section-heading">
          <p>Promotion</p>
          <h1>FUTURETECHGAD social rewards</h1>
          <span>
            A dedicated social-growth page for visitors who want to support the brand and connect
            through official channels.
          </span>
        </div>
        <article className="prose-card">
          <p>
            FUTURETECHGAD can run social coin rewards for people who follow the brand on
            TikTok and X, then reach out through the official contact channels. This page is built
            to keep the process simple and professional. Visitors should follow the official social
            accounts, take a screenshot as proof if needed, and then contact FUTURETECHGAD through
            WhatsApp or email with their details. That lets the team verify the follow, respond
            directly, and guide the next step in a controlled way.
          </p>
          <p>
            Promotions like this can help a crypto brand grow awareness while also directing people
            into the main website where they can learn more about wallets, blockchains, stablecoins,
            and legitimate service offerings. The page should feel clean and credible, not noisy or
            spammy. That is why the design stays consistent with the rest of the site and keeps the
            call to action focused on official accounts and support channels.
          </p>
          <p>
            After following, visitors can use the dashboard or the contact page if they want a more
            direct relationship with the brand. This giveaway acts as a soft introduction to the
            broader FUTURETECHGAD ecosystem while keeping the instructions transparent.
          </p>
          <div className="cta-row">
            <a href={tiktokUrl} className="button" target="_blank" rel="noreferrer">
              Follow on TikTok
            </a>
            <a href={xUrl} className="button secondary" target="_blank" rel="noreferrer">
              Follow on X
            </a>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
