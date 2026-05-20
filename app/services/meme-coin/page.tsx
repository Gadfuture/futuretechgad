import { SiteShell } from "@/components/site-shell";

const offerings = [
  "Discovery calls to understand project goals, audience, and launch timing.",
  "Token structure planning, network guidance, and supply strategy discussions.",
  "Brand positioning support so the coin story, visuals, and messaging feel coherent.",
  "Deployment readiness support for teams working with developers, auditors, and launch partners.",
  "Post-launch operational guidance around communities, roadmaps, and client communication."
];

export default function MemeCoinServicesPage() {
  return (
    <SiteShell>
      <div className="content-shell">
        <div className="section-heading">
          <p>Services</p>
          <h1>Meme coin launch support</h1>
          <span>
            FUTURETECHGAD can position legitimate token projects with clear communication,
            launch-readiness planning, and professional presentation.
          </span>
        </div>
        <div className="grid-2">
          <article className="prose-card">
            <p>
              This service page is intentionally framed around lawful project support rather than
              hype. Teams exploring a meme coin idea often need help organizing the launch process:
              choosing a network, clarifying the story behind the brand, preparing for community
              questions, and coordinating the practical steps required before going live.
            </p>
            <p>
              FUTURETECHGAD can serve as a front-end partner for that process by helping the
              project look more polished and easier to understand. That includes planning materials
              for token utility explanations, public-facing content, onboarding copy, and the client
              request workflow needed to manage interest through a professional dashboard.
            </p>
            <p>
              The goal is not to overpromise. The goal is to make sure a legitimate token project
              launches with stronger messaging, better structure, and a smoother experience for the
              people who interact with it.
            </p>
          </article>
          <aside className="highlight-card">
            <h3>Typical support areas</h3>
            <div className="stack">
              {offerings.map((item) => (
                <div key={item} className="chip">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
