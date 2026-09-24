import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { FlowAvatar } from "@/components/flow-avatar";
import { PixelPortrait } from "@/components/pixel-portrait";
import { CtaLink } from "@/components/story-ui";
import { clientNames, profile, projects, services } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Hadi Hassan · Creative Director · Pakistan</p>
          <h1 id="home-title">Ideas into<br />brands, products<br />and <em>systems.</em></h1>
          <p className="hero-lede">I help ambitious founders turn complex ideas into identities, digital products, and intelligent businesses people can understand and use.</p>
          <div className="hero-actions">
            <CtaLink href="/contact">Start a project</CtaLink>
            <CtaLink href="/work" secondary>Explore work</CtaLink>
          </div>
          <div className="hero-trust">
            <span><b>10+</b> years across creative and technology</span>
            <span><b>44</b> sourced portfolio records</span>
          </div>
        </div>
        <PixelPortrait />
        <a className="hero-scroll" href="#services"><span>Discover the practice</span><ArrowDown aria-hidden="true" /></a>
      </section>

      <section className="service-selector paper" id="services">
        <header className="service-selector-head">
          <p className="eyebrow">Services / Choose the starting point</p>
          <h2>What needs to<br />become real?</h2>
          <div><p>One connected practice from first idea to working system. Start with the problem; the right disciplines follow.</p><CtaLink href="/contact">Discuss your project</CtaLink></div>
        </header>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-card-top">
                <span>{service.index}</span>
                <Image src={service.icon} width={36} height={36} alt="" aria-hidden="true" unoptimized />
              </div>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>{service.capabilities.map((capability) => <li key={capability}><Check aria-hidden="true" />{capability}</li>)}</ul>
              <Link href={service.featuredProject.href}>See {service.featuredProject.label}<ArrowUpRight aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="client-proof dark" aria-label="Selected clients and collaborators">
        <div className="client-proof-intro"><p className="eyebrow">Selected clients & collaborations</p><span>Across healthcare, commerce, technology, education, and professional services.</span></div>
        <div className="client-marquee">
          <div>
            {[...clientNames, ...clientNames].map((client, index) => <span key={client + "-" + index}><i aria-hidden="true" />{client}</span>)}
          </div>
        </div>
      </section>

      <section className="selected-work dark" id="selected-work">
        <header className="selected-work-head">
          <div><p className="eyebrow">Selected work / Depth before decoration</p><h2>Proof through decisions.</h2></div>
          <p>Five complete cases reveal the problem, thinking, system, and evidence behind the surface.</p>
          <CtaLink href="/work" secondary>View complete archive</CtaLink>
        </header>
        <div className="selected-work-grid">
          {projects.map((project, index) => (
            <Link className={"selected-work-card" + (index === 0 ? " lead" : "")} href={"/work/" + project.slug} key={project.slug}>
              <figure>
                <Image src={project.cover.src} width={project.cover.width} height={project.cover.height} alt={project.cover.alt} unoptimized sizes={index === 0 ? "(max-width: 760px) 100vw, 66vw" : "(max-width: 760px) 100vw, 33vw"} />
                <figcaption><span>{project.index}</span><small>{project.category}</small></figcaption>
              </figure>
              <div><h3>{project.title}</h3><span>Open case <ArrowUpRight aria-hidden="true" /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="practice-story paper">
        <div className="practice-statement">
          <p className="eyebrow">One connected practice</p>
          <h2>Not a menu of skills.<br />A way to move ideas forward.</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Make it understood.</strong><p>Strategy finds the idea worth building.</p></li>
          <li><span>02</span><strong>Make it recognizable.</strong><p>Identity creates memory and coherence.</p></li>
          <li><span>03</span><strong>Make it useful.</strong><p>Product and technology turn it into behavior.</p></li>
          <li><span>04</span><strong>Make it operate.</strong><p>Systems and AI help the business keep moving.</p></li>
        </ol>
      </section>

      <section className="flow-home" id="flow">
        <div className="flow-home-copy">
          <p className="eyebrow">Featured solution / FLOW by Intellignce</p>
          <h2>Your business should explain itself.</h2>
          <p>FLOW is an AI-native Business Operating System for service companies. Founders express outcomes; FLOW prepares, executes, tracks, and explains the operation.</p>
          <div className="flow-pillars">
            <span><b>Twin</b> understands the business</span>
            <span><b>Proof</b> grounds every answer</span>
            <span><b>Guard</b> controls every action</span>
          </div>
          <div className="hero-actions"><CtaLink href="/flow">Explore FLOW</CtaLink><CtaLink href="/contact" secondary>Discuss the system</CtaLink></div>
        </div>
        <FlowAvatar />
      </section>

      <section className="home-conversion paper">
        <div><p className="eyebrow">A clear next step</p><h2>Bring the ambition.<br />I’ll help structure it.</h2></div>
        <div><p>Share the idea, the friction, or the opportunity. You do not need a polished brief—only enough context to begin well.</p><CtaLink href="/contact">Start your project</CtaLink><a href={"mailto:" + profile.email}>{profile.email}</a></div>
      </section>
    </>
  );
}
