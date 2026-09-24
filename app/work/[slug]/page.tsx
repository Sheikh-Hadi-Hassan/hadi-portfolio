import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseGallery, EvidenceFlag, TextLink } from "@/components/story-ui";
import { getProject, projects } from "@/lib/content";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const url = `https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site/work/${project.slug}`;
  const image = `https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site${project.cover.src}`;
  return {
    title: `${project.title} Case Study`,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { title: `${project.title} — Case Study by Hadi Hassan`, description: project.summary, url, type: "article", images: [{ url: image, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }] },
    twitter: { card: "summary_large_image", title: `${project.title} — Hadi Hassan`, description: project.summary, images: [image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];
  const projectUrl = `https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site/work/${project.slug}`;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: projectUrl,
    description: project.summary,
    image: `https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site${project.cover.src}`,
    genre: project.category,
    creator: { "@type": "Person", "@id": "https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site/#hadi-hassan", name: "Hadi Hassan" },
    sameAs: [project.sourceUrl, project.secondaryUrl].filter(Boolean),
  };

  return (
    <article className={`case-page accent-${project.accent}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <header className="case-hero">
        <div className="case-kicker"><span>Case {project.index}</span><span>{project.category}</span></div>
        <h1>{project.title}</h1>
        <p>{project.statement}</p>
        <div className="case-scroll">Read the decisions <span aria-hidden="true">↓</span></div>
      </header>

      {project.versionNote ? <aside className="version-note"><strong>Version note</strong><p>{project.versionNote}</p></aside> : null}

      <section className="case-narrative paper">
        <div className="case-side"><span>01</span><p>The context</p></div>
        <div className="case-copy"><h2>The challenge</h2><p className="case-lede">{project.challenge}</p><p>{project.response}</p></div>
      </section>

      {project.articleSections ? (
        <section className="case-article paper" aria-label={`${project.title} complete project story`}>
          {project.articleSections.map((section) => (
            <article key={section.eyebrow}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <div>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </article>
          ))}
        </section>
      ) : null}

      <section className="case-media dark">
        <div className="case-media-intro"><p className="eyebrow">Project evidence / selected artifacts</p><p>Every frame below comes from Hadi’s supplied portfolio, a published Behance case, or the verified live project noted in its caption.</p></div>
        <CaseGallery project={project} />
      </section>

      <section className="case-decisions paper">
        <div className="case-side"><span>02</span><p>The decisions</p></div>
        <div className="decision-list">
          {project.decisions.map((decision, index) => <article key={decision}><span>{String(index + 1).padStart(2, "0")}</span><p>{decision}</p></article>)}
        </div>
      </section>

      <section className="case-details dark">
        <div><p className="eyebrow">Role & scope</p><h2>Across the visible and the operational.</h2></div>
        <ul>{project.roles.map((role) => <li key={role}>{role}</li>)}</ul>
        <EvidenceFlag>{project.evidence}</EvidenceFlag>
        <div className="case-source-links">
          {project.sourceUrl ? <TextLink href={project.sourceUrl} external light>{project.sourceLabel}</TextLink> : null}
          {project.secondaryUrl ? <TextLink href={project.secondaryUrl} external light>{project.secondaryLabel}</TextLink> : null}
        </div>
      </section>

      <section className="draft-testimonial">
        <p className="eyebrow">Editorial testimonial draft · pending client authorization</p>
        <blockquote>“{project.draftTestimonial}”</blockquote>
        <p>This draft is not presented as an approved client quote. It remains clearly gated until the named client authorizes the wording and attribution.</p>
      </section>

      <a className={`next-case accent-${next.accent}`} href={`/work/${next.slug}`}><span>Next case / {next.index}</span><strong>{next.title}</strong><b aria-hidden="true">→</b></a>
    </article>
  );
}
