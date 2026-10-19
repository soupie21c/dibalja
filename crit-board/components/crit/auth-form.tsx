"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { signIn, signUp } from "@/lib/actions/auth";
import { initialState } from "@/lib/actions/state";

/** 로그인 / 회원가입 전환 폼 — 모드마다 다른 Server Action 을 씁니다. */
export function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction] = useActionState(signIn, initialState);
  const [signUpState, signUpAction] = useActionState(signUp, initialState);

  const isSignUp = mode === "signup";
  const state = isSignUp ? signUpState : signInState;
  const err = state.fieldErrors ?? {};

  return (
    <form action={isSignUp ? signUpAction : signInAction} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      {isSignUp && (
        <div className="grid gap-2">
          <Label htmlFor="display_name">이름</Label>
          <Input id="display_name" name="display_name" required maxLength={30} autoComplete="nickname" aria-describedby="name-error" />
          <FieldError id="name-error" errors={err.display_name} />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" aria-describedby="email-error" />
        <FieldError id="email-error" errors={err.email} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete={isSignUp ? "new-password" : "current-password"} aria-describedby="pw-error" />
        <FieldError id="pw-error" errors={err.password} />
      </div>
      <FormMessage ok={state.ok} message={state.message} />
      <SubmitButton size="lg" pendingText="확인 중…">
        {isSignUp ? "가입하기" : "로그인"}
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? "이미 계정이 있나요? " : "처음이신가요? "}
        <button type="button" onClick={() => setMode(isSignUp ? "signin" : "signup")} className="font-medium text-primary underline-offset-4 hover:underline">
          {isSignUp ? "로그인" : "가입하기"}
        </button>
      </p>
    </form>
  );
}
