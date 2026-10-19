"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/lib/actions/projects";

/** 확인 대화상자를 띄운 뒤에만 서버 액션 실행 */
export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form
      action={deleteProject.bind(null, projectId)}
      onSubmit={(e) => {
        if (!confirm("이 작업과 모든 피드백을 삭제할까요? 되돌릴 수 없습니다.")) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" className="text-destructive">
        <Trash2 /> 작업 삭제
      </Button>
    </form>
  );
}
