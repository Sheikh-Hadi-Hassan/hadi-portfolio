import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sites serves the optimized local assets directly; disabling the runtime
    // optimizer avoids a Worker fetch dependency and keeps previews resilient.
    unoptimized: true,
  },
  async redirects() {
    return [
      // Preserve the strongest direct matches where the new archive has a case study.
      { source: "/morganics", destination: "/work/morganics", permanent: true },
      { source: "/bits-hr-link", destination: "/work/bits-hr-link", permanent: true },
      { source: "/intellignce", destination: "/work/intellignce", permanent: true },
      // Keep legacy portfolio entries reachable through their closest archive category.
      { source: "/mackenzie-cramblit", destination: "/work#identity", permanent: true },
      { source: "/linkedin-personal-brand", destination: "/work#identity", permanent: true },
      { source: "/accessorize-by-hl", destination: "/work#identity", permanent: true },
      { source: "/jules-capital-partners", destination: "/work#identity", permanent: true },
      { source: "/jules-capital", destination: "/work#identity", permanent: true },
      { source: "/fakhr-e-qoum", destination: "/work#identity", permanent: true },
      { source: "/community-campaign", destination: "/work#identity", permanent: true },
      { source: "/edlytics", destination: "/work#products", permanent: true },
      { source: "/nicemd", destination: "/work#identity", permanent: true },
      { source: "/al-faraj-media", destination: "/work#identity", permanent: true },
      { source: "/bw-sports", destination: "/work#identity", permanent: true },
      { source: "/ai-animation", destination: "/work#identity", permanent: true },
      { source: "/uiux-web-saas", destination: "/work#products", permanent: true },
      { source: "/archive", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
