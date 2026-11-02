import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume | Creative Direction, Brand Strategy & UI/UX",
  description: "Explore Hadi Hassan's experience in creative direction, brand identity, UI/UX design, digital products, and selected portfolio work.",
  alternates: { canonical: "/resume" },
};

const work = [
  ["Morganics", "/work/morganics", "Brand identity and packaging"],
  ["Accessorize by HL", "/archive", "Retail brand identity"],
  ["Edlytics", "/archive", "SaaS branding"],
  ["Bits HR Link", "/work/bits-hr-link", "Brand and digital design"],
  ["UI/UX Web & SaaS", "/archive", "Web and SaaS interfaces"],
  ["Consumer Connect", "/work/consumer-connect", "Creative direction"],
];

export default function ResumePage() {
  return <div className="paper" style={{padding:"clamp(2rem,7vw,7rem)",maxWidth:1200,margin:"auto"}}>
    <p className="eyebrow">Experience / Resume</p>
    <h1>Hadi Hassan</h1>
    <p>Senior Creative Designer · Brand Identity · Creative Direction</p>
    <p>Lahore, Pakistan · <a href="mailto:hadi@intellignce.net">hadi@intellignce.net</a></p>
    <p>10+ years of experience connecting business objectives to clear creative concepts, brand identities, campaigns, digital products, and visual storytelling.</p>
    <p><Link href="/work">Browse work archive →</Link> · <Link href="/contact">Contact →</Link> · <a href="https://www.behance.net/hadihasssan" target="_blank" rel="noopener noreferrer">Behance ↗</a></p>
    <h2>Core expertise</h2>
    <p>Brand strategy, visual identity, art direction, campaign design, UI/UX, product design, design systems, frontend development, motion graphics, and creative production.</p>
    <h2>Professional experience</h2>
    <ul>
      <li><strong>INTELLIGNCE · Founder</strong> (2022–present): Creative and digital project leadership across identity, websites, marketing, and digital experiences.</li>
      <li><strong>The Creative OAK · Founder</strong> (2019–2024): Brand identities, creative campaigns, and web projects.</li>
      <li><strong>Tecnomics · Senior Creative</strong> (2019–2024): Branding, marketing creative, and digital product/interface design.</li>
      <li><strong>Hadi E-Learning · Trainer</strong> (2024–2025): Video editing and creative workflows.</li>
      <li><strong>Wisdom Gateway Production & IslamicPulse · Video Production Manager</strong> (2018–2020): Motion graphics and storytelling.</li>
      <li><strong>The Landing Page Guy · UI Designer</strong> (2016–2019): Landing pages, usability, and interface design.</li>
    </ul>
    <h2>Selected projects and resources</h2>
    <ul>{work.map(([title,url,description])=><li key={title}><a href={url} {...(url.startsWith("https://")?{target:"_blank",rel:"noopener noreferrer"}:{})}>{title}</a> · {description}</li>)}</ul>
    <h2>Education</h2>
    <p>BS Information Technology, PUCIT (2018–2021). Diploma of Associate Engineering in IT (2014–2017).</p>
    <p><strong>PDF download:</strong> The verified resume PDF still needs to be uploaded to this site's public assets. This page does not present a nonworking download button.</p>
    <p><Link href="/archive">Explore the complete archive →</Link></p>
  </div>;
}
