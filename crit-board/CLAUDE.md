# Crit Board — Claude Code 작업 규칙 (Design System Rules)

이 파일은 Claude Code가 매 세션 시작 시 자동으로 읽습니다.
Figma MCP로 디자인을 가져와 코드로 옮길 때 아래 규칙을 반드시 지키세요.

@AGENTS.md

## Figma 원본
- 파일: Crit Board — 디발자 실습
  https://www.figma.com/design/c6d814pibkQheV2GzpjeAn/
- `Foundations` 페이지: `Foundations / Light`(node 3:2), `Foundations / Dark`(node 3:128)
- 변수 컬렉션 `Crit / Tokens` (Light / Dark 모드). 각 변수에 코드 이름(`var(--primary)` 등)이 지정되어 있습니다.

### Figma 컴포넌트 ↔ 코드 대응표 (Code Connect 대신)
Figma Code Connect는 Organization/Enterprise 요금제에서만 쓸 수 있어, 이 표로 대신합니다.
Figma 노드를 받으면 아래 파일을 먼저 열어 재사용하세요.

| Figma 컴포넌트 (node) | Variant 속성 | 코드 |
|---|---|---|
| Button (3:302) | Type, Size | `components/ui/button.tsx` — `variant`, `size` |
| Badge (3:317) | Type (WIP/Review/Final 포함) | `components/ui/badge.tsx` — `variant` / 단계는 `components/crit/stage-badge.tsx` |
| Field (41:91) | Type = Input / Textarea | `components/ui/label.tsx` + `input.tsx` / `textarea.tsx` |
| Avatar (47:9) | Size = SM / MD / LG | `components/crit/user-avatar.tsx` — `size` |
| ProjectCard (4:2) | — | `components/crit/project-card.tsx` |
| Screens: Feed (5:2) · Work Detail (26:67) · Upload (41:92) | — | `app/page.tsx` · `app/projects/[id]/page.tsx` · `app/projects/new/page.tsx` |

## 스택
- Next.js 16 (App Router, TypeScript), React 19
- Tailwind CSS v4 (설정 파일 없음 — 토큰은 `app/globals.css`의 `@theme inline`)
- shadcn/ui (`radix-vega` 스타일 = 예전 new-york에 해당, `components/ui`), 아이콘은 lucide-react
- 2부부터: Supabase (`@supabase/ssr`), 세션 갱신은 루트 `proxy.ts`

## Figma → 코드 변환 규칙
1. Figma MCP의 `get_design_context` 출력(React + Tailwind)은 **참고 자료**입니다. 그대로 붙여넣지 말고 이 프로젝트 컴포넌트로 다시 조립하세요.
2. 색·간격·모서리는 **반드시 토큰 유틸리티**를 사용합니다. `bg-[#2546d8]` 같은 임의 값 금지.
   - Figma `color/brand/cobalt` → `bg-primary` / `text-primary`
   - Figma `color/brand/marker` → `bg-highlight`
   - Figma `color/text/subtle` → `text-muted-foreground`
   - Figma `color/stage/*` → `bg-stage-wip` / `bg-stage-review` / `bg-stage-final` (+ `-foreground`)
   - 새 Figma 변수가 나오면 먼저 `app/globals.css`의 `:root`, `.dark`, `@theme inline` 세 곳에 추가한 뒤 사용하세요.
3. 버튼·입력·배지·카드 등 기본 요소는 `components/ui`의 shadcn 컴포넌트를 재사용합니다. 없으면 `npx shadcn@latest add <name>`.
4. 도메인 조합 컴포넌트는 `components/crit/`에 둡니다 (예: `project-card.tsx`).
5. Figma 컴포넌트 Variant 속성은 `cva`의 `variants`로 1:1 대응시킵니다.
6. 이미지 에셋은 Figma MCP가 주는 localhost 에셋 URL을 그대로 쓰고, 임시 placeholder를 만들지 마세요.
7. 시그니처 모양인 "코멘트 핀"은 `pin` 유틸리티(`app/globals.css`)를 사용합니다.
8. Figma Variant의 상태(Default/Hover/Focus/Disabled/Loading)는 각각 `hover:`·`focus-visible:`·`disabled:`·`aria-busy`·React state로 옮깁니다. 2부부터 폼 제출 버튼의 Loading 상태는 `components/crit/submit-button.tsx`를 사용합니다.
9. Figma 프로토타입 연결(화면 이동)은 `<Link>`(단순 이동) 또는 Server Action 안의 `redirect()`(저장 후 이동)로 구현합니다.

## Tailwind v4 주의 (오래된 자료·AI 답변에서 자주 섞여 들어오는 것)
- `tailwind.config.js`를 만들지 않습니다. 테마·브레이크포인트는 `app/globals.css`의 `@theme`에서 정의합니다.
- 토큰 값을 `hsl(var(--primary))`로 감싸지 않습니다. 이 프로젝트의 토큰은 완성된 색 값이며 `@theme inline`이 그대로 연결합니다.
- JSX에서는 `class`가 아니라 `className`을 씁니다.
- 반응형은 모바일 퍼스트: 접두사 없는 클래스 = 모바일 기본, `sm:`(640px)·`md:`(768px)·`lg:`(1024px) 이상에서 덮어씁니다.

## 코드 규칙
- 기본은 Server Component. 상태·이벤트가 필요할 때만 파일 맨 위에 `"use client"`.
- 데이터 접근은 `lib/data.ts`만 통해서 합니다. 화면 컴포넌트에서 DB를 직접 호출하지 않습니다.
- 데이터 변경은 `lib/actions/*`의 Server Action으로 하고, 끝나면 `revalidatePath`.
- 접근성: 모든 입력에 `<Label>`, 아이콘 버튼에 `aria-label`, 포커스 링 유지.
- UI 문구는 한국어, 버튼은 동작을 말하는 동사형("작업 올리기", "피드백 남기기").

## 검증
- 작업 후 `npm run typecheck` 와 `npm run build`가 통과해야 합니다.
- `/design-system` 페이지를 Figma와 나란히 놓고 시각 비교하세요. 가능하면 Figma MCP `get_screenshot`으로 원본 스크린샷을 받아 대조합니다.
