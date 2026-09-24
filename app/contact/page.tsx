import type { Metadata } from "next";
import { ContactBrief } from "@/components/contact-brief";
import { PageIntro } from "@/components/story-ui";
import { profile } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Start a brand, product, technology, or systems conversation with Hadi Hassan.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact / Selected collaborations" title="Build what matters." body="Tell me what you are building, what is unclear, and what needs to become real." accent="green" />
      <section className="contact-layout paper">
        <div className="contact-aside">
          <p className="eyebrow">A useful first note</p><h2>Context makes a better beginning.</h2>
          <p>Share where the idea stands, what has already been tried, and what would make the work meaningful. A polished brief is not required.</p>
          <div className="direct-contact"><span>Prefer direct email?</span><a href={`mailto:${profile.email}`}>{profile.email}</a><p>Pakistan · Working with founders and brands</p></div>
        </div>
        <ContactBrief />
      </section>
      <section className="contact-next dark"><p className="eyebrow">What happens next</p><div><span>01</span><p>I review the context.</p></div><div><span>02</span><p>I identify the most useful starting point.</p></div><div><span>03</span><p>I reply with the questions needed to understand the opportunity properly.</p></div></section>
    </>
  );
}
