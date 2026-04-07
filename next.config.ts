import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "sdny.store" },
      { protocol: "https", hostname: "www.boozyburbs.com" },
      { protocol: "https", hostname: "livelabeauty.com" },
      { protocol: "https", hostname: "livelaspa.com" },
    ],
  },
};

export default nextConfig;
