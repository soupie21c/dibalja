/**
 * Supabase 타입 정의
 * 실무에서는 아래 명령으로 자동 생성합니다 (이 파일을 덮어씀):
 *   npx supabase gen types typescript --project-id <프로젝트ID> > lib/database.types.ts
 * 강의에서는 구조를 이해하기 위해 같은 형식으로 직접 작성했습니다.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          role_title: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          role_title?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          summary: string;
          image_url: string | null;
          figma_url: string | null;
          tags: string[];
          stage: "wip" | "review" | "final";
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          summary: string;
          image_url?: string | null;
          figma_url?: string | null;
          tags?: string[];
          stage?: "wip" | "review" | "final";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "projects_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: {
          id: string;
          project_id: string;
          author_id: string;
          body: string;
          kind: "praise" | "suggestion" | "question";
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          author_id: string;
          body: string;
          kind?: "praise" | "suggestion" | "question";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feedback"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "feedback_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      reactions: {
        Row: {
          project_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reactions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
