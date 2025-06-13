import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true, // ✅ disables type checking
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables lint checking (optional but helpful)
  },
};

export default nextConfig;
