"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { profile, services } from "@/lib/content";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactBrief() {
  const [state, setState] = useState<SubmitState>("idle");
  const [status, setStatus] = useState("");

  async function sendBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("_honey") ?? "").trim()) return;

    data.set("_subject", "New portfolio project inquiry");
    data.set("_template", "table");
    data.set("_captcha", "false");
    data.set("source", window.location.href);

    setState("sending");
    setStatus("Sending your project brief securely…");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json() as { success?: boolean | string; message?: string };
      if (!response.ok || result.success === false || result.success === "false") throw new Error(result.message || "Submission failed");

      form.reset();
      setState("success");
      setStatus("Your brief has been delivered. Hadi will review the context and reply by email.");
      window.dispatchEvent(new Event("hadi:sound-success"));
    } catch {
      setState("error");
      setStatus("The brief could not be delivered. Please use the direct email link below so your lead is not lost.");
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <p className="eyebrow">Project brief received</p>
        <h2>Good context creates a better beginning.</h2>
        <p>{status}</p>
        <button type="button" className="button-primary" onClick={() => { setState("idle"); setStatus(""); }}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={sendBrief}>
      <input className="form-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-grid">
        <label><span>Your name *</span><input name="name" autoComplete="name" required /></label>
        <label><span>Work email *</span><input type="email" name="email" autoComplete="email" required /></label>
      </div>
      <div className="form-grid">
        <label><span>Company / brand</span><input name="company" autoComplete="organization" /></label>
        <label><span>Best starting point *</span>
          <select name="service" defaultValue="" required>
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option key={service.title}>{service.title}</option>)}
          </select>
        </label>
      </div>
      <div className="form-grid">
        <label><span>Project stage</span><select name="stage" defaultValue=""><option value="">Not sure yet</option><option>Early idea</option><option>Existing brand</option><option>Product in progress</option><option>Live system</option></select></label>
        <label><span>Indicative budget</span><select name="budget" defaultValue=""><option value="">Prefer to discuss</option><option>Under $2,500</option><option>$2,500–$7,500</option><option>$7,500–$20,000</option><option>$20,000+</option></select></label>
      </div>
      <label><span>What needs to become real? *</span><textarea name="brief" rows={6} minLength={20} placeholder="The problem, the opportunity, what already exists, and what success would look like…" required /></label>
      <label className="form-consent"><input type="checkbox" name="consent" value="Yes" required /><span>I agree that my details may be used to respond to this project inquiry.</span></label>
      <button className="button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending brief…" : "Submit project brief"} <ArrowRight aria-hidden="true" /></button>
      <p className={`form-status ${state === "error" ? "is-error" : ""}`} aria-live="polite">{status}</p>
      {state === "error" ? <a className="form-fallback" href={`mailto:${profile.email}`}>Email {profile.email} directly</a> : null}
      <p className="form-provider-note">Secure email delivery is handled by FormSubmit. The first live submission may require a one-time inbox confirmation before subsequent briefs are forwarded.</p>
    </form>
  );
}
