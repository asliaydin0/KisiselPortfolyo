import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { starbucks, tesla, shopify, meta } from "../assets";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { supabase } from "../config/supabaseClient";
import SectionLoader from "./SectionLoader";

const COMPANY_ICONS = [starbucks, tesla, shopify, meta];
const ICON_BGS = ["#383E56", "#E6DEDD", "#383E56", "#E6DEDD"];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });
};

const mapExperience = (row, index) => {
  const start = formatDate(row.baslangic_tarihi);
  const end = row.bitis_tarihi ? formatDate(row.bitis_tarihi) : "Devam Ediyor";
  const date = start ? (end ? `${start} – ${end}` : start) : end;

  const points = row.aciklama
    ? row.aciklama.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  return {
    id: row.id,
    title: row.pozisyon,
    company_name: row.sirket_adi,
    date,
    points,
    icon: COMPANY_ICONS[index % COMPANY_ICONS.length],
    iconBg: ICON_BGS[index % ICON_BGS.length],
  };
};

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      {experience.points.length > 0 && (
        <ul className='mt-5 list-disc ml-5 space-y-2'>
          {experience.points.map((point, index) => (
            <li
              key={`experience-point-${experience.id}-${index}`}
              className='text-white-100 text-[14px] pl-1 tracking-wider'
            >
              {point}
            </li>
          ))}
        </ul>
      )}
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("experiences")
          .select("*")
          .order("baslangic_tarihi", { ascending: false });

        if (fetchError) throw fetchError;

        setExperiences((data || []).map(mapExperience));
      } catch (err) {
        console.error("Deneyimler yüklenirken hata:", err);
        setError(err.message || "Deneyimler yüklenemedi.");
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          Şimdiye kadar ne yaptım?
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Deneyimlerim
        </h2>
      </motion.div>

      {loading ? (
        <SectionLoader label="Deneyimler yükleniyor..." />
      ) : error ? (
        <div className='mt-20 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center'>
          <p className='text-red-200 text-sm'>{error}</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className='mt-20 p-6 rounded-2xl bg-white/5 border border-white/10 text-center'>
          <p className='text-secondary text-sm'>Henüz deneyim eklenmemiş.</p>
        </div>
      ) : (
        <div className='mt-20 flex flex-col'>
          <VerticalTimeline>
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
              />
            ))}
          </VerticalTimeline>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Experience, "work");
