import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://hadi.intellignce.net").replace(/\/$/, "");
  const routes = ["", "/work", "/archive", "/resume", "/about", "/systems-lab", "/flow", "/contact", "/privacy"];
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...projects.map(({ slug }) => ({
      url: `${base}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
