"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { services } from "@/lib/content";

const projectLinks = [
  { label: "Morganics", href: "/work/morganics", image: "/images/projects/morganics/05-packaging-system.webp" },
  { label: "Consumer Connect", href: "/work/consumer-connect", image: "/images/projects/consumer-connect/01-story-world.webp" },
  { label: "Bits HR Link", href: "/work/bits-hr-link", image: "/images/projects/bits-hr-link/01-brand-system.webp" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Hadi Hassan, home">
        HADI<span aria-hidden="true">.</span>
      </Link>

      <nav className="header-shortcuts" aria-label="Primary shortcuts">
        <Link href="/work">Work</Link>
        <a href="/#services">Services</a>
        <Link href="/flow">FLOW</Link>
      </nav>

      <div className="header-actions">
        <Link className="header-cta" href="/contact"><Mail aria-hidden="true" /> Start a project</Link>
        <div className={"mega-menu" + (menuOpen ? " is-open" : "")}>
          <button className="mega-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="portfolio-mega-menu" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span>Menu</span>
          </button>
          {menuOpen ? <div className="mega-menu-panel" id="portfolio-mega-menu" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
            <div className="mega-menu-topline">
              <p>Navigate the practice</p>
              <span>Brand · Product · Technology · Systems · AI</span>
            </div>

            <div className="mega-menu-grid">
              <section className="mega-services" aria-labelledby="mega-services-title">
                <p className="mega-label" id="mega-services-title">Services</p>
                <div>
                  {services.map((service) => (
                    <a href="/#services" key={service.title}>
                      <Image src={service.icon} width={22} height={22} alt="" aria-hidden="true" unoptimized />
                      <span><strong>{service.title}</strong><small>{service.capabilities.slice(0, 2).join(" · ")}</small></span>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </section>

              <section className="mega-projects" aria-labelledby="mega-projects-title">
                <p className="mega-label" id="mega-projects-title">Selected projects</p>
                <div>
                  {projectLinks.map((project) => (
                    <Link href={project.href} key={project.href}>
                      <figure><Image src={project.image} width={360} height={240} alt="" aria-hidden="true" unoptimized /></figure>
                      <span>{project.label}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <Link className="mega-all-work" href="/work">Explore all 44 records <span aria-hidden="true">→</span></Link>
              </section>

              <section className="mega-solutions" aria-labelledby="mega-solutions-title">
                <p className="mega-label" id="mega-solutions-title">Solutions & stories</p>
                <nav aria-label="Solutions">
                  <Link href="/flow"><span>01</span><strong>FLOW</strong><small>AI-native Business OS</small></Link>
                  <Link href="/systems-lab"><span>02</span><strong>Systems Lab</strong><small>Products and operating models</small></Link>
                  <Link href="/about"><span>03</span><strong>Hadi’s story</strong><small>From pixels to systems</small></Link>
                  <Link href="/work/intellignce"><span>04</span><strong>Intellignce</strong><small>The studio identity</small></Link>
                </nav>
                <Link className="mega-conversion" href="/contact">
                  <span>Have an ambitious problem?</span>
                  <strong>Let’s make it clear, useful, and real.</strong>
                  <b>Start a project <ArrowUpRight aria-hidden="true" /></b>
                </Link>
              </section>
            </div>

            <div className="mega-menu-footer">
              <span>Pakistan · Working globally</span>
              <div><a href="https://www.linkedin.com/in/hadi-hasssan/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.behance.net/hadihasssan" target="_blank" rel="noreferrer">Behance ↗</a></div>
            </div>
          </div> : null}
        </div>
      </div>
    </header>
  );
}
