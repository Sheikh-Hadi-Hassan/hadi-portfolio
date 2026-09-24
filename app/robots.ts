import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site/sitemap.xml" };
}
