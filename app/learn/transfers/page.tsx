import { SiteShell } from "@/components/site-shell";
import { transferEducationArticle } from "@/lib/site-content";

export default function TransferGuidePage() {
  return (
    <SiteShell>
      <div className="content-shell">
        <div className="section-heading">
          <p>Education</p>
          <h1>How blockchain transfers work</h1>
          <span>
            A plain-language explanation of networks, confirmations, fees, and the steps required
            for a real on-chain transfer.
          </span>
        </div>
        <article className="prose-card">
          {transferEducationArticle
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
