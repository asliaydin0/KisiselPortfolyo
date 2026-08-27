import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import ComputersCanvas from "./canvas/Computers";
import { useSiteSettings, renderHeroTitle } from "../context/SiteSettingsContext";
import ErrorBoundary from "./ErrorBoundary";

const Hero = () => {
  const { settings } = useSiteSettings();
  const { prefix, highlight } = renderHeroTitle(settings.hero_title);
  const subtitleLines = (settings.hero_subtitle || "").split("\n");
  const sectionRef = useRef(null);
  const [canvasActive, setCanvasActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCanvasActive(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[88px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-6 sm:gap-5 z-10 pointer-events-none`}
      >
        <div className="flex flex-row gap-3 sm:gap-5 pointer-events-none w-full sm:w-auto">
          <div className="hidden xs:flex flex-col justify-center items-center mt-5 shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
            <div className="w-1 sm:h-80 h-32 violet-gradient" />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className={`${styles.heroHeadText} text-white`}>
              {prefix}
              {highlight && <span className="text-[#915EFF]">{highlight}</span>}
            </h1>
            <p className={`${styles.heroSubText} mt-2 sm:mt-3 text-white-100`}>
              {subtitleLines.map((line, index) => (
                <span key={index}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-2 sm:mt-0 pointer-events-auto self-center sm:self-auto shrink-0"
        >
          {settings.profile_img_url ? (
            <img
              src={settings.profile_img_url}
              alt="Profil Fotoğrafı"
              className="w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#915EFF] shadow-lg transition-all duration-300 hover:brightness-110"
            />
          ) : (
            <div className="w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 rounded-full border-4 border-[#915EFF] shadow-lg bg-tertiary flex items-center justify-center">
              <span className="text-3xl xs:text-4xl sm:text-6xl opacity-40">👤</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 w-full flex justify-center items-center z-10 pointer-events-none">
        <a href="#about" className="pointer-events-auto" aria-label="Hakkımda bölümüne git">
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

      <div className="absolute inset-0 z-0 pointer-events-none sm:pointer-events-auto touch-none sm:touch-auto">
        <ErrorBoundary message="3D bilgisayar modeli yüklenemedi.">
          <ComputersCanvas frameloop={canvasActive ? "always" : "never"} />
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default Hero;
