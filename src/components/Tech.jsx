import React, { useState, useEffect } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { getSkillIcon } from "../utils/techIconMap";
import { technologies as fallbackTechnologies } from "../constants";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";

const Tech = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = assertSupabaseClient();
      const { data, error: fetchError } = await client
        .from("skills")
        .select("*")
        .order("seviye", { ascending: false });

      if (fetchError) throw fetchError;

      setSkills(
        (data || []).map((row) => ({
          id: row.id,
          name: row.yetenek_adi,
          icon: getSkillIcon(row.yetenek_adi),
          seviye: row.seviye,
        }))
      );
    } catch (err) {
      console.error("Yetenekler yüklenirken hata:", err);
      setError(formatSupabaseError(err));
      setSkills(
        fallbackTechnologies.map((tech, index) => ({
          id: `fallback-${index}`,
          name: tech.name,
          icon: tech.icon,
          seviye: 80,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  if (loading) {
    return <SectionLoader label="Yetenekler yükleniyor..." />;
  }

  return (
    <>
      {error && <DataFetchError message={error} onRetry={fetchSkills} />}
      {skills.length === 0 && !error ? (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-secondary text-sm">Henüz yetenek eklenmemiş.</p>
        </div>
      ) : (
        <div className={`flex flex-row flex-wrap justify-center gap-10 ${error ? "mt-8" : ""}`}>
          {skills.map((technology) => (
            <div
              className="w-28 h-28"
              key={technology.id}
              title={`${technology.name} – %${technology.seviye}`}
            >
              <BallCanvas icon={technology.icon} name={technology.name} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Tech, "");
