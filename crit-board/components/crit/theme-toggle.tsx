"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

/** <html> 의 class 가 바뀔 때마다 알려 주는 구독 함수 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const isDark = () => document.documentElement.classList.contains("dark");
const serverSnapshot = () => null; // 서버에서는 아직 모름 → 아이콘은 브라우저에서 결정

/**
 * 다크 모드 토글 — <html class="dark"> 를 켜고 끕니다.
 * globals.css 의 `.dark { … }` 토큰이 그대로 적용되므로 컴포넌트는 아무것도 바꿀 필요가 없습니다.
 * 처음 그릴 때 깜빡임이 없도록 초기 클래스는 layout.tsx 의 인라인 스크립트가 먼저 정합니다.
 * 현재 상태는 state 로 따로 들고 있지 않고 <html> 의 class 를 그대로 읽습니다(useSyncExternalStore).
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore<boolean | null>(subscribe, isDark, serverSnapshot);

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // 저장소를 쓸 수 없어도 토글 자체는 동작합니다.
    }
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
