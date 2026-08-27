-- ============================================================
-- Hizmetler tablosu
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

CREATE TABLE IF NOT EXISTS public.services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik      TEXT NOT NULL,
  aciklama    TEXT,
  ikon        TEXT NOT NULL DEFAULT 'web',
  sira        INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_public_read" ON public.services;
CREATE POLICY "services_public_read"
  ON public.services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "services_authenticated_all" ON public.services;
CREATE POLICY "services_authenticated_all"
  ON public.services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Örnek hizmetler (tablo boşsa bir kez çalıştırın)
INSERT INTO public.services (baslik, aciklama, ikon, sira)
SELECT v.baslik, v.aciklama, v.ikon, v.sira
FROM (VALUES
  ('Web Sitesi Yapımı', 'Kurumsal, kişisel ve e-ticaret siteleri; modern, hızlı ve mobil uyumlu.', 'web', 1),
  ('QR Menü Tasarımı', 'Restoran ve kafeler için dijital menü ve QR kod entegrasyonu.', 'qr-menu', 2),
  ('Mobil Uygulama Yapımı', 'iOS ve Android için kullanıcı dostu native ve cross-platform uygulamalar.', 'mobile', 3),
  ('Dijital Davetiye', 'Düğün, nişan ve etkinlikler için özelleştirilebilir dijital davetiyeler.', 'invitation', 4),
  ('Dijital Albüm Sistemi', 'Fotoğraf ve anılarınızı paylaşabileceğiniz online albüm platformları.', 'album', 5),
  ('Kartvizit Tasarımı', 'Basılı ve dijital kartvizitler; markanıza uygun profesyonel tasarım.', 'business-card', 6)
) AS v(baslik, aciklama, ikon, sira)
WHERE NOT EXISTS (SELECT 1 FROM public.services LIMIT 1);
