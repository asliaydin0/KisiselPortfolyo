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
    message.includes("schema cache") ||
    message.includes("PGRST")
  ) {
    return (
      "Veritabanı tablosu bulunamadı. " +
      "supabase/services.sql dosyasını Supabase Dashboard > SQL Editor'de çalıştırın."
    );
  }

  return message;
};

export const isMissingTableError = (err) => {
  const message = err?.message || String(err || "");
  return (
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("relation") ||
    (message.includes("PGRST") && message.toLowerCase().includes("table"))
  );
};

export const isMissingColumnError = (err, column) => {
  const message = err?.message || String(err || "");
  const col = column || "";
  return (
    message.includes("schema cache") &&
    (col ? message.includes(`'${col}'`) || message.includes(col) : true)
  );
};

export const assertSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      formatSupabaseError({ name: "TypeError", message: "Failed to fetch" })
    );
  }
  return supabase;
};
