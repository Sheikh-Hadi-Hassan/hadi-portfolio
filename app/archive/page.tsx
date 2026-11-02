import type { Metadata } from "next";
import Link from "next/link";
import { portfolioGroups, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive | Hadi Hassan's Creative & Digital Work",
  description: "Browse documented brand, campaign, UI/UX, software, and digital projects by Hadi Hassan, with direct links to available case studies and source evidence.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  const count = projects.length + portfolioGroups.reduce((total, group) => total + group.projects.length, 0);
  return (
    <main className="paper" style={{ maxWidth: 1200, margin: "auto", padding: "clamp(2rem, 7vw, 7rem)" }}>
      <p className="eyebrow">Project directory / Archive</p>
      <h1>Work, beyond the highlights.</h1>
      <p>{count} documented entries across selected case studies and grouped project records. The archive distinguishes full stories from external references.</p>
      <p><Link href="/work">Explore the visual work collection →</Link></p>
      <section aria-labelledby="case-studies">
        <h2 id="case-studies">Detailed case studies</h2>
        <ul>{projects.map(project => <li key={project.slug}><Link href={`/work/${project.slug}`}>{project.title}</Link> · {project.category}</li>)}</ul>
      </section>
      {portfolioGroups.map(group => (
        <section key={group.id} aria-labelledby={group.id}>
          <h2 id={group.id}>{group.title}</h2>
          <p>{group.body}</p>
          <ul>{group.projects.map(project => (
            <li key={project.title}>
              <strong>{project.title}</strong> · {project.type}
              {project.links.length > 0 && <> · {project.links.map((link, index) => (
                <span key={link.href}>{index > 0 ? " / " : ""}{link.href.startsWith("/") ?
                  <Link href={link.href}>{link.label}</Link> :
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>}</span>
              ))}</>}
            </li>
          ))}</ul>
        </section>
      ))}
      <p><Link href="/resume">View resume →</Link> · <Link href="/contact">Discuss a project →</Link></p>
    </main>
  );
}
