import React, { useState, useEffect } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { supabase } from "../config/supabaseClient";
import SectionLoader from "./SectionLoader";

const TAG_COLORS = ["blue-text-gradient", "green-text-gradient", "pink-text-gradient"];

const mapProject = (row) => ({
  id: row.id,
  name: row.baslik,
  description: row.aciklama,
  image: row.image_url,
  source_code_link: row.github_url,
  live_url: row.live_url,
  tags: (row.teknolojiler || []).map((name, i) => ({
    name,
    color: TAG_COLORS[i % TAG_COLORS.length],
  })),
});

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          {image ? (
            <img
              src={image}
              alt={name}
              className='w-full h-full object-cover rounded-2xl'
            />
          ) : (
            <div className='w-full h-full rounded-2xl bg-primary/60 border border-white/10 flex items-center justify-center'>
              <span className='text-4xl opacity-40'>📁</span>
            </div>
          )}

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            {source_code_link && (
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img
                  src={github}
                  alt='source code'
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setProjects((data || []).map(mapProject));
      } catch (err) {
        console.error("Projeler yüklenirken hata:", err);
        setError(err.message || "Projeler yüklenemedi.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>KENDİ ÇALIŞMALARIM</p>
        <h2 className={`${styles.sectionHeadText}`}>Projelerim</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Eğitim sürecimde ve kişisel çalışmalarımda geliştirdiğim çeşitli projelerle 
          hem teknik becerilerimi hem de problem çözme yeteneklerimi pekiştirdim. 
          Takım çalışmaları, freelance işler ve sosyal sorumluluk projeleri gibi farklı 
          alanlarda edindiğim deneyimler, yazılım dünyasındaki yolculuğumu güçlendirdi. 
          Burada, üzerinde çalıştığım bazı önemli projeleri bulabilirsiniz.
        </motion.p>
      </div>

      {loading ? (
        <SectionLoader label="Projeler yükleniyor..." />
      ) : error ? (
        <div className='mt-20 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center'>
          <p className='text-red-200 text-sm'>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className='mt-20 p-6 rounded-2xl bg-white/5 border border-white/10 text-center'>
          <p className='text-secondary text-sm'>Henüz proje eklenmemiş.</p>
        </div>
      ) : (
        <div className='mt-20 flex flex-wrap gap-7'>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} index={index} {...project} />
          ))}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, "projects");
