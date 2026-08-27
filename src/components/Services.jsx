import React, { useState, useEffect, useCallback } from "react";
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
  { value: "6+", label: "Hizmet" },
  { value: "100%", label: "Özel" },
  { value: "∞", label: "Destek" },
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

  return (
    <div className="relative">
      <div
        aria-hidden
        className="hidden sm:block absolute -top-32 left-1/2 -translate-x-1/2 w-[min(720px,90vw)] h-[320px] bg-[#915EFF]/8 blur-[100px] rounded-full pointer-events-none"
      />

      <motion.div variants={textVariant()} className="relative text-center sm:text-left">
        <p className={styles.sectionSubText}>Hizmetler</p>
        <h2 className={`${styles.sectionHeadText} mt-1`}>Ne Sunuyorum?</h2>
      </motion.div>

      <motion.p variants={fadeIn("", "", 0.1, 1)} className={`${styles.sectionLead} text-center sm:text-left mx-auto sm:mx-0`}>
        <span className="sm:hidden">Markanıza özel dijital çözümler.</span>
        <span className="hidden sm:inline">
          Markanızı dijitale taşıyan, kullanıcı odaklı ve modern çözümler sunuyorum.
        </span>
      </motion.p>

      <motion.div
        variants={fadeIn("up", "spring", 0.15, 0.7)}
        className="hidden sm:grid mt-8 grid-cols-3 gap-4 max-w-md"
      >
        {HIGHLIGHT_STATS.map((stat) => (
          <div
            key={stat.label}
            className="text-center py-3 px-2 rounded-lg bg-white/[0.02] border border-white/[0.06]"
          >
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[11px] text-secondary mt-0.5 tracking-wide">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {loading ? (
        <SectionLoader label="Hizmetler yükleniyor..." />
      ) : (
        <>
          {error && <DataFetchError message={error} onRetry={fetchServices} />}

          {services.length === 0 && !error ? (
            <div className="mt-10 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-secondary text-sm">Henüz hizmet eklenmemiş.</p>
            </div>
          ) : (
            <div
              className={`relative mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${
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
            className="relative mt-10 sm:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-7 rounded-xl border border-white/[0.08] bg-white/[0.02]"
          >
            <p className="text-white text-[15px] sm:text-base font-medium text-center sm:text-left">
              Projeniz için teklif almak ister misiniz?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#915EFF] hover:bg-[#7b4de5] text-white text-sm font-medium transition-colors w-full sm:w-auto min-h-[44px] shrink-0"
            >
              İletişime Geç
            </a>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SectionWrapper(Services, "services");
