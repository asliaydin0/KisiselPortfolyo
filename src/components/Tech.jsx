import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { TechBallsCanvas, resolveIconFor3D } from "./canvas/Ball";
import { SectionWrapper } from "../hoc";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import { getSkillIcon } from "../utils/techIconMap";
import { technologies as fallbackTechnologies } from "../constants";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";
import ErrorBoundary from "./ErrorBoundary";

const mapSkillRow = (row) => {
  const name = row.yetenek_adi ?? "";
  const icon = resolveIconFor3D(name, getSkillIcon(name));

  return {
    id: row.id,
    name,
    icon,
    seviye: row.seviye ?? 0,
  };
};

const Tech = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

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
          icon: resolveIconFor3D(tech.name ?? "", tech.icon),
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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  const canvasSkills = useMemo(
    () => skills.map(({ id, name, icon }) => ({ id, name, icon })),
    [skills]
  );

  if (loading) {
    return <SectionLoader label="Yetenekler yükleniyor..." />;
  }

  return (
    <div ref={sectionRef}>
      {error && <DataFetchError message={error} onRetry={fetchSkills} />}
      {skills.length === 0 && !error ? (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-secondary text-sm">Henüz yetenek eklenmemiş.</p>
        </div>
      ) : (
        <div className={error ? "mt-8" : ""}>
          <ErrorBoundary message="Yetenek ikonları yüklenemedi.">
            {inView ? (
              <TechBallsCanvas skills={canvasSkills} />
            ) : (
              <SectionLoader label="3D ikonlar hazırlanıyor..." />
            )}
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Tech, "");
