"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

/**
 * 다크 모드 토글 — <html class="dark"> 를 켜고 끕니다.
 * globals.css 의 `.dark { … }` 토큰이 그대로 적용되므로 컴포넌트는 아무것도 바꿀 필요가 없습니다.
 * 처음 그릴 때 깜빡임이 없도록 초기 클래스는 layout.tsx 의 인라인 스크립트가 먼저 정합니다.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // 저장소를 쓸 수 없어도 토글 자체는 동작합니다.
    }
    setDark(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      aria-pressed={dark ?? undefined}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

