import React, { useState, useEffect } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { supabase } from "../config/supabaseClient";
import { getSkillIcon } from "../utils/techIconMap";
import SectionLoader from "./SectionLoader";

const Tech = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
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
        setError(err.message || "Yetenekler yüklenemedi.");
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return <SectionLoader label="Yetenekler yükleniyor..." />;
  }

  if (error) {
    return (
      <div className='p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center'>
        <p className='text-red-200 text-sm'>{error}</p>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className='p-6 rounded-2xl bg-white/5 border border-white/10 text-center'>
        <p className='text-secondary text-sm'>Henüz yetenek eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {skills.map((technology) => (
        <div className='w-28 h-28' key={technology.id} title={`${technology.name} – %${technology.seviye}`}>
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
