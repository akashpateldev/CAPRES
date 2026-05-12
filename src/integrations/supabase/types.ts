export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      deadlines: {
        Row: {
          academic_year: string | null
          created_at: string
          deadline_date: string
          description: string | null
          id: string
          is_active: boolean
          project_type: Database["public"]["Enums"]["project_type"]
          title: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          created_at?: string
          deadline_date: string
          description?: string | null
          id?: string
          is_active?: boolean
          project_type: Database["public"]["Enums"]["project_type"]
          title: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          created_at?: string
          deadline_date?: string
          description?: string | null
          id?: string
          is_active?: boolean
          project_type?: Database["public"]["Enums"]["project_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          comments: string | null
          created_at: string
          evaluated_at: string
          evaluator_id: string
          id: string
          marks: number | null
          project_id: string
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          evaluated_at?: string
          evaluator_id: string
          id?: string
          marks?: number | null
          project_id: string
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          evaluated_at?: string
          evaluator_id?: string
          id?: string
          marks?: number | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admission_year: number | null
          avatar_url: string | null
          batch: string | null
          created_at: string
          department: string | null
          email: string
          employee_id: string | null
          entry_type: Database["public"]["Enums"]["entry_type"] | null
          first_name: string
          id: string
          last_name: string
          registration_number: string | null
          roll_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admission_year?: number | null
          avatar_url?: string | null
          batch?: string | null
          created_at?: string
          department?: string | null
          email: string
          employee_id?: string | null
          entry_type?: Database["public"]["Enums"]["entry_type"] | null
          first_name: string
          id?: string
          last_name: string
          registration_number?: string | null
          roll_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admission_year?: number | null
          avatar_url?: string | null
          batch?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employee_id?: string | null
          entry_type?: Database["public"]["Enums"]["entry_type"] | null
          first_name?: string
          id?: string
          last_name?: string
          registration_number?: string | null
          roll_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          mime_type: string | null
          project_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          mime_type?: string | null
          project_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          mime_type?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_proposals: {
        Row: {
          abstract: string | null
          academic_year: string | null
          budget: string | null
          created_at: string
          domain: string | null
          guide_name: string | null
          id: string
          project_type: Database["public"]["Enums"]["project_type"]
          review_comments: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          semester: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          submitted_at: string | null
          team_members: string[] | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abstract?: string | null
          academic_year?: string | null
          budget?: string | null
          created_at?: string
          domain?: string | null
          guide_name?: string | null
          id?: string
          project_type: Database["public"]["Enums"]["project_type"]
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          semester?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          submitted_at?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          abstract?: string | null
          academic_year?: string | null
          budget?: string | null
          created_at?: string
          domain?: string | null
          guide_name?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          semester?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          submitted_at?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          abstract: string | null
          academic_year: string | null
          created_at: string
          description: string | null
          guide_name: string | null
          id: string
          project_type: Database["public"]["Enums"]["project_type"]
          proposal_id: string | null
          semester: string | null
          status: Database["public"]["Enums"]["project_status"]
          submission_date: string | null
          tags: string[] | null
          team_members: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abstract?: string | null
          academic_year?: string | null
          created_at?: string
          description?: string | null
          guide_name?: string | null
          id?: string
          project_type: Database["public"]["Enums"]["project_type"]
          proposal_id?: string | null
          semester?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          submission_date?: string | null
          tags?: string[] | null
          team_members?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          abstract?: string | null
          academic_year?: string | null
          created_at?: string
          description?: string | null
          guide_name?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          proposal_id?: string | null
          semester?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          submission_date?: string | null
          tags?: string[] | null
          team_members?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "project_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_current_semester: {
        Args: {
          p_admission_year: number
          p_entry_type: Database["public"]["Enums"]["entry_type"]
        }
        Returns: number
      }
      get_student_eligibility: { Args: { p_semester: number }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_faculty: { Args: never; Returns: boolean }
      is_project_owner: { Args: { _project_id: string }; Returns: boolean }
      is_student: { Args: never; Returns: boolean }
      parse_registration_number: { Args: { reg_number: string }; Returns: Json }
    }
    Enums: {
      app_role: "student" | "faculty" | "admin"
      entry_type: "regular" | "lateral"
      project_status:
        | "draft"
        | "submitted"
        | "under-review"
        | "evaluated"
        | "revision-requested"
      project_type: "mini-project" | "major-project" | "internship"
      proposal_status: "draft" | "submitted" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "faculty", "admin"],
      entry_type: ["regular", "lateral"],
      project_status: [
        "draft",
        "submitted",
        "under-review",
        "evaluated",
        "revision-requested",
      ],
      project_type: ["mini-project", "major-project", "internship"],
      proposal_status: ["draft", "submitted", "approved", "rejected"],
    },
  },
} as const
