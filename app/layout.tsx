import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SoundDock } from "@/components/sound-dock";
import { services } from "@/lib/content";

const nebulica = localFont({
  src: "./fonts/nebulica-medium.woff",
  variable: "--font-nebulica",
  weight: "500",
  display: "swap",
});

const siteUrl = "https://hadi-hassan-portfolio.lbertoomenick4981.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Hadi Hassan — Creative Director & Founder of Intellignce", template: "%s — Hadi Hassan" },
  description: "Hadi Hassan is a Pakistan-based Creative Director, product designer, and Founder of Intellignce. Explore brand identity, digital product, e-commerce, SaaS, and AI business-system case studies.",
  keywords: ["Hadi Hassan", "Creative Director Pakistan", "Brand identity designer Pakistan", "Product designer Pakistan", "UI UX designer Lahore", "E-commerce designer and developer", "SaaS product designer", "Intellignce", "FLOW Business OS", "AI business systems", "Next.js developer Pakistan"],
  authors: [{ name: "Hadi Hassan", url: siteUrl }],
  creator: "Hadi Hassan",
  publisher: "Intellignce",
  category: "Design and Technology",
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: "Hadi Hassan — Ideas into Brands, Products & Systems", description: "Creative direction across brand identity, digital products, commerce, software, and AI business systems.", type: "profile", url: siteUrl, siteName: "Hadi Hassan", locale: "en_PK", firstName: "Hadi", lastName: "Hassan", images: [{ url: "/images/hadi-halftone-hero.webp", width: 2048, height: 1190, alt: "Hadi Hassan, Creative Director and Founder of Intellignce" }] },
  twitter: { card: "summary_large_image", title: "Hadi Hassan — Creative Director & Founder", description: "Ideas into brands, products, and intelligent business systems.", images: ["/images/hadi-halftone-hero.webp"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const personId = `${siteUrl}/#hadi-hassan`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: "Hadi Hassan — Creative Director and Founder",
      mainEntity: { "@id": personId },
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Hadi Hassan",
      alternateName: "Sheikh Hadi Hassan",
      url: siteUrl,
      image: `${siteUrl}/images/hadi-hero-clear.webp`,
      jobTitle: ["Creative Director", "Product Designer", "Founder of Intellignce"],
      email: "mailto:sheikh.hadi.hassan@gmail.com",
      homeLocation: { "@type": "Country", name: "Pakistan" },
      worksFor: { "@type": "Organization", name: "Intellignce", url: "https://intellignce.net/" },
      sameAs: ["https://www.linkedin.com/in/hadi-hasssan/", "https://www.behance.net/hadihasssan", "https://intellignce.net/"],
      knowsAbout: services.flatMap((service) => [service.title, ...service.capabilities]),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hadi Hassan Portfolio",
      inLanguage: "en-PK",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#services`,
      name: "Hadi Hassan — Creative Direction, Product and Digital Systems",
      url: `${siteUrl}/#services`,
      areaServed: "Worldwide",
      founder: { "@id": personId },
      email: "sheikh.hadi.hassan@gmail.com",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Creative and technology services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.title, description: service.summary },
        })),
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nebulica.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <SoundDock />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
