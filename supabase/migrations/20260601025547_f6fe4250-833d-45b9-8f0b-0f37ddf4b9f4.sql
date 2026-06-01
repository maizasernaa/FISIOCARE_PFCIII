-- Drop the old anonymous-friendly insert policy
DROP POLICY IF EXISTS "Anyone can create citas" ON public.citas;

-- Create a new insert policy restricted to authenticated users only
CREATE POLICY "Authenticated users can create their own citas"
ON public.citas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure anon still has no insert access (only SELECT if needed, but we keep anon removed)
-- The existing GRANT already covers authenticated/service_role appropriately.