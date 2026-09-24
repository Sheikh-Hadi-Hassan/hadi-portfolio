import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sites serves the optimized local assets directly; disabling the runtime
    // optimizer avoids a Worker fetch dependency and keeps previews resilient.
    unoptimized: true,
  },
};

export default nextConfig;
