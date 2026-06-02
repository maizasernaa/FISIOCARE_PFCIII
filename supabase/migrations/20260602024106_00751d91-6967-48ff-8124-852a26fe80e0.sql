
-- Drop old citas table (replaced by new schema)
DROP TABLE IF EXISTS public.citas CASCADE;

-- ============== PERFILES ==============
CREATE TABLE public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL DEFAULT '',
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'paciente' CHECK (rol IN ('paciente','fisioterapeuta')),
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfiles TO authenticated;
GRANT ALL ON public.perfiles TO service_role;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perfiles_select_all_authenticated" ON public.perfiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "perfiles_insert_own" ON public.perfiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "perfiles_update_own" ON public.perfiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, telefono, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'nombre_completo', ''),
    NEW.raw_user_meta_data->>'telefono',
    COALESCE(NEW.raw_user_meta_data->>'rol', 'paciente')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== ESPECIALIDADES ==============
CREATE TABLE public.especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT
);
GRANT SELECT ON public.especialidades TO anon, authenticated;
GRANT ALL ON public.especialidades TO service_role;
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "especialidades_public_read" ON public.especialidades
  FOR SELECT USING (true);

INSERT INTO public.especialidades (nombre, descripcion) VALUES
  ('Traumatológica', 'Recuperación de lesiones musculoesqueléticas'),
  ('Deportiva', 'Rehabilitación y prevención en atletas'),
  ('Neurológica', 'Tratamiento de afecciones del sistema nervioso'),
  ('Pediátrica', 'Atención fisioterapéutica infantil'),
  ('Geriátrica', 'Cuidado físico del adulto mayor'),
  ('Respiratoria', 'Rehabilitación pulmonar y respiratoria'),
  ('Postoperatoria', 'Recuperación tras intervenciones quirúrgicas'),
  ('Dolor crónico', 'Manejo del dolor persistente');

-- ============== FISIOTERAPEUTAS ==============
CREATE TABLE public.fisioterapeutas (
  id UUID PRIMARY KEY REFERENCES public.perfiles(id) ON DELETE CASCADE,
  colegiatura TEXT,
  anos_experiencia INTEGER DEFAULT 0,
  foto_url TEXT,
  modalidades TEXT[] DEFAULT '{}',
  distritos_cobertura TEXT[] DEFAULT '{}',
  calificacion NUMERIC(3,2) DEFAULT 0,
  total_resenas INTEGER DEFAULT 0,
  disponibilidad BOOLEAN DEFAULT true,
  documentos_validados BOOLEAN DEFAULT false,
  url_diploma TEXT,
  url_colegiatura TEXT,
  url_dni TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fisioterapeutas TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.fisioterapeutas TO authenticated;
GRANT ALL ON public.fisioterapeutas TO service_role;
ALTER TABLE public.fisioterapeutas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fisios_public_read" ON public.fisioterapeutas FOR SELECT USING (true);
CREATE POLICY "fisios_insert_own" ON public.fisioterapeutas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "fisios_update_own" ON public.fisioterapeutas
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============== FISIOTERAPEUTA_ESPECIALIDADES ==============
CREATE TABLE public.fisioterapeuta_especialidades (
  fisioterapeuta_id UUID NOT NULL REFERENCES public.fisioterapeutas(id) ON DELETE CASCADE,
  especialidad_id UUID NOT NULL REFERENCES public.especialidades(id) ON DELETE CASCADE,
  PRIMARY KEY (fisioterapeuta_id, especialidad_id)
);
GRANT SELECT ON public.fisioterapeuta_especialidades TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.fisioterapeuta_especialidades TO authenticated;
GRANT ALL ON public.fisioterapeuta_especialidades TO service_role;
ALTER TABLE public.fisioterapeuta_especialidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fe_public_read" ON public.fisioterapeuta_especialidades FOR SELECT USING (true);
CREATE POLICY "fe_insert_own" ON public.fisioterapeuta_especialidades
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = fisioterapeuta_id);
CREATE POLICY "fe_delete_own" ON public.fisioterapeuta_especialidades
  FOR DELETE TO authenticated USING (auth.uid() = fisioterapeuta_id);

-- ============== FISIOTERAPEUTA_TARIFAS ==============
CREATE TABLE public.fisioterapeuta_tarifas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fisioterapeuta_id UUID NOT NULL REFERENCES public.fisioterapeutas(id) ON DELETE CASCADE,
  modalidad TEXT NOT NULL,
  especialidad_id UUID REFERENCES public.especialidades(id) ON DELETE SET NULL,
  precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0)
);
GRANT SELECT ON public.fisioterapeuta_tarifas TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.fisioterapeuta_tarifas TO authenticated;
GRANT ALL ON public.fisioterapeuta_tarifas TO service_role;
ALTER TABLE public.fisioterapeuta_tarifas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tarifas_public_read" ON public.fisioterapeuta_tarifas FOR SELECT USING (true);
CREATE POLICY "tarifas_insert_own" ON public.fisioterapeuta_tarifas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = fisioterapeuta_id);
CREATE POLICY "tarifas_update_own" ON public.fisioterapeuta_tarifas
  FOR UPDATE TO authenticated USING (auth.uid() = fisioterapeuta_id);
CREATE POLICY "tarifas_delete_own" ON public.fisioterapeuta_tarifas
  FOR DELETE TO authenticated USING (auth.uid() = fisioterapeuta_id);

-- ============== CITAS ==============
CREATE TABLE public.citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  fisioterapeuta_id UUID NOT NULL REFERENCES public.fisioterapeutas(id) ON DELETE CASCADE,
  fecha_cita DATE NOT NULL,
  hora_cita TIME,
  modalidad TEXT NOT NULL,
  distrito_cruce TEXT,
  direccion_exacta TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','completada','cancelada','reprogramada')),
  notas_fisioterapeuta TEXT,
  ejercicios_recomendados TEXT,
  especialidad_id UUID REFERENCES public.especialidades(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.citas TO authenticated;
GRANT ALL ON public.citas TO service_role;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "citas_select_involved" ON public.citas
  FOR SELECT TO authenticated USING (auth.uid() = paciente_id OR auth.uid() = fisioterapeuta_id);
CREATE POLICY "citas_insert_paciente" ON public.citas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = paciente_id);
CREATE POLICY "citas_update_involved" ON public.citas
  FOR UPDATE TO authenticated USING (auth.uid() = paciente_id OR auth.uid() = fisioterapeuta_id);
CREATE POLICY "citas_delete_paciente" ON public.citas
  FOR DELETE TO authenticated USING (auth.uid() = paciente_id);

-- ============== PAGOS ==============
CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID NOT NULL REFERENCES public.citas(id) ON DELETE CASCADE,
  monto NUMERIC(10,2) NOT NULL,
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('Yape','Plin','Tarjeta')),
  estado_pago TEXT NOT NULL DEFAULT 'pendiente',
  fecha_pago TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pagos TO authenticated;
GRANT ALL ON public.pagos TO service_role;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pagos_select_involved" ON public.pagos
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.citas c WHERE c.id = cita_id AND (auth.uid() = c.paciente_id OR auth.uid() = c.fisioterapeuta_id))
  );
CREATE POLICY "pagos_insert_paciente" ON public.pagos
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.citas c WHERE c.id = cita_id AND auth.uid() = c.paciente_id)
  );

-- ============== NOTIFICACIONES_ALERTAS ==============
CREATE TABLE public.notificaciones_alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  canal TEXT NOT NULL DEFAULT 'in-app',
  estado_envio TEXT NOT NULL DEFAULT 'pendiente',
  mensaje TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notificaciones_alertas TO authenticated;
GRANT ALL ON public.notificaciones_alertas TO service_role;
ALTER TABLE public.notificaciones_alertas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select_own" ON public.notificaciones_alertas
  FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "notif_insert_authenticated" ON public.notificaciones_alertas
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notif_update_own" ON public.notificaciones_alertas
  FOR UPDATE TO authenticated USING (auth.uid() = usuario_id);

-- Trigger to log notification on cita state change
CREATE OR REPLACE FUNCTION public.notify_cita_estado()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO public.notificaciones_alertas (usuario_id, tipo, canal, estado_envio, mensaje)
    VALUES (NEW.paciente_id, 'cita_' || NEW.estado, 'in-app', 'enviada',
            'Tu cita del ' || NEW.fecha_cita || ' cambió a ' || NEW.estado);
    INSERT INTO public.notificaciones_alertas (usuario_id, tipo, canal, estado_envio, mensaje)
    VALUES (NEW.fisioterapeuta_id, 'cita_' || NEW.estado, 'in-app', 'enviada',
            'Cita del ' || NEW.fecha_cita || ' cambió a ' || NEW.estado);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_cita_estado_change ON public.citas;
CREATE TRIGGER on_cita_estado_change
  AFTER UPDATE ON public.citas
  FOR EACH ROW EXECUTE FUNCTION public.notify_cita_estado();

-- Indexes
CREATE INDEX idx_citas_paciente ON public.citas(paciente_id);
CREATE INDEX idx_citas_fisio ON public.citas(fisioterapeuta_id);
CREATE INDEX idx_tarifas_fisio ON public.fisioterapeuta_tarifas(fisioterapeuta_id);
CREATE INDEX idx_fe_fisio ON public.fisioterapeuta_especialidades(fisioterapeuta_id);
