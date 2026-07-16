-- ============================================================
-- site_settings – Genel site ayarları (logo, profil, hero metinleri)
-- Supabase Dashboard > SQL Editor'de çalıştırın.
-- Not: handle_updated_at fonksiyonu schema.sql'de yoksa aşağıda oluşturulur.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id               INTEGER PRIMARY KEY,
  logo_url         TEXT,
  profile_img_url  TEXT,
  hero_title       TEXT,
  hero_subtitle    TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (id, logo_url, profile_img_url, hero_title, hero_subtitle)
VALUES (
  1,
  NULL,
  NULL,
  'Merhaba, Ben Aslı',
  E'Bilgisayar Teknolojisi ve Bilişim Sistemleri öğrencisiyim.\nYazılım geliştirme ve yaratıcı projeler üretme tutkusu ile yol alıyorum.'
)
ON CONFLICT (id) DO NOTHING;

-- updated_at otomatik güncelleme
DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "site_settings_auth_update"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- STORAGE – Logo ve profil fotoğrafları
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-assets',
  'profile-assets',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "profile_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-assets');

CREATE POLICY "profile_assets_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-assets');

CREATE POLICY "profile_assets_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-assets');

CREATE POLICY "profile_assets_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-assets');
