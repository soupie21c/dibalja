import { Badge } from "@/components/ui/badge";
import { STAGE_LABEL, type Stage } from "@/lib/types";

/** 작업 단계 배지 — Badge의 wip/review/final variant를 감싼 도메인 컴포넌트 */
export function StageBadge({ stage }: { stage: Stage }) {
  return <Badge variant={stage}>{STAGE_LABEL[stage]}</Badge>;
}
