import React, { createContext, useContext, useEffect, useState } from "react";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";

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

  const fetchSettings = async () => {
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
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading, error, refetch: fetchSettings }}
    >
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
