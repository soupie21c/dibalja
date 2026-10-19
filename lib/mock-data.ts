import type { Feedback, Profile, Project } from "./types";

/** 1부 전용 가짜 데이터. 2부에서 Supabase로 교체됩니다. */
export const profiles: Profile[] = [
  { id: "u1", display_name: "김하늘", role_title: "프로덕트 디자이너", avatar_url: null },
  { id: "u2", display_name: "박도윤", role_title: "웹 디자이너", avatar_url: null },
  { id: "u3", display_name: "이서아", role_title: "UX 리서처", avatar_url: null },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const projects: Project[] = [
  {
    id: "p1",
    author_id: "u1",
    title: "동네 서점 예약 앱 — 홈 화면",
    summary: "책 재고를 먼저 보여줄지, 이벤트를 먼저 보여줄지 고민 중입니다. 첫 화면 위계에 대한 의견 부탁드려요.",
    image_url: "/mock/bookstore-home.png",
    figma_url: "https://www.figma.com/design/EXAMPLE/bookstore",
    tags: ["모바일", "커머스"],
    stage: "review",
    created_at: hoursAgo(3),
  },
  {
    id: "p2",
    author_id: "u2",
    title: "기업 랜딩페이지 리뉴얼",
    summary: "B2B SaaS 랜딩입니다. 히어로 카피 길이와 CTA 개수를 줄였는데 여전히 산만한지 봐주세요.",
    image_url: "/mock/landing-renewal.png",
    figma_url: null,
    tags: ["웹", "랜딩"],
    stage: "wip",
    created_at: hoursAgo(20),
  },
  {
    id: "p3",
    author_id: "u3",
    title: "사내 대시보드 다크 모드",
    summary: "차트 색 대비를 WCAG AA 기준으로 다시 맞췄습니다. 최종안으로 확정 예정이에요.",
    image_url: "/mock/dashboard-dark.png",
    figma_url: null,
    tags: ["웹", "대시보드", "접근성"],
    stage: "final",
    created_at: hoursAgo(50),
  },
];

export const feedback: Feedback[] = [
  { id: "f1", project_id: "p1", author_id: "u2", kind: "praise", body: "검색창이 상단에 고정된 게 좋아요. 목적이 분명한 사용자에게 바로 길을 줍니다.", created_at: hoursAgo(2) },
  { id: "f2", project_id: "p1", author_id: "u3", kind: "suggestion", body: "이벤트 배너가 재고 카드보다 시선을 더 끕니다. 배너 채도를 한 단계 낮춰 보면 어떨까요?", created_at: hoursAgo(1) },
  { id: "f3", project_id: "p2", author_id: "u1", kind: "question", body: "두 번째 CTA는 어떤 사용자를 위한 건가요?", created_at: hoursAgo(10) },
];
