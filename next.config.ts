import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image 로 외부 이미지를 쓰려면 허용 도메인을 명시해야 합니다.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // Server Action 요청 본문 기본 한도(1MB) → 썸네일 5MB까지 받도록
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
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
