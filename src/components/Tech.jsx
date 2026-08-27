import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import TechSkillCard from "./TechSkillCard";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { getSkillIcon } from "../utils/techIconMap";
import { technologies as fallbackTechnologies } from "../constants";
import { textVariant } from "../utils/motion";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";

const mapSkillRow = (row) => ({
  id: row.id,
  name: row.yetenek_adi ?? "",
  icon: getSkillIcon(row.yetenek_adi),
  seviye: row.seviye ?? 0,
});

const Tech = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = assertSupabaseClient();
      const { data, error: fetchError } = await client
        .from("skills")
        .select("*")
        .order("seviye", { ascending: false });

      if (fetchError) throw fetchError;

      setSkills((data || []).map(mapSkillRow));
    } catch (err) {
      console.error("Yetenekler yüklenirken hata:", err);
      setError(formatSupabaseError(err));
      setSkills(
        fallbackTechnologies.map((tech, index) => ({
          id: `fallback-${index}`,
          name: tech.name ?? "",
          icon: tech.icon,
          seviye: 80,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>TEKNOLOJİLER</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Yeteneklerim</h2>
      </motion.div>

      {loading ? (
        <SectionLoader label="Yetenekler yükleniyor..." />
      ) : (
        <>
          {error && <DataFetchError message={error} onRetry={fetchSkills} />}

          {skills.length === 0 && !error ? (
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-secondary text-sm">Henüz yetenek eklenmemiş.</p>
            </div>
          ) : (
            <div
              className={`mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 ${
                error ? "opacity-90" : ""
              }`}
            >
              {skills.map((skill, index) => (
                <TechSkillCard
                  key={skill.id}
                  icon={skill.icon}
                  name={skill.name}
                  seviye={skill.seviye}
                  index={index}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SectionWrapper(Tech, "");
