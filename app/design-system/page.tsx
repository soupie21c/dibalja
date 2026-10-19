/**
 * 디자인 시스템 페이지 — 4개 기둥으로 구성
 *   1. 디자인 원칙 & 컨셉   : 이 서비스가 지향하는 시각적 방향과 톤
 *   2. 스타일 가이드         : 색상·타이포·간격·그리드·모서리·브레이크포인트
 *   3. 컴포넌트 라이브러리   : components/ui + components/crit 의 실제 렌더링
 *   4. 운영 가이드라인       : 각 컴포넌트를 "언제, 어떻게" 쓰는지
 * Figma의 Foundations / Components 페이지와 나란히 띄워 Visual QA 하는 용도이며,
 * 팀 규모가 커지면 같은 역할을 Storybook 으로 옮길 수 있습니다.
 */
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCard } from "@/components/crit/project-card";

export const metadata = { title: "디자인 시스템 — Crit Board" };

const principles = [
  ["질문이 먼저 보이게", "작업물보다 '어떤 피드백이 필요한가'가 먼저 읽히도록 요약을 제목 바로 아래에 둡니다."],
  ["강조는 한 곳에만", "형광 노랑(highlight)은 코멘트 핀에만 씁니다. 다른 요소에 쓰면 핀의 신호가 약해집니다."],
  ["차분한 바탕, 또렷한 잉크", "회청색 바탕과 코발트 잉크로 작업물 썸네일이 주인공이 되게 합니다."],
] as const;

const colors = [
  ["background", "bg-background", "페이지 바탕"],
  ["foreground", "bg-foreground", "본문 텍스트"],
  ["card", "bg-card", "카드·입력 바탕"],
  ["primary", "bg-primary", "주요 행동, 링크"],
  ["secondary", "bg-secondary", "보조 행동, 선택 상태"],
  ["muted", "bg-muted", "비활성 영역, 태그"],
  ["muted-foreground", "bg-muted-foreground", "보조 텍스트"],
  ["accent", "bg-accent", "부드러운 강조 배경"],
  ["highlight", "bg-highlight", "코멘트 핀 전용"],
  ["destructive", "bg-destructive", "삭제·오류"],
  ["border", "bg-border", "구분선, 테두리"],
  ["ring", "bg-ring", "키보드 포커스"],
] as const;

const typeScale = [
  ["Display", "text-5xl font-bold tracking-tight leading-[1.15]", "48 / 1.15 / Bold"],
  ["Heading 1", "text-3xl font-bold tracking-tight", "30 / 1.2 / Bold"],
  ["Heading 2", "text-2xl font-bold leading-snug", "24 / 1.375 / Bold"],
  ["Title", "text-lg font-bold", "18 / 1.55 / Bold"],
  ["Body", "text-base leading-relaxed", "16 / 1.625 / Regular"],
  ["Caption", "text-sm text-muted-foreground", "14 / 1.43 / Regular"],
] as const;

// Tailwind 간격 1단위 = 0.25rem(4px). 이 프로젝트는 아래 단계만 사용합니다.
const spacing = [1, 2, 3, 4, 5, 6, 8, 10] as const;

const radii = [
  ["rounded-sm", "4px", "태그"],
  ["rounded-md", "6px", "버튼·입력"],
  ["rounded-lg", "8px", "기준값 --radius"],
  ["rounded-xl", "12px", "카드"],
] as const;

const breakpoints = [
  ["(기본)", "0", "1열 카드, 모바일"],
  ["sm:", "640px (40rem)", "2열 카드"],
  ["lg:", "1024px (64rem)", "3열 카드, 상세 2단 레이아웃"],
] as const;

const usage = [
  ["Button · Primary", "화면에서 가장 중요한 행동 1개 (작업 올리기, 피드백 남기기)", "한 화면에 Primary 여러 개"],
  ["Button · Outline / Ghost", "보조 행동 (Figma에서 보기, 피드로)", "제출 버튼으로 사용"],
  ["Button · Destructive", "되돌릴 수 없는 삭제. 반드시 확인 단계와 함께", "취소·닫기 같은 일반 동작"],
  ["Badge · 단계(wip/review/final)", "작업 단계 표시 전용", "임의 상태 표시에 재사용"],
  ["코멘트 핀 (pin + highlight)", "피드백 수, 피드백 번호, 로고", "버튼·알림 등 다른 강조"],
  ["Input / Textarea", "항상 Label과 함께, 오류는 aria-invalid로", "placeholder만으로 설명"],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-6">
      <h2 id={id} className="text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="grid gap-14">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">디자인 시스템</h1>
        <p className="max-w-prose text-muted-foreground">
          app/globals.css 의 토큰과 components 의 실제 렌더링입니다. Figma 파일과 나란히 놓고 비교하세요.
        </p>
      </div>

      {/* 1. 디자인 원칙 & 컨셉 */}
      <Section id="ds-principles" title="디자인 원칙">
        <ul className="grid gap-4 md:grid-cols-3">
          {principles.map(([title, desc]) => (
            <li key={title} className="grid content-start gap-2 rounded-xl border bg-card p-5">
              <p className="font-bold">{title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Separator />

      {/* 2. 스타일 가이드 */}
      <Section id="ds-style" title="스타일 가이드">
        <Sub title="색상 토큰">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {colors.map(([name, cls, role]) => (
              <li key={name} className="grid gap-1.5">
                <span className={`h-16 rounded-lg border ${cls}`} />
                <code className="text-xs">--{name}</code>
                <span className="text-xs text-muted-foreground">{role}</span>
              </li>
            ))}
          </ul>
        </Sub>

        <Sub title="타이포그래피 (Pretendard)">
          <ul className="grid gap-4">
            {typeScale.map(([name, cls, spec]) => (
              <li key={name} className="grid items-baseline gap-1 sm:grid-cols-[14rem_1fr]">
                <span className="text-sm text-muted-foreground">{name} · {spec}</span>
                <span className={cls}>디자이너가 코드를 만난 날</span>
              </li>
            ))}
          </ul>
        </Sub>

        <Sub title="간격 (4px 단위)">
          <ul className="grid gap-2">
            {spacing.map((n) => (
              <li key={n} className="grid grid-cols-[8rem_3rem_1fr] items-center gap-3 text-sm whitespace-nowrap">
                <code>p-{n} · gap-{n}</code>
                <span className="text-muted-foreground">{n * 4}px</span>
                <span className="h-3 rounded-sm bg-primary/70" style={{ width: `${n * 0.25}rem` }} />
              </li>
            ))}
          </ul>
        </Sub>

        <div className="grid gap-8 md:grid-cols-2">
          <Sub title="모서리">
            <ul className="flex flex-wrap gap-4">
              {radii.map(([cls, px, use]) => (
                <li key={cls} className="grid justify-items-center gap-1.5 text-xs">
                  <span className={`size-14 border-2 border-primary bg-secondary ${cls}`} />
                  <code>{cls}</code>
                  <span className="text-muted-foreground">{px} · {use}</span>
                </li>
              ))}
            </ul>
          </Sub>

          <Sub title="레이아웃 & 브레이크포인트">
            <p className="text-sm text-muted-foreground">
              콘텐츠 최대 폭 1152px(max-w-6xl), 좌우 여백 20px(px-5). 모바일 퍼스트: 접두사 없는 클래스가 기본이고, 접두사는 그 폭 이상에서만 적용됩니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr><th className="py-1.5 pr-4 font-medium">접두사</th><th className="py-1.5 pr-4 font-medium">최소 폭</th><th className="py-1.5 font-medium">적용</th></tr>
                </thead>
                <tbody>
                  {breakpoints.map(([p, w, d]) => (
                    <tr key={p} className="border-t"><td className="py-1.5 pr-4"><code>{p}</code></td><td className="py-1.5 pr-4">{w}</td><td className="py-1.5">{d}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sub>
        </div>
      </Section>

      <Separator />

      {/* 3. 컴포넌트 라이브러리 */}
      <Section id="ds-components" title="컴포넌트">
        <Sub title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive"><Trash2 /> 삭제</Button>
            <Button variant="link">Link</Button>
            <Button size="icon" aria-label="추가"><Plus /></Button>
            <Button disabled>Disabled</Button>
            <Button disabled aria-busy><Loader2 className="animate-spin" aria-hidden /> 올리는 중…</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Sub>

        <Sub title="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="destructive">destructive</Badge>
            <Badge variant="wip">작업 중</Badge>
            <Badge variant="review">리뷰 요청</Badge>
            <Badge variant="final">최종안</Badge>
          </div>
        </Sub>

        <Sub title="Form">
          <div className="grid max-w-md gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ds-email">이메일</Label>
              <Input id="ds-email" placeholder="you@studio.kr" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ds-err">오류 상태</Label>
              <Input id="ds-err" aria-invalid defaultValue="잘못된 값" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ds-ta">여러 줄</Label>
              <Textarea id="ds-ta" placeholder="내용이 늘어나면 높이가 자동으로 커집니다." />
            </div>
          </div>
        </Sub>

        <Sub title="Project Card (조합 컴포넌트)">
          <div className="max-w-sm">
            <ProjectCard
              preview
              project={{
                title: "샘플 카드",
                summary: "코멘트 핀(왼쪽 아래만 각진 원)이 이 서비스의 시그니처 모양입니다.",
                image_url: null,
                tags: ["샘플"],
                stage: "review",
                created_at: new Date().toISOString(),
                author: { id: "x", display_name: "디발자", role_title: null, avatar_url: null },
                feedback_count: 7,
              }}
            />
          </div>
        </Sub>
      </Section>

      <Separator />

      {/* 4. 운영 가이드라인 */}
      <Section id="ds-usage" title="운영 가이드라인">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">컴포넌트</th>
                <th className="px-4 py-2.5 font-medium">이럴 때 사용</th>
                <th className="px-4 py-2.5 font-medium">이렇게 쓰지 않기</th>
              </tr>
            </thead>
            <tbody>
              {usage.map(([name, use, avoid]) => (
                <tr key={name} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{name}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3 text-muted-foreground">{avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
