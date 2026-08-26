import { Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { useSiteSettings, renderHeroTitle } from "../context/SiteSettingsContext";
import ErrorBoundary from "./ErrorBoundary";
import SceneLoader from "./SceneLoader";

const Hero = () => {
  const { settings } = useSiteSettings();
  const { prefix, highlight } = renderHeroTitle(settings.hero_title);
  const subtitleLines = (settings.hero_subtitle || "").split("\n");

  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row justify-between items-start gap-5 z-10`}
      >
        <div className="flex flex-row gap-5">
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
            <div className="w-1 sm:h-80 h-40 violet-gradient" />
          </div>

          <div>
            <h1 className={`${styles.heroHeadText} text-white`}>
              {prefix}
              {highlight && <span className="text-[#915EFF]">{highlight}</span>}
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              {subtitleLines.map((line, index) => (
                <span key={index}>
                  {index > 0 && <br className="sm:block hidden" />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-10 sm:mt-0 mr-0"
        >
          {settings.profile_img_url ? (
            <img
              src={settings.profile_img_url}
              alt="Profil Fotoğrafı"
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#915EFF] shadow-lg transition-all duration-300 hover:brightness-110"
            />
          ) : (
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-[#915EFF] shadow-lg bg-tertiary flex items-center justify-center">
              <span className="text-4xl sm:text-6xl opacity-40">👤</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute xs:bottom-1 bottom-10 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>

      <div className="absolute inset-0 z-0">
        <ErrorBoundary message="3D bilgisayar modeli yüklenemedi.">
          <Suspense fallback={<SceneLoader label="3D model yükleniyor..." />}>
            <ComputersCanvas />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default Hero;
