import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/content";
import { CtaLink } from "@/components/story-ui";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-invitation">
        <p className="eyebrow">Have an idea in motion?</p>
        <h2>Let’s make it clear, useful, and real.</h2>
        <div className="footer-actions">
          <CtaLink href="/contact">Start a project</CtaLink>
          <a className="text-link light" href={`mailto:${profile.email}`}>Email Hadi <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="footer-bottom">
        <Image className="signature" src="/images/signature.png" width={900} height={245} alt="Sheikh Hadi signature" unoptimized />
        <div className="footer-meta">
          <p>{profile.location} · Available for selected collaborations</p>
          <SocialLinks light />
          <div className="footer-utility"><a href={profile.intellignce} target="_blank" rel="noreferrer">Intellignce</a><Link href="/privacy">Privacy</Link></div>
          <p>© {new Date().getFullYear()} Hadi Hassan · <a href="https://www.streamlinehq.com/icons/pixel" target="_blank" rel="noreferrer">Streamline Pixel icons</a> via Iconify · CC BY 4.0</p>
        </div>
      </div>
    </footer>
  );
}
