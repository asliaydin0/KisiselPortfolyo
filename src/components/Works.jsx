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
    <div className={`relative w-full ${mobile ? "h-[160px]" : "h-[200px] sm:h-[230px]"}`}>
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover rounded-lg sm:rounded-2xl" />
      ) : (
        <div className="w-full h-full rounded-lg sm:rounded-2xl bg-primary/40 border border-white/[0.06] flex items-center justify-center">
          <span className="text-2xl opacity-30">📁</span>
        </div>
      )}
      {source_code_link && (
        <div className="absolute inset-0 flex justify-end m-2.5 sm:m-3">
          <button
            type="button"
            onClick={() => window.open(source_code_link, "_blank")}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center"
            aria-label="GitHub"
          >
            <img src={github} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
          </button>
        </div>
      )}
    </div>
    <div className="mt-3 sm:mt-5">
      <h3 className="text-white font-semibold text-[16px] sm:text-xl leading-snug">{name}</h3>
      <p className="mt-1 text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
        {description}
      </p>
    </div>
    {tags.length > 0 && (
      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
        {tags.slice(0, mobile ? 2 : tags.length).map((tag) => (
          <span key={`${name}-${tag.name}`} className={`text-[11px] sm:text-sm ${tag.color}`}>
            #{tag.name}
          </span>
        ))}
      </div>
    )}
  </>
);

const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.5)} className="w-full max-w-[360px] mx-auto sm:mx-0">
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

    <Tilt options={{ max: 12, scale: 1, speed: 400 }} className="hidden sm:block bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 rounded-xl">
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
        <p className={styles.sectionSubText}>Projeler</p>
        <h2 className={`${styles.sectionHeadText} mt-1`}>Çalışmalarım</h2>
      </motion.div>

      <motion.p variants={fadeIn("", "", 0.1, 1)} className={`${styles.sectionLead} sm:max-w-3xl`}>
        <span className="sm:hidden">Seçili projelerimden birkaçı.</span>
        <span className="hidden sm:inline">
          Eğitim sürecimde ve kişisel çalışmalarımda geliştirdiğim projelerle teknik becerilerimi
          pekiştirdim. Burada öne çıkan çalışmalarımı bulabilirsiniz.
        </span>
      </motion.p>

      {loading ? (
        <SectionLoader label="Projeler yükleniyor..." />
      ) : (
        <>
          {error && <DataFetchError message={error} onRetry={fetchProjects} />}
          {projects.length > 0 ? (
            <div className={`${error ? "mt-6" : "mt-8 sm:mt-12"} flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6`}>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} index={index} {...project} />
              ))}
            </div>
          ) : (
            !error && (
              <div className="mt-10 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
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
