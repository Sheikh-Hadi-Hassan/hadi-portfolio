"use client";

import Image from "next/image";
import { useState } from "react";
import { TextLink } from "@/components/story-ui";
import { toolMoves } from "@/lib/content";

export function ToolStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMove = toolMoves[activeIndex];

  return (
    <section className="tool-story" id="ai" aria-labelledby="tool-story-title">
      <header className="tool-story-intro">
        <p className="eyebrow">06.2 / Applied intelligence</p>
        <h2 id="tool-story-title">
          The stack changes.<br />
          <em>The judgment doesn’t.</em>
        </h2>
        <p>
          Five working modes. One connected practice—using AI to increase clarity,
          speed, and range without outsourcing responsibility.
        </p>
      </header>

      <div className="tool-console">
        <div className="tool-mode-list" role="tablist" aria-label="Working modes">
          {toolMoves.map((move, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              role="tab"
              id={`tool-tab-${index}`}
              aria-selected={index === activeIndex}
              aria-controls="tool-mode-panel"
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              key={move.name}
            >
              <span>{move.index}</span>
              <Image src={move.icon} width={28} height={28} alt="" aria-hidden="true" unoptimized />
              <strong>{move.name}</strong>
            </button>
          ))}
        </div>

        <div className="tool-mode-panel" id="tool-mode-panel" role="tabpanel" aria-labelledby={`tool-tab-${activeIndex}`} key={activeMove.name}>
          <p className="eyebrow">Mode {activeMove.index} / {activeMove.name}</p>
          <h3>{activeMove.outcome}</h3>
          <div className="primary-tools" aria-label={`Primary tools used to ${activeMove.name.toLowerCase()}`}>
            {activeMove.primary.map((tool) => <strong key={tool}>{tool}</strong>)}
          </div>
          <p className="supporting-tools"><span>Supporting stack</span>{activeMove.supporting.join(" · ")}</p>
          <TextLink href="/systems-lab" light>See the systems in progress</TextLink>
        </div>
      </div>

      <p className="tool-note">Selected working stack—not a certification wall. Tools support the practice; they do not replace it.</p>
    </section>
  );
}
