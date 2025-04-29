import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
