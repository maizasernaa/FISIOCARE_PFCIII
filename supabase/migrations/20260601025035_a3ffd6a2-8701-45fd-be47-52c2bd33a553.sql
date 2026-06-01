
DROP POLICY "Anyone can create citas" ON public.citas;

CREATE POLICY "Anyone can create citas"
ON public.citas FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());
