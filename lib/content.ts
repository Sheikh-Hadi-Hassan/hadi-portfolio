export type Accent = "red" | "orange" | "cyan" | "green" | "purple";

export type ProjectVisual = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  presentation?: "full" | "contain" | "tile";
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  accent: Accent;
  statement: string;
  summary: string;
  challenge: string;
  response: string;
  decisions: string[];
  roles: string[];
  evidence: string;
  sourceUrl?: string;
  sourceLabel?: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  versionNote?: string;
  articleSections?: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  }[];
  draftTestimonial: string;
  cover: ProjectVisual;
  visuals: ProjectVisual[];
};

export const profile = {
  name: "Hadi Hassan",
  title: "Founder of Intellignce · Creative Director",
  location: "Pakistan",
  email: "sheikh.hadi.hassan@gmail.com",
  linkedin: "https://www.linkedin.com/in/hadi-hasssan/",
  behance: "https://www.behance.net/hadihasssan",
  intellignce: "https://intellignce.net/",
};

export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Story", href: "/about" },
  { label: "Systems Lab", href: "/systems-lab" },
  { label: "FLOW", href: "/flow" },
  { label: "Contact", href: "/contact" },
] as const;

export const stages = [
  { index: "01", name: "Creative", accent: "red" },
  { index: "02", name: "Brand", accent: "red" },
  { index: "03", name: "Product", accent: "orange" },
  { index: "04", name: "Technology", accent: "cyan" },
  { index: "05", name: "Systems", accent: "green" },
  { index: "06", name: "AI", accent: "purple" },
] as const;

export const services = [
  {
    index: "01",
    title: "Brand systems",
    summary: "Strategy, identity, packaging, and guidelines built to stay recognizable as the business grows.",
    icon: "/icons/pixel/design.svg",
    capabilities: ["Brand strategy", "Visual identity", "Packaging", "Brand guidelines"],
    featuredProject: { label: "Morganics", href: "/work/morganics" },
  },
  {
    index: "02",
    title: "Digital products",
    summary: "Clear product journeys, interfaces, prototypes, and design systems grounded in how people actually work.",
    icon: "/icons/pixel/think.svg",
    capabilities: ["Product strategy", "UI/UX design", "Prototyping", "Design systems"],
    featuredProject: { label: "OmniHelp", href: "/work/omnihelp" },
  },
  {
    index: "03",
    title: "Web & commerce",
    summary: "High-performance websites and commerce experiences where brand, conversion, and implementation agree.",
    icon: "/icons/pixel/build.svg",
    capabilities: ["Web design", "E-commerce", "Frontend", "Conversion journeys"],
    featuredProject: { label: "Morganics store", href: "/work/morganics" },
  },
  {
    index: "04",
    title: "Software & SaaS",
    summary: "Operational products, dashboards, and platforms shaped from business logic through launch-ready UI.",
    icon: "/icons/pixel/ship.svg",
    capabilities: ["SaaS products", "Dashboards", "Product architecture", "Beta delivery"],
    featuredProject: { label: "Product archive", href: "/work#products" },
  },
  {
    index: "05",
    title: "Creative campaigns",
    summary: "Campaign concepts, social systems, photography, motion, and content that make the idea memorable.",
    icon: "/icons/pixel/creative.svg",
    capabilities: ["Campaigns", "Social systems", "Photography", "Motion"],
    featuredProject: { label: "Creative archive", href: "/work#identity" },
  },
  {
    index: "06",
    title: "AI business systems",
    summary: "Business models, agentic workflows, and AI-assisted operating experiences designed around human decisions.",
    icon: "/icons/pixel/automate.svg",
    capabilities: ["Business Twin", "AI workflows", "Automation", "Operating systems"],
    featuredProject: { label: "Explore FLOW", href: "/flow" },
  },
] as const;

export const clientNames = [
  "Morganics",
  "Consumer Connect",
  "Bits HR Link",
  "OmniHelp",
  "Tecnomics",
  "The Creative OAK",
  "Edlytics",
  "NiceMD.ai",
  "BW Strike",
  "CallingDr",
] as const;

export const toolMoves = [
  {
    index: "01",
    name: "Think",
    outcome: "Turn ambiguity into direction.",
    icon: "/icons/pixel/think.svg",
    primary: ["Claude", "ChatGPT", "Gemini"],
    supporting: ["Grok", "Perplexity"],
  },
  {
    index: "02",
    name: "Design",
    outcome: "Make the idea visible before it becomes expensive.",
    icon: "/icons/pixel/design.svg",
    primary: ["Figma", "Nano Banana", "Higgsfield"],
    supporting: ["Framer", "Midjourney", "Firefly", "Runway", "Kling", "Sora"],
  },
  {
    index: "03",
    name: "Build",
    outcome: "Turn the model into something real.",
    icon: "/icons/pixel/build.svg",
    primary: ["Codex", "Claude Code", "Cursor"],
    supporting: ["Google Antigravity", "GitHub Copilot", "Bolt.new"],
  },
  {
    index: "04",
    name: "Ship",
    outcome: "Move from a local idea to a working product.",
    icon: "/icons/pixel/ship.svg",
    primary: ["Next.js", "Supabase", "Vercel"],
    supporting: ["React", "TypeScript", "GitHub"],
  },
  {
    index: "05",
    name: "Automate",
    outcome: "Connect the work so it keeps moving.",
    icon: "/icons/pixel/automate.svg",
    primary: ["n8n", "Grok Bot", "MCP"],
    supporting: ["Human checkpoints", "Evidence", "Governance"],
  },
] as const;

export const projects: Project[] = [
  {
    slug: "morganics",
    index: "01",
    title: "Morganics",
    category: "Identity · Packaging · Commerce",
    accent: "green",
    statement: "A natural pantry became one recognizable brand system.",
    summary:
      "Brand identity, packaging architecture, localized product discovery, responsive commerce, and development brought into one customer experience.",
    challenge:
      "Morganics serves Pakistani households with a broad catalogue of pantry and wellness ingredients. The brand needed to make many products feel related at a glance, while still giving every ingredient enough distinction to be understood and chosen confidently.",
    response:
      "The work connected identity, packaging hierarchy, product photography, content structure, mobile behavior, and technical commerce decisions. The result is a system designed to remain recognizable from an individual pouch to a growing digital catalogue.",
    decisions: [
      "Use a disciplined front-of-pack hierarchy so every product belongs to one family.",
      "Let ingredient photography and variant color create distinction without breaking recognition.",
      "Carry the packaging logic into understandable category and product-discovery paths.",
      "Treat educational content as part of the shopping journey, not as an appendix.",
      "Design mobile purchasing around familiar local behavior and keep brand, interface, and implementation decisions connected.",
    ],
    roles: [
      "Creative direction",
      "Brand identity",
      "Packaging design system",
      "E-commerce UI/UX",
      "Theme design & development",
      "Frontend development",
      "Commerce architecture",
    ],
    evidence:
      "The identity and packaging work is documented in Hadi’s published Behance case linked below. The current live store was inspected on August 29, 2026, and the storefront capture documents that separate state. Collaborator boundaries and measurable commercial outcomes still require confirmation.",
    sourceUrl: "https://www.behance.net/gallery/254999755/Morganics-Brand-Identity-Packaging-Design",
    sourceLabel: "View the complete published case on Behance",
    secondaryUrl: "https://morganics.store/",
    secondaryLabel: "Visit the current Morganics store",
    articleSections: [
      {
        eyebrow: "01 / The brief",
        title: "Many products. One recognizable family.",
        paragraphs: [
          "Morganics is not a single-product identity. The system has to hold nuts, seeds, powders, and everyday pantry ingredients together while helping each item remain immediately understandable.",
          "That made recognition the central design problem: a customer should be able to meet one pack, then recognize the family when the catalogue expands.",
        ],
      },
      {
        eyebrow: "02 / The identity",
        title: "Natural, structured, unmistakably Morganics.",
        paragraphs: [
          "A deep forest base gives the range a consistent visual home. Product-specific color and ingredient imagery add distinction, while repeated typography and information placement keep the brand stable.",
          "The identity is deliberately calm and direct. It signals a natural product without relying on the loose visual clichés often used across the category.",
        ],
      },
      {
        eyebrow: "03 / Packaging architecture",
        title: "One system. Many ingredients. Clear hierarchy.",
        paragraphs: [
          "The pouches share their composition, brand block, product-name position, supporting information, and photographic behavior. Variant colors can change because the underlying rules do not.",
          "Individually, each package identifies its ingredient. Together, the range reads as a coordinated shelf system rather than a collection of unrelated labels.",
        ],
      },
      {
        eyebrow: "04 / From shelf to screen",
        title: "From the shelf into commerce.",
        paragraphs: [
          "The digital experience carries the identity into category discovery, education, product comparison, and purchase. Packaging creates recognition; the storefront turns that recognition into an understandable journey.",
          "This connection between identity and use is the larger point of the project: the brand is not a presentation layer placed over commerce. It is the organizing logic that helps the experience work.",
        ],
      },
    ],
    draftTestimonial:
      "Hadi approached Morganics as more than an online storefront. He connected brand presentation, product discovery, mobile usability, and the technical commerce experience into one coherent system.",
    cover: {
      src: "/images/projects/morganics/05-packaging-system.webp",
      width: 1400,
      height: 1120,
      alt: "Morganics packaging family in forest green, turmeric, and cacao colorways",
      caption: "Published identity and packaging system",
    },
    visuals: [
      {
        src: "/images/projects/morganics/05-packaging-system.webp",
        width: 1400,
        height: 1120,
        alt: "Morganics packaging family in forest green, turmeric, and cacao colorways",
        caption: "Packaging architecture · one recognizable family across product variants.",
      },
      {
        src: "/images/projects/morganics/02-pista.webp",
        width: 1000,
        height: 1000,
        alt: "Morganics Pista Maghaz pouch photographed with pistachios",
        caption: "Product system · Pista Maghaz",
        presentation: "tile",
      },
      {
        src: "/images/projects/morganics/03-cashew.webp",
        width: 1000,
        height: 1000,
        alt: "Morganics Kajo Roasted pouch photographed with cashews",
        caption: "Product system · Kajo Roasted",
        presentation: "tile",
      },
      {
        src: "/images/projects/morganics/04-chia.webp",
        width: 1000,
        height: 1000,
        alt: "Morganics Chia Seeds pouch photographed with chia seeds",
        caption: "Product system · Chia Seeds",
        presentation: "tile",
      },
      {
        src: "/images/projects/morganics/01-live-home.webp",
        width: 1330,
        height: 905,
        alt: "Morganics live storefront with a green pantry pouch, natural ingredients, and category controls",
        caption: "From shelf to screen · the current live storefront captured August 29, 2026.",
      },
    ],
  },
  {
    slug: "consumer-connect",
    index: "02",
    title: "Consumer Connect",
    category: "Research · Narrative · Digital Experience",
    accent: "cyan",
    statement: "A complex research business needed to be understood before it could be remembered.",
    summary:
      "Responsive web communication and a storyboard-led motion narrative built to explain a layered market-research business.",
    challenge:
      "Consumer Connect spans panels, product feedback, research campaigns, data, and long-term market insight. The challenge was to make that breadth understandable without flattening the business into a generic service list.",
    response:
      "The supplied portfolio documents a responsive website contribution. The published Behance project documents a separate film concept and storyboard. Together they show the same communication decision across two forms: reveal the research journey in a sequence people can follow.",
    decisions: [
      "Turn research capability into a narrative rather than a service inventory.",
      "Use the iceberg idea to move from visible products to the insight beneath them.",
      "Give each scene and page section one communication job.",
      "Keep the digital experience legible as the composition compresses.",
    ],
    roles: ["Responsive website development", "Narrative structure", "Storyboard", "Motion communication"],
    evidence:
      "The website contribution is documented in Hadi’s supplied 2025 portfolio. The motion and storyboard case was published on Behance on June 20, 2024. Exact collaboration boundaries and performance outcomes still require confirmation.",
    sourceUrl: "https://www.behance.net/gallery/201414847/The-Consumer-Connect-Journey",
    sourceLabel: "View published case on Behance",
    draftTestimonial:
      "Hadi brought structure to how our research story was communicated. Across the responsive website and narrative concept, he made a complex offering easier to understand without losing the depth behind it.",
    cover: {
      src: "/images/projects/consumer-connect/01-story-world.webp",
      width: 1400,
      height: 1050,
      alt: "Consumer Connect presentation scene introducing Pakistan's consumer panel",
      caption: "Published motion case · Behance, 2024",
    },
    visuals: [
      {
        src: "/images/projects/consumer-connect/01-story-world.webp",
        width: 1400,
        height: 1050,
        alt: "Consumer Connect presentation scene introducing Pakistan's consumer panel",
        caption: "Narrative world · the research platform introduced as a public story.",
      },
      {
        src: "/images/projects/consumer-connect/02-storyboard.webp",
        width: 1400,
        height: 788,
        alt: "Consumer Connect storyboard showing the sequence of the research narrative",
        caption: "Storyboard · the communication logic before motion.",
        presentation: "contain",
      },
    ],
  },
  {
    slug: "bits-hr-link",
    index: "03",
    title: "Bits HR Link",
    category: "Identity · Brand System",
    accent: "red",
    statement: "An identity has to hold together after the presentation ends.",
    summary:
      "A visual identity designed to remain distinctive, structured, and consistent across software, communication, and physical applications.",
    challenge:
      "Bits HR Link needed more than a recognizable mark. It needed a visual language that could move between product interfaces, communication, and physical touchpoints without losing coherence.",
    response:
      "The identity was treated as a working system: a central idea expressed through form, typography, color, and repeatable application rules.",
    decisions: [
      "Build recognition from a clear underlying idea.",
      "Create rules that survive different formats and teams.",
      "Balance distinctiveness with the precision of a software brand.",
      "Show the system through application, not a logo in isolation.",
    ],
    roles: ["Brand strategy", "Identity design", "Visual system", "Application direction"],
    evidence:
      "The case was published on Behance on March 10, 2025. The published applications below support the visual-system story; original exploration material and exact delivered scope still require confirmation.",
    sourceUrl: "https://www.behance.net/gallery/221084057/The-Brand-Identity-of-Bits-HR-Link",
    sourceLabel: "View published case on Behance",
    secondaryUrl: "https://www.b-hrlink.com",
    secondaryLabel: "Visit the current Bits HR Link website",
    draftTestimonial:
      "Hadi translated the idea behind Bits HR Link into an identity that felt distinctive, structured, and ready to grow. The work went beyond a logo, giving us a visual language we could apply consistently across the brand.",
    cover: {
      src: "/images/projects/bits-hr-link/01-brand-system.webp",
      width: 1400,
      height: 942,
      alt: "Bits HR Link identity system presented across a structured brand workbook",
      caption: "Published identity case · Behance, 2025",
    },
    visuals: [
      {
        src: "/images/projects/bits-hr-link/01-brand-system.webp",
        width: 1400,
        height: 942,
        alt: "Bits HR Link identity system presented across a structured brand workbook",
        caption: "The identity begins as a system of form, type, and repeatable rules.",
      },
      {
        src: "/images/projects/bits-hr-link/02-identity-grid.webp",
        width: 1400,
        height: 933,
        alt: "Bits HR Link identity presentation in a physical brand folder",
        caption: "Identity documentation · designed for use after the presentation.",
      },
      {
        src: "/images/projects/bits-hr-link/03-identity-detail.webp",
        width: 1400,
        height: 933,
        alt: "Bits HR Link digital identity applied to tablet and laptop screens",
        caption: "Digital application · recognition across product surfaces.",
      },
      {
        src: "/images/projects/bits-hr-link/04-applications.webp",
        width: 1400,
        height: 933,
        alt: "Bits HR Link brand applied to a mobile interface and desktop communication",
        caption: "Application behavior · one language across formats.",
      },
      {
        src: "/images/projects/bits-hr-link/05-system-motion.webp",
        width: 1400,
        height: 933,
        alt: "Bits HR Link brand guideline box and printed identity materials",
        caption: "Physical system · the identity outside the screen.",
      },
      {
        src: "/images/projects/bits-hr-link/06-brand-application.webp",
        width: 1400,
        height: 1050,
        alt: "Bits HR Link logo badges and character applications",
        caption: "Repeatability · the mark becoming an application language.",
      },
    ],
  },
  {
    slug: "omnihelp",
    index: "04",
    title: "OmniHelp",
    category: "Complex Care · Digital Experience",
    accent: "purple",
    statement: "Complex care needs calm, not simplification.",
    summary:
      "A version-controlled case about bringing clarity and approachability to a detailed health-service experience.",
    challenge:
      "The supplied 2025 portfolio describes a US health app spanning virtual physician appointments, EMR/EHR integration, and 24/7 care. The interface had to make a detailed service feel approachable without minimizing the seriousness of care.",
    response:
      "The documented contribution is responsive website development focused on user-friendly access across screen sizes. This case deliberately separates that historical version from OmniHelp’s current public positioning.",
    decisions: [
      "Keep physician access, health records, and ongoing care within one understandable path.",
      "Make the responsive version feel deliberate, not compressed.",
      "Support trust through direct language and predictable navigation.",
      "Document the delivered version without claiming ownership of later changes.",
    ],
    roles: ["Responsive website development", "Frontend implementation", "Cross-device behavior"],
    evidence:
      "The contribution and historical screen are documented in Hadi’s supplied 2025 portfolio. The current domain could not be reliably inspected during this review, so the version date, later changes, and performance outcomes remain unverified.",
    sourceUrl: "https://omnihelp.com/",
    sourceLabel: "Open current public domain",
    versionNote:
      "This page describes the version Hadi contributed to. The current public OmniHelp service may differ from this case-study state.",
    draftTestimonial:
      "Hadi helped translate a complex care service into a responsive experience that felt clearer and more approachable. He balanced detailed platform information with straightforward navigation across devices.",
    cover: {
      src: "/images/projects/omnihelp/01-portfolio-reference-hq.webp",
      width: 1813,
      height: 1215,
      alt: "Historical OmniHelp mobile and desktop interface reference from Hadi Hassan's supplied 2025 portfolio",
      caption: "Historical supplied portfolio artifact · 2025",
      presentation: "full",
    },
    visuals: [
      {
        src: "/images/projects/omnihelp/01-portfolio-reference-hq.webp",
        width: 1813,
        height: 1215,
        alt: "Historical OmniHelp mobile and desktop interface reference from Hadi Hassan's supplied 2025 portfolio",
        caption: "Historical interface reference · preserved as supplied, not represented as the current product.",
        presentation: "full",
      },
      {
        src: "/images/projects/omnihelp/02-portfolio-page.webp",
        width: 330,
        height: 610,
        alt: "Excerpt from Hadi Hassan's supplied portfolio describing the OmniHelp responsive website",
        caption: "Source artifact · contribution description from the supplied 2025 portfolio.",
        presentation: "contain",
      },
    ],
  },
  {
    slug: "intellignce",
    index: "05",
    title: "Intellignce",
    category: "Studio Identity · Operating System",
    accent: "purple",
    statement: "A studio identity designed to behave like the work it creates.",
    summary:
      "A modular identity language connecting strategy, design, technology, systems, and AI under one studio idea.",
    challenge:
      "Intellignce works across disciplines that are often presented as separate services. The identity needed to make that range feel coherent without reducing the studio to a generic agency mark.",
    response:
      "The system was built around a recognizable central symbol, a controlled dark foundation, and discipline-specific signals. The same logic extends through presentations, credentials, physical applications, digital surfaces, and the studio’s public language.",
    decisions: [
      "Use one core symbol as the anchor across every discipline.",
      "Let color identify capability while the overall identity remains recognizably monochromatic.",
      "Design applications as reusable operating templates rather than isolated mockups.",
      "Connect the visual system to the studio’s language: creative work becoming products, technology, and systems.",
      "Keep the identity extensible enough to absorb new AI-led capabilities without redesigning the brand.",
    ],
    roles: ["Founder", "Creative direction", "Brand strategy", "Identity system", "Application direction"],
    evidence:
      "Intellignce is Hadi Hassan’s studio. The identity is documented in a published Behance case and in the supplied Intellignce profile and original application assets. Commercial outcomes and third-party recognition are not claimed here.",
    sourceUrl: "https://www.behance.net/gallery/223740755/Behind-the-Logo-Intellignce",
    sourceLabel: "View the published identity case",
    secondaryUrl: "https://intellignce.net",
    secondaryLabel: "Visit the current studio website",
    articleSections: [
      {
        eyebrow: "01 / The idea",
        title: "One studio. Several ways of making.",
        paragraphs: [
          "The studio moves between brand, product, technology, systems, and AI. The identity therefore has to explain a connected practice, not decorate a conventional list of services.",
          "A single recognizable core gives every discipline a shared origin. Variations can signal different capabilities without turning them into different brands.",
        ],
      },
      {
        eyebrow: "02 / The system",
        title: "Recognition before variation.",
        paragraphs: [
          "Dark foundations, controlled typography, and the central symbol create continuity. Color becomes a functional signal inside that structure rather than the identity’s main source of recognition.",
          "This makes the system capable of moving from a credential or lanyard to a presentation and digital interface while keeping the same voice.",
        ],
      },
      {
        eyebrow: "03 / The behavior",
        title: "A brand prepared to keep evolving.",
        paragraphs: [
          "The application language is intentionally modular. New services and tools can enter the system through established rules instead of requiring another visual reset.",
          "That extensibility mirrors the larger studio proposition: ideas do not stop at appearance; they develop into products, technology, and operating systems.",
        ],
      },
    ],
    draftTestimonial:
      "Intellignce is Hadi’s own studio identity. No external testimonial is presented for this self-initiated brand system.",
    cover: {
      src: "/images/projects/intellignce/004.webp",
      width: 1600,
      height: 1200,
      alt: "Intellignce symbol system and capability icons on a dark fabric application",
      caption: "Original supplied identity application",
    },
    visuals: [
      {
        src: "/images/projects/intellignce/004.webp",
        width: 1600,
        height: 1200,
        alt: "Intellignce identity system with the studio name and multicolor capability symbols",
        caption: "Core identity · one studio language across connected capabilities.",
      },
      {
        src: "/images/projects/intellignce/003.webp",
        width: 1600,
        height: 1200,
        alt: "Intellignce branded tape system in dark, red, purple, and orange",
        caption: "Variation system · capability signals held by one visual structure.",
      },
      {
        src: "/images/projects/intellignce/001.webp",
        width: 1600,
        height: 1088,
        alt: "Intellignce printed profile and identity presentation",
        caption: "Studio profile · the system applied to capability communication.",
      },
      {
        src: "/images/projects/intellignce/002.webp",
        width: 1200,
        height: 1600,
        alt: "Intellignce credential and lanyard application",
        caption: "Physical application · recognition beyond the screen.",
        presentation: "contain",
      },
      {
        src: "/images/projects/intellignce/005.webp",
        width: 1600,
        height: 1200,
        alt: "Intellignce website interface displayed on a desktop monitor",
        caption: "Digital application · identity translated into a studio interface.",
      },
    ],
  },
];

export type PortfolioLink = { label: string; href: string };
export type PortfolioEntry = {
  title: string;
  type: string;
  image: string;
  evidence: "Published case" | "Live website" | "Live beta" | "Supplied profile";
  links: readonly PortfolioLink[];
};

export const portfolioGroups: readonly { id: string; eyebrow: string; title: string; body: string; projects: readonly PortfolioEntry[] }[] = [
  {
    id: "products",
    eyebrow: "Product & software / 10 records",
    title: "Interfaces built around real operations.",
    body: "Healthcare, education, rental, travel, and commerce systems found across Hadi’s and Intellignce’s supplied profiles. Live links are separated from historical profile evidence.",
    projects: [
      { title: "ClearMetRx", type: "Telehealth finance · Responsive web", image: "/images/projects/catalog/products/clearmetrx.webp", evidence: "Supplied profile", links: [] },
      { title: "Care by CallingDr", type: "Healthcare platform · Product experience", image: "/images/projects/catalog/products/care-callingdr.webp", evidence: "Supplied profile", links: [] },
      { title: "Edlytics", type: "Education SaaS · Identity · Dashboard", image: "/images/projects/catalog/products/edlytics.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/201839211/Edlytics-A-Case-Study-in-Logo-Design" }] },
      { title: "Virtual Pharmacy", type: "Medicine cabinet · SaaS product", image: "/images/projects/catalog/products/virtual-pharmacy.webp", evidence: "Supplied profile", links: [] },
      { title: "Dejong Rental Management", type: "Construction rental · Web application", image: "/images/projects/catalog/products/dejong.webp", evidence: "Supplied profile", links: [] },
      { title: "Grassroots Ventures", type: "Application experience", image: "/images/projects/catalog/identity/profile-19.webp", evidence: "Supplied profile", links: [] },
      { title: "Longwood Reef & Coral", type: "Commerce · Application experience", image: "/images/projects/catalog/identity/profile-21.webp", evidence: "Supplied profile", links: [] },
      { title: "MORENT", type: "Car rental · Product concept", image: "/images/projects/catalog/identity/profile-23.webp", evidence: "Live beta", links: [{ label: "Live beta", href: "https://crent.vercel.app/" }, { label: "Figma", href: "https://www.figma.com/design/fE4LNoAzRplX4fUGST52GT/MORENT---Car-Rent--Community-?node-id=0-1&t=osn3q2v05ALw7mPA-1" }, { label: "GitHub", href: "https://github.com/faizahmad0022/AdminCrentProject" }] },
      { title: "Travel Management", type: "Operations · Product beta", image: "/images/projects/catalog/identity/profile-24.webp", evidence: "Live beta", links: [{ label: "Open beta", href: "https://tms-theta-eight.vercel.app" }] },
      { title: "App Tech", type: "Application platform · Product beta", image: "/images/projects/catalog/identity/profile-25.webp", evidence: "Live beta", links: [{ label: "Open beta", href: "https://app-tech-six.vercel.app/login" }] },
    ],
  },
  {
    id: "identity",
    eyebrow: "Identity, campaigns & image / 14 records",
    title: "Marks that became systems and stories.",
    body: "Published Behance work is linked directly. Historical explorations are explicitly marked as supplied-profile evidence rather than presented as complete public case studies.",
    projects: [
      { title: "NiceMD.ai", type: "Healthcare · AI identity", image: "/images/projects/archive/nicemd.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/220638491/NiceMDai-AI-Powered-Healthcare-Solution" }] },
      { title: "Fakhr-e-Qoum", type: "Documentary · Behind the scenes", image: "/images/projects/archive/project-documentary.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/220635279/Documentary-Fakhr-e-Qoum-2023-Behind-the-Scenes" }] },
      { title: "BW Strike", type: "Product photography · Commerce", image: "/images/projects/archive/bw-strike.webp", evidence: "Published case", links: [{ label: "Photography case", href: "https://www.behance.net/gallery/221794051/Product-Photography-for-BW-Strikes-Boxing-Gear" }, { label: "Live website", href: "https://bwstrike.co.uk" }] },
      { title: "Al Faraj Media", type: "Logo · Identity process", image: "/images/portfolio-assets/al-faraj-process.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/200947393/The-Al-Faraj-Media-Logo-A-Case-Study" }] },
      { title: "Lahore Culture", type: "Culture · Brand identity", image: "/images/portfolio-assets/lahore-culture.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/198652045/Lahore-Culture-Branding" }] },
      { title: "Accessorize by HL", type: "Jewellery · Brand guide", image: "/images/projects/archive/project-accessorize.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/198748623/Accessorize-by-HL-Logo-and-Branding-Guide" }] },
      { title: "Kruzz", type: "Identity · Brand system", image: "/images/projects/catalog/identity/profile-27.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/198561017/Kruzz-Branding" }] },
      { title: "Food Delivery Platform", type: "Logo · Product identity", image: "/images/projects/catalog/identity/profile-32.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/157703383/Logo-Design-For-A-Food-Delivery-Platform" }] },
      { title: "Social Media Portfolio", type: "Campaigns · Content systems", image: "/images/portfolio-assets/social-systems.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/201857871/Social-Media-Portfolio" }] },
      { title: "LinkedIn Personal Brand System", type: "Editorial · Personal branding", image: "/images/projects/catalog/behance/linkedin-brand.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/240918657/LinkedIn-Personal-Brand-Design-System" }] },
      { title: "Election Campaign", type: "Community · Campaign system", image: "/images/portfolio-assets/social-systems.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/253277231/Election-Campaign-for-a-Community-Organisation" }] },
      { title: "AI Animated Video", type: "AI production · Motion", image: "/images/projects/catalog/behance/ai-video.webp", evidence: "Published case", links: [{ label: "Behance case", href: "https://www.behance.net/gallery/224910703/How-I-Made-an-Animated-Video-Using-AI-Only" }] },
      { title: "Jules Capital", type: "Identity applications", image: "/images/portfolio-assets/jules-guidelines.webp", evidence: "Supplied profile", links: [] },
      { title: "Predestination", type: "Identity exploration", image: "/images/portfolio-assets/predestination-sketch.webp", evidence: "Supplied profile", links: [] },
    ],
  },
  {
    id: "websites",
    eyebrow: "Websites & commerce / 15 records",
    title: "A wider delivery archive.",
    body: "These records come from the supplied 2025 Hadi profile. A live link proves the current destination, not the exact present-day design, ownership boundary, or launch outcome.",
    projects: [
      { title: "Salezpeak", type: "Business website", image: "/images/projects/catalog/websites/salezpeak.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://www.salezpeak.com" }] },
      { title: "The Creative OAK", type: "Creative studio website", image: "/images/projects/catalog/websites/creative-oak.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://thecreativeoak.com" }] },
      { title: "Zainjee", type: "Fashion · E-commerce", image: "/images/projects/catalog/websites/zainjee.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://zainjee.com" }] },
      { title: "Jawa Fragrance", type: "Fragrance · Commerce", image: "/images/projects/catalog/websites/jawa-fragrance.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://jawafragrance.com" }] },
      { title: "Sukena", type: "Retail · E-commerce", image: "/images/projects/catalog/websites/sukena.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://sukena.pk" }] },
      { title: "S. Printing Solutions", type: "Printing · Business website", image: "/images/projects/catalog/websites/s-printing.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://sdotprintingsolutions.net" }] },
      { title: "Liberty Land", type: "Property · Business website", image: "/images/projects/catalog/websites/liberty-land.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://libertyland.pk" }] },
      { title: "Glacier Engineer", type: "Engineering · Business website", image: "/images/projects/catalog/websites/glacier-engineer.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://glacierengenier.com" }] },
      { title: "OmniHTS", type: "Technology · Corporate website", image: "/images/projects/catalog/websites/omnihts.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://omnihts.com" }] },
      { title: "AgilityBO", type: "Business operations · Website", image: "/images/projects/catalog/websites/agilitybo.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://agilitybo.com" }] },
      { title: "Tecnomics", type: "Enterprise technology · Website", image: "/images/projects/catalog/websites/tecnomics.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://tecnomics.com" }] },
      { title: "SureTouch Global", type: "Technology · Corporate website", image: "/images/projects/catalog/websites/suretouch.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://suretouchglobal.com" }] },
      { title: "SportsPlus", type: "Sports · Commerce", image: "/images/projects/catalog/websites/sportsplus.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://www.sportsplus.pk" }] },
      { title: "Spyda Footwear", type: "Footwear · E-commerce", image: "/images/projects/catalog/websites/spyda.webp", evidence: "Live website", links: [{ label: "Visit website", href: "https://spydafootwear.com" }] },
      { title: "OmniHelp", type: "Healthcare · Responsive website", image: "/images/projects/catalog/websites/omnihelp.webp", evidence: "Live website", links: [{ label: "Full case", href: "/work/omnihelp" }, { label: "Visit website", href: "https://omnihelp.com" }] },
    ],
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
