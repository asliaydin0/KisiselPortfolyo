import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import ComputersCanvas from "./canvas/Computers";
import { useSiteSettings, renderHeroTitle } from "../context/SiteSettingsContext";
import ErrorBoundary from "./ErrorBoundary";

const Hero = () => {
  const { settings } = useSiteSettings();
  const { prefix, highlight } = renderHeroTitle(settings.hero_title);
  const subtitleLines = (settings.hero_subtitle || "").split("\n").filter(Boolean);
  const sectionRef = useRef(null);
  const [canvasActive, setCanvasActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mobileSubtitle = subtitleLines.slice(0, 2).join(" ");

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] h-[100svh] sm:h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[76px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-5 sm:gap-8 z-10 pointer-events-none`}
      >
        <div className="flex flex-row gap-4 sm:gap-5 pointer-events-none w-full sm:w-auto order-2 sm:order-1">
          <div className="hidden sm:flex flex-col justify-center items-center mt-5 shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
            <div className="w-1 h-80 violet-gradient" />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className={`${styles.heroHeadText} text-white`}>
              {prefix}
              {highlight && <span className="text-[#915EFF]">{highlight}</span>}
            </h1>
            <p className={`${styles.heroSubText} mt-3 sm:mt-2 text-white-100 line-clamp-3 sm:line-clamp-none`}>
              <span className="sm:hidden">{mobileSubtitle}</span>
              <span className="hidden sm:inline">
                {subtitleLines.map((line, index) => (
                  <span key={index}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
            </p>
            <a
              href="#contact"
              className="sm:hidden pointer-events-auto inline-flex mt-5 items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-[#915EFF]/90 text-white text-sm font-medium"
            >
              İletişime Geç
            </a>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="order-1 sm:order-2 pointer-events-auto shrink-0 sm:mt-0"
        >
          {settings.profile_img_url ? (
            <img
              src={settings.profile_img_url}
              alt="Profil Fotoğrafı"
              className="w-20 h-20 xs:w-24 xs:h-24 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#915EFF] shadow-lg transition-all duration-300 hover:brightness-110"
            />
          ) : (
            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-48 sm:h-48 rounded-full border-4 border-[#915EFF] shadow-lg bg-tertiary flex items-center justify-center">
              <span className="text-2xl sm:text-6xl opacity-40">👤</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-5 sm:bottom-10 w-full flex justify-center items-center z-10 pointer-events-none">
        <a href="#about" className="pointer-events-auto sm:opacity-100 opacity-60 hover:opacity-100 transition-opacity" aria-label="Aşağı kaydır">
          <div className="w-[26px] h-[42px] sm:w-[35px] sm:h-[64px] rounded-full sm:rounded-3xl border-2 sm:border-4 border-secondary/70 sm:border-secondary flex justify-center items-start p-1.5 sm:p-2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-1 h-1 sm:w-3 sm:h-3 rounded-full bg-secondary"
            />
          </div>
        </a>
      </div>

      <div className="absolute inset-0 z-0 opacity-40 sm:opacity-100 pointer-events-none touch-none">
        <ErrorBoundary message="3D bilgisayar modeli yüklenemedi.">
          <ComputersCanvas frameloop={canvasActive ? "always" : "never"} />
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default Hero;
