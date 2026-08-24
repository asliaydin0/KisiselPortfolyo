import { supabase } from "../config/supabaseClient";

export const formatSupabaseError = (err) => {
  if (!err) return "Veriler yüklenemedi.";

  const message = err.message || String(err);

  if (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    err.name === "TypeError"
  ) {
    return (
      "Supabase sunucusuna bağlanılamadı. " +
      "Supabase projenizin aktif (paused değil) olduğundan emin olun, " +
      ".env dosyasındaki VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini kontrol edin " +
      "ve geliştirme sunucusunu yeniden başlatın (npm run dev)."
    );
  }

  if (message.includes("Invalid API key") || message.includes("JWT")) {
    return "Supabase API anahtarı geçersiz. .env dosyasındaki VITE_SUPABASE_ANON_KEY değerini kontrol edin.";
  }

  if (
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("PGRST")
  ) {
    return (
      "Veritabanı tablosu bulunamadı. " +
      "supabase/schema.sql dosyasını Supabase SQL Editor'de çalıştırdığınızdan emin olun."
    );
  }

  return message;
};

export const assertSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      formatSupabaseError({ name: "TypeError", message: "Failed to fetch" })
    );
  }
  return supabase;
};
