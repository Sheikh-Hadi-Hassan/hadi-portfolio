import type { Metadata } from "next";
import { PageIntro } from "@/components/story-ui";

export const metadata: Metadata = { title: "Privacy", description: "Privacy information for the Hadi Hassan portfolio.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy / Plain language" title="A quiet website should be quiet with your data too." body="This core portfolio does not use advertising trackers, analytics cookies, or a server-side contact database." />
      <section className="legal-copy paper">
        <article><h2>Contact</h2><p>The project brief form sends the details you choose to share to Hadi’s email inbox. This website does not maintain its own contact database.</p></article>
        <article><h2>Project inquiries</h2><p>Form details are processed by FormSubmit solely to forward the inquiry to Hadi. Your email provider, Hadi’s email provider, and FormSubmit handle the message under their own policies. Do not include passwords, payment details, or other sensitive information.</p></article>
        <article><h2>External links</h2><p>Links to Behance, Intellignce, client sites, and other external services take you to websites with their own privacy practices.</p></article>
        <article><h2>Future changes</h2><p>If analytics, hosted forms, or other data-processing features are introduced later, this notice will be updated before those features are made public.</p></article>
        <p className="legal-date">Core review edition · August 2026</p>
      </section>
    </>
  );
}
