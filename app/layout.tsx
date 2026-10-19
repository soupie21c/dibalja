import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Figma 파일과 같은 글꼴 — globals.css 의 --font-sans 가 이 변수를 먼저 사용
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crit Board",
  description: "완성 전에 보여주고, 동료의 피드백을 받는 디자인 크리틱 보드",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn("h-full", notoSansKr.variable, geistMono.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
