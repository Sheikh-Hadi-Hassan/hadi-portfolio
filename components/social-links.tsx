import { Mail } from "lucide-react";
import { profile } from "@/lib/content";

type SocialLinksProps = {
  compact?: boolean;
  light?: boolean;
};

export function SocialLinks({ compact = false, light = false }: SocialLinksProps) {
  return (
    <div className={`social-links${compact ? " compact" : ""}${light ? " light" : ""}`} aria-label="Hadi Hassan on social media">
      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Hadi Hassan on LinkedIn">
        <span className="social-icon social-icon-linkedin" aria-hidden="true">in</span>
        {!compact ? <span>LinkedIn</span> : null}
      </a>
      <a href={profile.behance} target="_blank" rel="noreferrer" aria-label="Hadi Hassan on Behance">
        <span className="social-icon social-icon-behance" aria-hidden="true">B&#275;</span>
        {!compact ? <span>Behance</span> : null}
      </a>
      <a href={`mailto:${profile.email}`} aria-label={`Email Hadi Hassan at ${profile.email}`}>
        <span className="social-icon"><Mail aria-hidden="true" /></span>
        {!compact ? <span>Email</span> : null}
      </a>
    </div>
  );
}
