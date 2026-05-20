import { SiteShell } from "@/components/site-shell";
import { cryptoEducationArticle } from "@/lib/site-content";

export default function CryptoGuidePage() {
  return (
    <SiteShell>
      <div className="content-shell">
        <div className="section-heading">
          <p>Education</p>
          <h1>What is cryptocurrency?</h1>
          <span>
            A foundational guide for clients who want to understand the basics before using wallets,
            stablecoins, or blockchain-based services.
          </span>
        </div>
        <article className="prose-card">
          {cryptoEducationArticle
            .trim()
            .split("\n\n")
            .map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
        </article>
      </div>
    </SiteShell>
  );
}
