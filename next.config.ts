import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.HOSTINGER_STATIC_EXPORT === "1" ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    // Sites serves the optimized local assets directly; disabling the runtime
    // optimizer avoids a Worker fetch dependency and keeps previews resilient.
    unoptimized: true,
  },
};

export default nextConfig;
