export const THEME_STORAGE_KEY = "crit-theme";

/**
 * layout.tsx 의 <head> 에 넣는 초기화 스크립트 — 화면을 그리기 전에 실행되어 깜빡임을 막습니다.
 * 저장된 값이 있으면 그것을, 없으면 OS 설정(prefers-color-scheme)을 따릅니다.
 * (Client Component 파일에서 문자열을 export 하면 서버에서 값이 아니라 참조로 넘어오므로 따로 둡니다.)
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;
