import { supabase } from "@/integrations/supabase/client";

export type Especialidad = { id: string; nombre: string; descripcion: string | null };

export type FisioListItem = {
  id: string;
  nombre: string;
  foto_url: string | null;
  colegiatura: string | null;
  anos_experiencia: number;
  modalidades: string[];
  distritos_cobertura: string[];
  calificacion: number;
  total_resenas: number;
  documentos_validados: boolean;
  bio: string | null;
  especialidades: Especialidad[];
  precio_min: number; // min tarifa
};

export type Tarifa = {
  id: string;
  modalidad: string;
  especialidad_id: string | null;
  precio: number;
};

export async function fetchEspecialidades(): Promise<Especialidad[]> {
  const { data, error } = await supabase.from("especialidades").select("*").order("nombre");
  if (error) throw error;
  return data ?? [];
}

export async function fetchFisios(): Promise<FisioListItem[]> {
  const { data: fisios, error } = await supabase
    .from("fisioterapeutas")
    .select(`
      id, foto_url, colegiatura, anos_experiencia, modalidades,
      distritos_cobertura, calificacion, total_resenas, documentos_validados, bio
    `);
  if (error) throw error;
  if (!fisios?.length) return [];

  const ids = fisios.map((f) => f.id);

  const [{ data: perfiles }, { data: feRows }, { data: tarifas }, { data: especialidades }] =
    await Promise.all([
      supabase.from("perfiles").select("id, nombre_completo").in("id", ids),
      supabase.from("fisioterapeuta_especialidades").select("*").in("fisioterapeuta_id", ids),
      supabase.from("fisioterapeuta_tarifas").select("*").in("fisioterapeuta_id", ids),
      supabase.from("especialidades").select("*"),
    ]);

  const perfilMap = new Map((perfiles ?? []).map((p) => [p.id, p.nombre_completo]));
  const espMap = new Map((especialidades ?? []).map((e) => [e.id, e]));

  return fisios.map((f) => {
    const espIds = (feRows ?? []).filter((r) => r.fisioterapeuta_id === f.id).map((r) => r.especialidad_id);
    const fisioTarifas = (tarifas ?? []).filter((t) => t.fisioterapeuta_id === f.id);
    const precios = fisioTarifas.map((t) => Number(t.precio));
    return {
      id: f.id,
      nombre: perfilMap.get(f.id) ?? "Fisioterapeuta",
      foto_url: f.foto_url,
      colegiatura: f.colegiatura,
      anos_experiencia: f.anos_experiencia ?? 0,
      modalidades: f.modalidades ?? [],
      distritos_cobertura: f.distritos_cobertura ?? [],
      calificacion: Number(f.calificacion ?? 0),
      total_resenas: f.total_resenas ?? 0,
      documentos_validados: f.documentos_validados ?? false,
      bio: f.bio,
      especialidades: espIds.map((id) => espMap.get(id)).filter(Boolean) as Especialidad[],
      precio_min: precios.length ? Math.min(...precios) : 0,
    };
  });
}

export async function fetchFisioById(id: string): Promise<{
  fisio: FisioListItem;
  tarifas: Tarifa[];
} | null> {
  const { data: f, error } = await supabase
    .from("fisioterapeutas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!f) return null;

  const [{ data: perfil }, { data: feRows }, { data: tarifas }, { data: especialidades }] =
    await Promise.all([
      supabase.from("perfiles").select("nombre_completo").eq("id", id).maybeSingle(),
      supabase.from("fisioterapeuta_especialidades").select("*").eq("fisioterapeuta_id", id),
      supabase.from("fisioterapeuta_tarifas").select("*").eq("fisioterapeuta_id", id),
      supabase.from("especialidades").select("*"),
    ]);

  const espMap = new Map((especialidades ?? []).map((e) => [e.id, e]));
  const espList = (feRows ?? []).map((r) => espMap.get(r.especialidad_id)).filter(Boolean) as Especialidad[];
  const precios = (tarifas ?? []).map((t) => Number(t.precio));

  return {
    fisio: {
      id: f.id,
      nombre: perfil?.nombre_completo ?? "Fisioterapeuta",
      foto_url: f.foto_url,
      colegiatura: f.colegiatura,
      anos_experiencia: f.anos_experiencia ?? 0,
      modalidades: f.modalidades ?? [],
      distritos_cobertura: f.distritos_cobertura ?? [],
      calificacion: Number(f.calificacion ?? 0),
      total_resenas: f.total_resenas ?? 0,
      documentos_validados: f.documentos_validados ?? false,
      bio: f.bio,
      especialidades: espList,
      precio_min: precios.length ? Math.min(...precios) : 0,
    },
    tarifas: (tarifas ?? []).map((t) => ({
      id: t.id,
      modalidad: t.modalidad,
      especialidad_id: t.especialidad_id,
      precio: Number(t.precio),
    })),
  };
}
