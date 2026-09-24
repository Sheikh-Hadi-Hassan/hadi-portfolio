import type { Metadata } from "next";
import { EvidenceFlag, TextLink } from "@/components/story-ui";

export const metadata: Metadata = {
  title: "FLOW by Intellignce",
  description: "FLOW explores how a structured Business Twin, evidence, governance, and intelligence could help a business understand and operate itself.",
  alternates: { canonical: "/flow" },
};

const primitives = [
  ["01", "Business Twin", "A living model of the organization: its people, work, rules, resources, relationships, and history."],
  ["02", "Ask", "A way to question the business through structured context instead of a disconnected prompt."],
  ["03", "Proof", "Evidence that keeps answers grounded in what the organization can actually support."],
  ["04", "Guard", "Permissions, policies, and boundaries that determine what intelligence may see and do."],
  ["05", "Pulse", "Signals that reveal change, risk, and opportunity across the operating model."],
];

export default function FlowPage() {
  return (
    <article className="flow-page">
      <header className="flow-hero"><p className="eyebrow">FLOW by Intellignce / Developing product</p><h1>What if business<br />could understand<br />itself?</h1><p>FLOW explores an AI-first Business Operating System built around a living, evidence-grounded model of the organization it is helping.</p><a href="#premise" className="text-link light">Enter the premise <span aria-hidden="true">↓</span></a></header>
      <section className="flow-problem paper" id="premise"><div><p className="eyebrow">The problem</p><h2>A business already contains intelligence.</h2></div><p>But it is scattered across people, documents, meetings, tools, rules, transactions, and history. Most AI sees only the prompt in front of it.</p></section>
      <section className="flow-distinction"><p>FLOW begins by giving intelligence structured business context—what exists, how it relates, what can be trusted, and what actions are allowed.</p><blockquote>Not another chatbot.<br />A business model intelligence can reason with.</blockquote></section>
      <section className="flow-system paper"><p className="eyebrow">The operating model</p><h2>Context before intelligence. Trust before action.</h2><div className="primitive-grid">{primitives.map(([index, title, body]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
      <section className="flow-sequence dark"><p className="eyebrow">A simplified sequence</p><div><span>Observe</span><b>→</b><span>Model</span><b>→</b><span>Reason</span><b>→</b><span>Prove</span><b>→</b><span>Act</span></div></section>
      <section className="flow-state paper"><div><p className="eyebrow">Current state</p><h2>Trust primitives built. Commercial MVP productizing.</h2><p>FLOW is presented as a developing product and enterprise-intelligence vision. This portfolio separates what is real, what is being productized, and what remains ahead.</p></div><EvidenceFlag>This product-state language and every eventual product visual require Hadi’s final reconfirmation before public launch.</EvidenceFlag></section>
      <section className="flow-contact"><p className="eyebrow">The invitation</p><h2>Build the business context AI is missing.</h2><p>If you are exploring how intelligence could operate inside a real organization—with evidence, governance, and business context—I would like to hear the problem.</p><TextLink href="/contact" light>Discuss FLOW</TextLink></section>
    </article>
  );
}
