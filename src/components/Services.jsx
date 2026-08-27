import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import ServiceCard from "./ServiceCard";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { offeredServices as fallbackServices } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";

const mapServiceRow = (row) => ({
  id: row.id,
  title: row.baslik ?? "",
  description: row.aciklama ?? "",
  iconKey: row.ikon ?? "web",
  order: row.sira ?? 0,
});

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
      setError(formatSupabaseError(err));
      setServices(fallbackServices.map(mapServiceRow));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>NE SUNUYORUM?</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Hizmetlerim</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl mx-auto text-center leading-[30px]"
      >
        İhtiyacınıza uygun dijital çözümler sunuyorum. Aşağıdaki alanlarda projelerinizi
        birlikte hayata geçirebiliriz.
      </motion.p>

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
              className={`mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${
                error ? "opacity-90" : ""
              }`}
            >
              {services.map((service, index) => (
                <ServiceCard key={service.id} index={index} {...service} />
              ))}
            </div>
          )}

          <motion.div
            variants={fadeIn("up", "spring", 0.3, 0.75)}
            className="mt-12 flex justify-center"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#915EFF] hover:bg-[#7b4de5] text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#915EFF]/20"
            >
              Proje Teklifi Al
            </a>
          </motion.div>
        </>
      )}
    </>
  );
};

export default SectionWrapper(Services, "services");
