-- Deneyim ikon sütunu
-- Supabase Dashboard > SQL Editor'de çalıştırın.

ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS ikon TEXT DEFAULT 'work';

-- PostgREST şema önbelleğini yenile (hemen tanınsın)
NOTIFY pgrst, 'reload schema';
