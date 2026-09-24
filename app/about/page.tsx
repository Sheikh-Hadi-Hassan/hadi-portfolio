import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro, SectionHeading, TextLink } from "@/components/story-ui";

export const metadata: Metadata = {
  title: "About — From Creative Craft to Systems",
  description: "The story of Hadi Hassan’s progression from visual craft and brand identity into products, technology, Intellignce, and FLOW.",
  alternates: { canonical: "/about" },
};

const principles = [
  ["01", "Follow the real problem", "The medium should follow what the problem needs—not what is easiest to sell."],
  ["02", "Build across boundaries", "The strongest solutions often live between brand, product, technology, and business."],
  ["03", "Use AI deliberately", "Intelligence should improve judgment and capability—not replace responsibility."],
  ["04", "Make the work hold", "A good idea has to survive real people, real constraints, and the systems around it."],
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Hadi Hassan / Story" title="I didn’t set out to become multidisciplinary." body="I kept following the problem." accent="red" />
      <section className="about-opening paper">
        <div className="about-portrait"><Image src="/images/hadi-portrait-light.webp" width={900} height={1200} alt="Portrait of Hadi Hassan" priority unoptimized sizes="(max-width: 760px) 100vw, 42vw" /></div>
        <div className="about-story">
          <article><span>01</span><div><h2>Visual craft</h2><p>Branding, graphic design, photography, video, and campaign work taught me how ideas become visible—and how carefully made details create recognition and trust.</p></div></article>
          <article><span>02</span><div><h2>Digital experience</h2><p>Then static communication stopped being enough. I moved into UI/UX, websites, e-commerce, and digital products because I wanted the work to do something, not only say something.</p></div></article>
          <article><span>03</span><div><h2>Build & systems</h2><p>Product work led me deeper into development, architecture, data, and operational workflows. I learned that an interface is only the visible edge of a much larger system.</p></div></article>
          <article><span>04</span><div><h2>Founder</h2><p>Intellignce became the place where creative thinking, product, technology, business, and AI-assisted execution could work together.</p></div></article>
        </div>
      </section>
      <section className="about-turn dark"><p className="eyebrow">The current question</p><blockquote>Eventually the work led to a bigger question: what if a business could understand itself?</blockquote><TextLink href="/flow" light>That question became FLOW</TextLink></section>
      <section className="content-section paper principles-section">
        <SectionHeading eyebrow="Working principles" title="A practice with one center." />
        <div className="principle-grid">{principles.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>
      <section className="current-practice"><p className="eyebrow">Today</p><h2>I work where ideas change scale.</h2><p>Sometimes that begins with an identity. Sometimes it begins with a product problem. Sometimes it begins with a business that has outgrown the way it operates. The medium changes. The work is still about finding the clearest path from intention to reality.</p><TextLink href="/contact" light>Bring me the problem</TextLink></section>
    </>
  );
}
