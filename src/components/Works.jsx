import React, { useState, useEffect } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { formatSupabaseError, assertSupabaseClient } from "../utils/supabaseHelpers";
import SectionLoader from "./SectionLoader";
import DataFetchError from "./DataFetchError";
import { projects as fallbackProjects } from "../constants";

const TAG_COLORS = ["blue-text-gradient", "green-text-gradient", "pink-text-gradient"];

const mapProject = (row) => ({
  id: row.id,
  name: row.baslik ?? "",
  description: row.aciklama ?? "",
  image: row.image_url,
  source_code_link: row.github_url,
  live_url: row.live_url,
  tags: (row.teknolojiler || []).map((name, i) => ({
    name,
    color: TAG_COLORS[i % TAG_COLORS.length],
  })),
});

const ProjectCardInner = ({ name, description, tags, image, source_code_link, mobile = false }) => (
  <>
    <div className={`relative w-full ${mobile ? "h-[160px]" : "h-[230px]"}`}>
      {image ? (
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover ${mobile ? "rounded-lg" : "rounded-2xl"}`}
        />
      ) : (
        <div
          className={`w-full h-full ${mobile ? "rounded-lg bg-primary/40 border border-white/[0.06]" : "rounded-2xl bg-primary/60 border border-white/10"} flex items-center justify-center`}
        >
          <span className={`${mobile ? "text-2xl opacity-30" : "text-4xl opacity-40"}`}>📁</span>
        </div>
      )}
      {source_code_link && (
        <div className={`absolute inset-0 flex justify-end ${mobile ? "m-2.5" : "m-3 card-img_hover"}`}>
          <button
            type="button"
            onClick={() => window.open(source_code_link, "_blank")}
            className={
              mobile
                ? "w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                : "black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            }
            aria-label="GitHub"
          >
            <img src={github} alt="" className={`${mobile ? "w-4 h-4" : "w-1/2 h-1/2"} object-contain`} />
          </button>
        </div>
      )}
    </div>
    <div className={mobile ? "mt-3" : "mt-5"}>
      <h3 className={`text-white font-bold ${mobile ? "text-[16px] leading-snug" : "text-[24px]"}`}>{name}</h3>
      <p className={`mt-1 sm:mt-2 text-secondary ${mobile ? "text-xs leading-relaxed line-clamp-2" : "text-[14px]"}`}>
        {description}
      </p>
    </div>
    {tags.length > 0 && (
      <div className={`${mobile ? "mt-2" : "mt-4"} flex flex-wrap gap-1.5 sm:gap-2`}>
        {tags.slice(0, mobile ? 2 : tags.length).map((tag) => (
          <p key={`${name}-${tag.name}`} className={`${mobile ? "text-[11px]" : "text-[14px]"} ${tag.color}`}>
            #{tag.name}
          </p>
        ))}
      </div>
    )}
  </>
);

const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)} className="w-full sm:w-auto max-w-[360px] mx-auto sm:mx-0">
    <div className="sm:hidden bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
      <ProjectCardInner
        name={name}
        description={description}
        tags={tags}
        image={image}
        source_code_link={source_code_link}
        mobile
      />
    </div>

    <Tilt
      options={{ max: 45, scale: 1, speed: 450 }}
      className="hidden sm:block bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
    >
      <ProjectCardInner
        name={name}
        description={description}
        tags={tags}
        image={image}
        source_code_link={source_code_link}
      />
    </Tilt>
  </motion.div>
);

const Works = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = assertSupabaseClient();
      const { data, error: fetchError } = await client
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProjects((data || []).map(mapProject));
    } catch (err) {
      console.error("Projeler yüklenirken hata:", err);
      setError(formatSupabaseError(err));
      setProjects(
        fallbackProjects.map((project, index) => ({
          ...mapProject({
            id: `fallback-${index}`,
            baslik: project.name,
            aciklama: project.description,
            teknolojiler: project.tags.map((t) => t.name),
            github_url: project.source_code_link,
            live_url: null,
            image_url: project.image,
          }),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>KENDİ ÇALIŞMALARIM</p>
        <h2 className={styles.sectionHeadText}>Projelerim</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-secondary text-[14px] sm:text-[17px] max-w-3xl leading-relaxed sm:leading-[30px]"
      >
        <span className="sm:hidden">Seçili projelerimden birkaçı.</span>
        <span className="hidden sm:inline">
          Eğitim sürecimde ve kişisel çalışmalarımda geliştirdiğim çeşitli projelerle hem teknik
          becerilerimi hem de problem çözme yeteneklerimi pekiştirdim. Takım çalışmaları, freelance
          işler ve sosyal sorumluluk projeleri gibi farklı alanlarda edindiğim deneyimler, yazılım
          dünyasındaki yolculuğumu güçlendirdi. Burada, üzerinde çalıştığım bazı önemli projeleri
          bulabilirsiniz.
        </span>
      </motion.p>

      {loading ? (
        <SectionLoader label="Projeler yükleniyor..." />
      ) : (
        <>
          {error && <DataFetchError message={error} onRetry={fetchProjects} />}
          {projects.length > 0 ? (
            <div className={`${error ? "mt-8" : "mt-8 sm:mt-20"} flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-7`}>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} index={index} {...project} />
              ))}
            </div>
          ) : (
            !error && (
              <div className="mt-20 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-secondary text-sm">Henüz proje eklenmemiş.</p>
              </div>
            )
          )}
        </>
      )}
    </>
  );
};

export default SectionWrapper(Works, "projects");
