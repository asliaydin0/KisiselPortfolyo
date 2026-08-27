import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { updateFavicon } from "../utils/updateFavicon";
import { updateSocialMeta } from "../utils/updateSocialMeta";
import { getShareImageUrl, withShareImageVersion } from "../utils/shareImage";

export const SETTINGS_ID = 1;

export const DEFAULT_SITE_SETTINGS = {
  id: SETTINGS_ID,
  logo_url: "/logo.png",
  profile_img_url: null,
  hero_title: "Merhaba, Ben Aslı",
  hero_subtitle:
    "Bilgisayar Teknolojisi ve Bilişim Sistemleri öğrencisiyim.\nYazılım geliştirme ve yaratıcı projeler üretme tutkusu ile yol alıyorum.",
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  loading: true,
  error: null,
  refetch: () => {},
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = assertSupabaseClient();
      const { data, error: fetchError } = await client
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .single();

      if (fetchError) throw fetchError;

      setSettings({
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        logo_url: data.logo_url || DEFAULT_SITE_SETTINGS.logo_url,
      });
    } catch (err) {
      console.error("Site ayarları yüklenirken hata:", err);
      setError(formatSupabaseError(err));
      setSettings(DEFAULT_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const logoUrl = settings.logo_url || DEFAULT_SITE_SETTINGS.logo_url;
    updateFavicon(logoUrl);

    const shareImageUrl = withShareImageVersion(getShareImageUrl(), settings.updated_at);
    const heroTitle = settings.hero_title || DEFAULT_SITE_SETTINGS.hero_title;
    const heroSubtitle = settings.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle;

    updateSocialMeta({
      title: `${heroTitle} | Kişisel Portföy`,
      description: heroSubtitle.replace(/\n/g, " "),
      imageUrl: shareImageUrl || logoUrl,
    });
  }, [settings.logo_url, settings.hero_title, settings.hero_subtitle, settings.updated_at]);

  const value = useMemo(
    () => ({ settings, loading, error, refetch: fetchSettings }),
    [settings, loading, error, fetchSettings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const renderHeroTitle = (title) => {
  const text = title || DEFAULT_SITE_SETTINGS.hero_title;
  const match = text.match(/^(.+?\sBen\s)(.+)$/i);

  if (match) {
    return { prefix: match[1], highlight: match[2] };
  }

  return { prefix: text, highlight: null };
};
