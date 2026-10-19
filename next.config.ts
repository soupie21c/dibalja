import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image 로 외부 이미지를 쓰려면 허용 도메인을 명시해야 합니다.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
