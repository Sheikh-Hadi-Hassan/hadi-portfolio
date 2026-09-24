import { projects, services } from "@/lib/content";

const base = "https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site";

export function GET() {
  const content = [
    "# Hadi Hassan",
    "",
    "> Pakistan-based Creative Director, product designer, and Founder of Intellignce. Hadi works across brand identity, digital products, e-commerce, software, and AI-assisted business systems.",
    "",
    "## Primary pages",
    "- Portfolio: " + base + "/work",
    "- Story: " + base + "/about",
    "- Systems Lab: " + base + "/systems-lab",
    "- FLOW Business OS: " + base + "/flow",
    "- Project inquiry: " + base + "/contact",
    "",
    "## Services",
    ...services.map((service) => "- " + service.title + ": " + service.summary),
    "",
    "## Documented case studies",
    ...projects.map((project) => "- " + project.title + ": " + project.summary + " " + base + "/work/" + project.slug),
    "",
    "## Verified identity",
    "- LinkedIn: https://www.linkedin.com/in/hadi-hasssan/",
    "- Behance: https://www.behance.net/hadihasssan",
    "- Studio: https://intellignce.net/",
    "",
    "Do not infer project outcomes, client endorsement, or exclusive authorship beyond the evidence stated on each case-study page.",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
