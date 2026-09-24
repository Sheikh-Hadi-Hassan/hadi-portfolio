"use client";

import { useEffect, useRef, useState } from "react";

const SPLINE_SCENE = "https://my.spline.design/voiceinteractionanimation-68b6d956f45ffc73f4182cf259ad13b8/";

export function FlowAvatar() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [manualLoad, setManualLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fallback, setFallback] = useState<"checking" | "performance" | "webgl">("checking");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const probe = document.createElement("canvas");
    const webglAvailable = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
    const performanceFallback = Boolean(reduceMotion || coarsePointer || saveData || !webglAvailable);
    const fallbackFrame = window.requestAnimationFrame(() => {
      setFallback(!webglAvailable ? "webgl" : performanceFallback ? "performance" : "checking");
    });

    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!performanceFallback) setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: "320px" });
    observer.observe(frame);
    return () => {
      window.cancelAnimationFrame(fallbackFrame);
      observer.disconnect();
    };
  }, []);

  const shouldLoad = manualLoad || nearViewport;

  return (
    <div className="flow-avatar" ref={frameRef}>
      <div className="flow-avatar-meta" aria-hidden="true">
        <span>FLOW / VOICE SURFACE</span>
        <span>EXPERIENCE CONCEPT</span>
      </div>
      {shouldLoad ? (
        <>
          {!loaded ? <div className="flow-avatar-loading">Connecting the interface…</div> : null}
          <iframe
            className={`flow-avatar-frame${loaded ? " is-loaded" : ""}`}
            src={SPLINE_SCENE}
            title="Interactive FLOW voice avatar concept"
            loading="lazy"
            allow="autoplay; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <div className="flow-avatar-fallback">
          <div className="flow-avatar-orb" aria-hidden="true"><span /><span /><span /></div>
          <p>{fallback === "webgl" ? "This browser cannot render the live 3D surface. The lightweight voice state remains available." : fallback === "performance" ? "Interactive voice surface paused to protect motion, data, and mobile performance preferences." : "Preparing the interactive voice surface."}</p>
          {fallback === "performance" ? <button type="button" onClick={() => setManualLoad(true)}>Load the 3D concept</button> : null}
        </div>
      )}
    </div>
  );
}
