import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.basehub.com" },
      { protocol: "https", hostname: "cdn.basehub.com" },
    ],
    unoptimized: true,
  },
}

export default nextConfig
