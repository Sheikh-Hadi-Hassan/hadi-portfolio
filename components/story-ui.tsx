import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { projects, type Accent, type Project } from "@/lib/content";

export function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p>; }

export function TextLink({ href, children, light = false, external = false }: { href: string; children: ReactNode; light?: boolean; external?: boolean }) {
  const className = `text-link${light ? " light" : ""}`;
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>;
  return <Link className={className} href={href}>{children} <span aria-hidden="true">→</span></Link>;
}

export function CtaLink({ href, children, secondary = false, external = false, down = false }: { href: string; children: ReactNode; secondary?: boolean; external?: boolean; down?: boolean }) {
  const className = `cta-button${secondary ? " secondary" : ""}`;
  const content = <>{children}{down ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</>;
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{content}</a>;
  return <Link className={className} href={href}>{content}</Link>;
}

export function PageIntro({ eyebrow, title, body, accent = "purple" }: { eyebrow: string; title: string; body: string; accent?: Accent }) {
  return (
    <section className={`page-intro accent-${accent}`}>
      <div className="page-intro-grid"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="page-lede">{body}</p></div>
      <div className="page-rule" aria-hidden="true" />
    </section>
  );
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className="section-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{body ? <p>{body}</p> : null}</div>;
}

export function ProjectIndex({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`project-index${compact ? " compact" : ""}`}>
      {projects.map((project) => (
        <Link className={`project-row accent-${project.accent}`} href={`/work/${project.slug}`} key={project.slug}>
          <span className="project-number">{project.index}</span>
          <span><strong>{project.title}</strong><small>{project.category}</small></span>
          {!compact ? <p>{project.summary}</p> : null}
          <span className="project-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}

export function ProjectShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`project-showcase${compact ? " compact" : ""}`} aria-label="Selected project stories">
      {projects.map((project) => (
        <Link className={`project-feature accent-${project.accent}`} href={`/work/${project.slug}`} key={project.slug}>
          <figure className={`project-feature-media media-${project.cover.presentation ?? "full"}`}>
            <Image
              src={project.cover.src}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              unoptimized
              sizes={compact ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 68vw"}
            />
            <figcaption><span>{project.index}</span>{project.cover.caption}</figcaption>
          </figure>
          <div className="project-feature-copy">
            <p className="eyebrow">{project.category}</p>
            <h3>{project.title}</h3>
            <p>{project.statement}</p>
            <span className="project-feature-action">Open the case <ArrowUpRight aria-hidden="true" /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function EvidenceFlag({ children }: { children: ReactNode }) {
  return <aside className="evidence-flag"><span aria-hidden="true" /><div><strong>Evidence state</strong><p>{children}</p></div></aside>;
}

export function CaseGallery({ project }: { project: Project }) {
  return (
    <div className={`case-gallery case-gallery-${project.slug}`}>
      {project.visuals.map((visual, index) => (
        <figure className={`case-visual visual-${visual.presentation ?? "full"}${index === 0 ? " lead-visual" : ""}`} key={visual.src}>
          <div className="case-visual-frame">
            <Image
              src={visual.src}
              width={visual.width}
              height={visual.height}
              alt={visual.alt}
              unoptimized
              sizes={index === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw"}
            />
          </div>
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{visual.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
