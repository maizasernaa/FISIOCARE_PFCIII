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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      citas: {
        Row: {
          created_at: string
          direccion_exacta: string | null
          distrito_cruce: string | null
          ejercicios_recomendados: string | null
          especialidad_id: string | null
          estado: string
          fecha_cita: string
          fisioterapeuta_id: string
          hora_cita: string | null
          id: string
          modalidad: string
          notas_fisioterapeuta: string | null
          paciente_id: string
        }
        Insert: {
          created_at?: string
          direccion_exacta?: string | null
          distrito_cruce?: string | null
          ejercicios_recomendados?: string | null
          especialidad_id?: string | null
          estado?: string
          fecha_cita: string
          fisioterapeuta_id: string
          hora_cita?: string | null
          id?: string
          modalidad: string
          notas_fisioterapeuta?: string | null
          paciente_id: string
        }
        Update: {
          created_at?: string
          direccion_exacta?: string | null
          distrito_cruce?: string | null
          ejercicios_recomendados?: string | null
          especialidad_id?: string | null
          estado?: string
          fecha_cita?: string
          fisioterapeuta_id?: string
          hora_cita?: string | null
          id?: string
          modalidad?: string
          notas_fisioterapeuta?: string | null
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citas_especialidad_id_fkey"
            columns: ["especialidad_id"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_fisioterapeuta_id_fkey"
            columns: ["fisioterapeuta_id"]
            isOneToOne: false
            referencedRelation: "fisioterapeutas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      especialidades: {
        Row: {
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      fisioterapeuta_especialidades: {
        Row: {
          especialidad_id: string
          fisioterapeuta_id: string
        }
        Insert: {
          especialidad_id: string
          fisioterapeuta_id: string
        }
        Update: {
          especialidad_id?: string
          fisioterapeuta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fisioterapeuta_especialidades_especialidad_id_fkey"
            columns: ["especialidad_id"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fisioterapeuta_especialidades_fisioterapeuta_id_fkey"
            columns: ["fisioterapeuta_id"]
            isOneToOne: false
            referencedRelation: "fisioterapeutas"
            referencedColumns: ["id"]
          },
        ]
      }
      fisioterapeuta_tarifas: {
        Row: {
          especialidad_id: string | null
          fisioterapeuta_id: string
          id: string
          modalidad: string
          precio: number
        }
        Insert: {
          especialidad_id?: string | null
          fisioterapeuta_id: string
          id?: string
          modalidad: string
          precio: number
        }
        Update: {
          especialidad_id?: string | null
          fisioterapeuta_id?: string
          id?: string
          modalidad?: string
          precio?: number
        }
        Relationships: [
          {
            foreignKeyName: "fisioterapeuta_tarifas_especialidad_id_fkey"
            columns: ["especialidad_id"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fisioterapeuta_tarifas_fisioterapeuta_id_fkey"
            columns: ["fisioterapeuta_id"]
            isOneToOne: false
            referencedRelation: "fisioterapeutas"
            referencedColumns: ["id"]
          },
        ]
      }
      fisioterapeutas: {
        Row: {
          anos_experiencia: number | null
          bio: string | null
          calificacion: number | null
          colegiatura: string | null
          created_at: string
          disponibilidad: boolean | null
          distritos_cobertura: string[] | null
          documentos_validados: boolean | null
          foto_url: string | null
          id: string
          modalidades: string[] | null
          total_resenas: number | null
          url_colegiatura: string | null
          url_diploma: string | null
          url_dni: string | null
        }
        Insert: {
          anos_experiencia?: number | null
          bio?: string | null
          calificacion?: number | null
          colegiatura?: string | null
          created_at?: string
          disponibilidad?: boolean | null
          distritos_cobertura?: string[] | null
          documentos_validados?: boolean | null
          foto_url?: string | null
          id: string
          modalidades?: string[] | null
          total_resenas?: number | null
          url_colegiatura?: string | null
          url_diploma?: string | null
          url_dni?: string | null
        }
        Update: {
          anos_experiencia?: number | null
          bio?: string | null
          calificacion?: number | null
          colegiatura?: string | null
          created_at?: string
          disponibilidad?: boolean | null
          distritos_cobertura?: string[] | null
          documentos_validados?: boolean | null
          foto_url?: string | null
          id?: string
          modalidades?: string[] | null
          total_resenas?: number | null
          url_colegiatura?: string | null
          url_diploma?: string | null
          url_dni?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fisioterapeutas_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones_alertas: {
        Row: {
          canal: string
          created_at: string
          estado_envio: string
          id: string
          mensaje: string | null
          tipo: string
          usuario_id: string
        }
        Insert: {
          canal?: string
          created_at?: string
          estado_envio?: string
          id?: string
          mensaje?: string | null
          tipo: string
          usuario_id: string
        }
        Update: {
          canal?: string
          created_at?: string
          estado_envio?: string
          id?: string
          mensaje?: string | null
          tipo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_alertas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          cita_id: string
          estado_pago: string
          fecha_pago: string
          id: string
          metodo_pago: string
          monto: number
        }
        Insert: {
          cita_id: string
          estado_pago?: string
          fecha_pago?: string
          id?: string
          metodo_pago: string
          monto: number
        }
        Update: {
          cita_id?: string
          estado_pago?: string
          fecha_pago?: string
          id?: string
          metodo_pago?: string
          monto?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          fecha_registro: string
          id: string
          nombre_completo: string
          rol: string
          telefono: string | null
        }
        Insert: {
          fecha_registro?: string
          id: string
          nombre_completo?: string
          rol?: string
          telefono?: string | null
        }
        Update: {
          fecha_registro?: string
          id?: string
          nombre_completo?: string
          rol?: string
          telefono?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
