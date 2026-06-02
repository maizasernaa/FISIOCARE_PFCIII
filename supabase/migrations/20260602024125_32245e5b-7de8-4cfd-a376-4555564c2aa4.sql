
-- Restrict EXECUTE on internal trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_cita_estado() FROM PUBLIC, anon, authenticated;

-- Tighten notif insert policy (trigger uses SECURITY DEFINER so it bypasses RLS)
DROP POLICY IF EXISTS "notif_insert_authenticated" ON public.notificaciones_alertas;
CREATE POLICY "notif_insert_own" ON public.notificaciones_alertas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
