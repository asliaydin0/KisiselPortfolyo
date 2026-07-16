-- ============================================================
-- Kişisel Portföy – Supabase Veritabanı Şeması
-- Supabase Dashboard > SQL Editor'de çalıştırın.
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLOLAR
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik        TEXT NOT NULL,
  aciklama      TEXT,
  teknolojiler  TEXT[] DEFAULT '{}',
  github_url    TEXT,
  live_url      TEXT,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sirket_adi       TEXT NOT NULL,
  pozisyon         TEXT NOT NULL,
  baslangic_tarihi DATE,
  bitis_tarihi     DATE,
  aciklama         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yetenek_adi  TEXT NOT NULL,
  seviye       INTEGER NOT NULL CHECK (seviye >= 0 AND seviye <= 100),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS experiences_updated_at ON public.experiences;
CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS skills_updated_at ON public.skills;
CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------

ALTER TABLE public.projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills      ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (portföy sitesi için)
CREATE POLICY "projects_public_read"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "experiences_public_read"
  ON public.experiences FOR SELECT
  USING (true);

CREATE POLICY "skills_public_read"
  ON public.skills FOR SELECT
  USING (true);

-- Sadece giriş yapmış admin kullanıcılar yazabilir
CREATE POLICY "projects_auth_insert"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "projects_auth_update"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "projects_auth_delete"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "experiences_auth_insert"
  ON public.experiences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "experiences_auth_update"
  ON public.experiences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "experiences_auth_delete"
  ON public.experiences FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "skills_auth_insert"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "skills_auth_update"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "skills_auth_delete"
  ON public.skills FOR DELETE
  TO authenticated
  USING (true);

-- ------------------------------------------------------------
-- 3. STORAGE – Proje kapak fotoğrafları
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS
CREATE POLICY "project_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "project_images_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "project_images_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "project_images_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
