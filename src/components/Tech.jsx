import React, { useState, useEffect, useCallback, useMemo } from "react";

import { TechBallsCanvas } from "./canvas/Ball";
import { SectionWrapper } from "../hoc";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { getSkillIcon } from "../utils/techIconMap";
import { technologies as fallbackTechnologies } from "../constants";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";
import ErrorBoundary from "./ErrorBoundary";

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

  const canvasSkills = useMemo(
    () =>
      skills.map(({ id, name, icon }) => ({
        id,
        name,
        icon,
      })),
    [skills]
  );

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
        <div className={error ? "mt-8" : ""}>
          <ErrorBoundary message="Yetenek ikonları yüklenemedi.">
            <TechBallsCanvas skills={canvasSkills} />
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Tech, "");
