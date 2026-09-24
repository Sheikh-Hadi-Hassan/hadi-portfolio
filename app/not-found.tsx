import Link from "next/link";

export default function NotFound() {
  return <section className="not-found"><p className="eyebrow">404 / Off the path</p><h1>This part of the story isn’t here.</h1><p>The route may have moved, or the chapter may not be ready yet.</p><Link className="text-link light" href="/">Return to the beginning <span aria-hidden="true">←</span></Link></section>;
}
