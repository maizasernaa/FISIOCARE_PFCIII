
CREATE TABLE public.citas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT,
  especialidad TEXT NOT NULL,
  fisioterapeuta TEXT,
  modalidad TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.citas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.citas TO authenticated;
GRANT ALL ON public.citas TO service_role;

ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can create an appointment via the public booking form
CREATE POLICY "Anyone can create citas"
ON public.citas FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can view their own citas
CREATE POLICY "Users can view their own citas"
ON public.citas FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can update their own citas
CREATE POLICY "Users can update their own citas"
ON public.citas FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can delete their own citas
CREATE POLICY "Users can delete their own citas"
ON public.citas FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
