import { EmptyState } from "@/components/crit/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="이 작업을 찾을 수 없습니다"
      description="삭제되었거나 주소가 잘못되었습니다. 피드에서 다른 작업을 둘러보세요."
      action={{ href: "/", label: "피드로 이동" }}
    />
  );
}
