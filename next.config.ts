import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Fix static file serving on Render
  poweredByHeader: false,
};

export default nextConfig;
