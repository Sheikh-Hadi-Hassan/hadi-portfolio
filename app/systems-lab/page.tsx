import type { Metadata } from "next";
import { EvidenceFlag, PageIntro, TextLink } from "@/components/story-ui";

export const metadata: Metadata = {
  title: "Systems Lab",
  description: "Questions, prototypes, working systems, and Hadi Hassan’s evolving AI and product toolkit.",
  alternates: { canonical: "/systems-lab" },
};

const experiments = [
  { index: "01", title: "Beta products", body: "Products designed, architected, and shipped during the Intellignce beta phase—from commerce and management tools to dashboards and operational platforms.", note: "No customer adoption or production-use claim is made without independent confirmation." },
  { index: "02", title: "AI-assisted creative systems", body: "Experiments in visual thinking, research, content, prototyping, and production—focused on repeatable capability rather than isolated outputs." },
  { index: "03", title: "Operational models", body: "Ways to make workflows, responsibilities, decisions, and business context visible enough to improve." },
  { index: "04", title: "FLOW primitives", body: "The trust, evidence, governance, and business-model building blocks behind an AI-first operating system for business." },
];

export default function SystemsLabPage() {
  return (
    <>
      <PageIntro eyebrow="Systems Lab / Open notebook" title="Questions. Prototypes. Working systems." body="A record of what I am testing across product, software, AI, creative workflows, and business operations. Not everything here is finished. That is the point." accent="cyan" />
      <section className="lab-list dark">
        {experiments.map((item) => <article key={item.index}><span>LAB / {item.index}</span><div><h2>{item.title}</h2><p>{item.body}</p>{item.note ? <EvidenceFlag>{item.note}</EvidenceFlag> : null}</div></article>)}
      </section>
      <section className="lab-method paper"><p className="eyebrow">Method</p><h2>Observe → model → make → test.</h2><div className="method-grid"><p><span>Observe</span>Find the friction, contradiction, or opportunity beneath the requested output.</p><p><span>Model</span>Make the relationships clear enough to reason about them.</p><p><span>Make</span>Build the smallest useful expression of the idea.</p><p><span>Test</span>Let reality reveal what the model missed.</p></div><TextLink href="/contact">Discuss a system problem</TextLink></section>
    </>
  );
}
