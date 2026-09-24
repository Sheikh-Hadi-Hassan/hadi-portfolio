import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site";
  const routes = ["", "/work", "/about", "/systems-lab", "/flow", "/contact", "/privacy"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })), ...projects.map(({ slug }) => ({ url: `${base}/work/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 }))];
}
