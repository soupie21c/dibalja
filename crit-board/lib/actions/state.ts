/** Server Action 이 폼에 돌려주는 공통 상태 형태 */
export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialState: ActionState = { ok: false };
