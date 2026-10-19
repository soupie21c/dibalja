import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { SiteHeader } from "@/components/crit/site-header";
import "./globals.css";

// Figma 파일과 같은 글꼴(Noto Sans KR) — globals.css 의 --font-sans 가 이 변수를 먼저 사용
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
  title: "Crit Board — 디자인 크리틱 보드",
  description: "작업 중인 화면을 올리고 동료의 피드백을 받는 곳",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh">
        <SiteHeader />
        <main className="mx-auto max-w-[67.5rem] px-5 py-12">{children}</main>
      </body>
    </html>
  );
}
