import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import ServiceCard from "./ServiceCard";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import {
  formatSupabaseError,
  assertSupabaseClient,
  isMissingTableError,
} from "../utils/supabaseHelpers";
import { offeredServices as fallbackServices } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";

const HIGHLIGHT_STATS = [
  { value: "6+", label: "Hizmet Alanı" },
  { value: "100%", label: "Özel Çözüm" },
  { value: "∞", label: "Revizyon Desteği" },
];

const mapServiceRow = (row) => ({
  id: row.id,
  title: row.baslik ?? "",
  description: row.aciklama ?? "",
  iconKey: row.ikon ?? "web",
  imageUrl: row.gorsel_url ?? null,
  features: Array.isArray(row.ozellikler) ? row.ozellikler : [],
  order: row.sira ?? 0,
});

const isFeaturedIndex = (index, total) =>
  index === 0 || (total > 4 && index === 3);

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = assertSupabaseClient();
      const { data, error: fetchError } = await client
        .from("services")
        .select("*")
        .order("sira", { ascending: true });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map(mapServiceRow);
      setServices(
        mapped.length > 0 ? mapped : fallbackServices.map(mapServiceRow)
      );
    } catch (err) {
      console.error("Hizmetler yüklenirken hata:", err);
      setServices(fallbackServices.map(mapServiceRow));
      if (!isMissingTableError(err)) {
        setError(formatSupabaseError(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const serviceTags = useMemo(
    () => services.map((s) => s.title).filter(Boolean),
    [services]
  );

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[min(720px,90vw)] h-[320px] bg-[#915EFF]/12 blur-[100px] rounded-full pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/2 -right-32 w-64 h-64 bg-[#00cea8]/8 blur-[80px] rounded-full pointer-events-none"
      />

      <motion.div variants={textVariant()} className="relative">
        <p className={`${styles.sectionSubText} text-center`}>NE SUNUYORUM?</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Hizmetlerim</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="relative mt-4 text-secondary text-[17px] max-w-3xl mx-auto text-center leading-[30px]"
      >
        Markanızı dijitale taşıyan, görsel olarak güçlü ve kullanıcı odaklı çözümler
        sunuyorum. Her projeye özel tasarım ve geliştirme ile fark yaratıyorum.
      </motion.p>

      <motion.div
        variants={fadeIn("up", "spring", 0.15, 0.7)}
        className="relative mt-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto"
      >
        {HIGHLIGHT_STATS.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"
          >
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {!loading && serviceTags.length > 0 && (
        <motion.div
          variants={fadeIn("", "", 0.2, 0.8)}
          className="relative mt-8 overflow-hidden"
        >
          <div className="flex gap-3 animate-[scroll_30s_linear_infinite] w-max">
            {[...serviceTags, ...serviceTags].map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-medium text-[#dfd9ff]/80 bg-[#915EFF]/10 border border-[#915EFF]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <SectionLoader label="Hizmetler yükleniyor..." />
      ) : (
        <>
          {error && <DataFetchError message={error} onRetry={fetchServices} />}

          {services.length === 0 && !error ? (
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-secondary text-sm">Henüz hizmet eklenmemiş.</p>
            </div>
          ) : (
            <div
              className={`relative mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ${
                error ? "opacity-90" : ""
              }`}
            >
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  index={index}
                  featured={isFeaturedIndex(index, services.length)}
                  {...service}
                />
              ))}
            </div>
          )}

          <motion.div
            variants={fadeIn("up", "spring", 0.35, 0.75)}
            className="relative mt-14 p-6 sm:p-8 rounded-2xl overflow-hidden border border-[#915EFF]/25 bg-gradient-to-br from-[#915EFF]/15 via-tertiary/80 to-[#00cea8]/10"
          >
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 text-center sm:text-left">
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl">
                  Projeniz için doğru çözümü birlikte bulalım
                </h3>
                <p className="mt-2 text-secondary text-sm max-w-lg">
                  Ücretsiz ön görüşme ile ihtiyacınızı dinleyip size özel teklif hazırlayabilirim.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#915EFF] hover:bg-[#7b4de5] text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#915EFF]/25 shrink-0"
              >
                Ücretsiz Teklif Al
              </a>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SectionWrapper(Services, "services");
