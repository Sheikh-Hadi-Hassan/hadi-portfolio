import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageIntro, ProjectShowcase, SectionHeading } from "@/components/story-ui";
import { portfolioGroups, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work Archive — Brand, Product & Digital Systems",
  description: "A sourced archive of brand identities, digital products, commerce, software, campaigns, and websites by Hadi Hassan and Intellignce.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const total = projects.length + portfolioGroups.reduce((sum, group) => sum + group.projects.length, 0);

  return (
    <>
      <PageIntro eyebrow={`Work index / ${total} records`} title="Selected depth. Complete range." body="Five projects open into full case studies. The wider index preserves every named project found across Hadi’s supplied profile, the Intellignce profile, Behance, and verified project links—with evidence labels instead of inflated claims." accent="orange" />

      <nav className="work-directory paper" aria-label="Work categories">
        <p>Browse the evidence</p>
        <a href="#featured">Featured cases <span>{String(projects.length).padStart(2, "0")}</span></a>
        {portfolioGroups.map((group) => (
          <a href={`#${group.id}`} key={group.id}>{group.title} <span>{String(group.projects.length).padStart(2, "0")}</span></a>
        ))}
      </nav>

      <section id="featured" className="work-showcase paper">
        <div className="catalogue-heading dark">
          <SectionHeading eyebrow="Featured / full case studies" title="Five projects. Decisions exposed." body="These are the deepest stories in the archive: context, reasoning, documented visuals, and an honest evidence boundary." />
        </div>
        <ProjectShowcase />
      </section>

      {portfolioGroups.map((group) => (
        <section id={group.id} className="content-section dark catalogue-section" key={group.id}>
          <SectionHeading eyebrow={group.eyebrow} title={group.title} body={group.body} />
          <div className="catalogue-grid">
            {group.projects.map((project, index) => (
              <article className="catalogue-card" key={project.title}>
                <figure>
                  <Image src={project.image} width={900} height={600} alt={`${project.title} portfolio evidence`} unoptimized sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  <figcaption><span>{String(index + 1).padStart(2, "0")}</span><b>{project.evidence}</b></figcaption>
                </figure>
                <div className="catalogue-card-copy">
                  <p>{project.type}</p>
                  <h3>{project.title}</h3>
                  <div className="catalogue-links">
                    {project.links.length ? project.links.map((link) => link.href.startsWith("/") ? (
                      <Link href={link.href} key={link.href}>{link.label} <span aria-hidden="true">→</span></Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <span aria-hidden="true">↗</span></a>
                    )) : <span>Documented in supplied profile</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="work-proof-note paper">
        <p className="eyebrow">Evidence policy</p>
        <h2>A link proves a destination. A profile proves a historical record.</h2>
        <p>The archive does not imply that every current live screen is Hadi’s present-day design, or that every historical project has public performance data. Full authorship boundaries, results, and client approvals will be upgraded project by project as evidence is authorized.</p>
        <Link className="button button-dark" href="/contact">Ask about a project <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
