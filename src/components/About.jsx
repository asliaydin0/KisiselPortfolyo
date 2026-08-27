import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.08, 0.5)}
    className="w-full"
  >
    <Tilt
      options={{ max: 12, scale: 1, speed: 400 }}
      className="hidden sm:block w-full sm:max-w-[250px]"
    >
      <div className="w-full green-pink-gradient p-[1px] rounded-2xl shadow-card">
        <div className="bg-tertiary rounded-2xl py-6 px-8 min-h-[240px] flex flex-col justify-center items-center gap-4">
          <img src={icon} alt={title} className="w-14 h-14 object-contain" />
          <h3 className="text-white text-lg font-semibold text-center">{title}</h3>
        </div>
      </div>
    </Tilt>

    <div className="sm:hidden bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col items-center gap-2.5">
      <img src={icon} alt={title} className="w-9 h-9 object-contain opacity-90" />
      <h3 className="text-white text-[13px] font-medium text-center leading-snug">{title}</h3>
    </div>
  </motion.div>
);

const About = () => {
  return (
    <>
      <motion.div
        variants={textVariant()}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className={styles.sectionSubText}>Giriş</p>
          <h2 className={`${styles.sectionHeadText} mt-1`}>Hakkımda</h2>
        </div>

        <a
          href="/CV_AsliAydin.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#915EFF] border border-[#915EFF]/30 hover:bg-[#915EFF]/10 px-5 py-2.5 rounded-full transition-colors w-fit min-h-[44px] flex items-center"
        >
          CV İndir
        </a>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className={`${styles.sectionLead} sm:max-w-3xl`}
      >
        <span className="sm:hidden">
          Web, yapay zeka ve mobil alanlarında projeler geliştiriyorum. Teknik becerilerimi
          gerçek dünya deneyimiyle birleştiriyorum.
        </span>
        <span className="hidden sm:inline">
          Eğitim hayatım boyunca web geliştirme, yapay zeka ve mobil uygulama alanlarında çeşitli
          projeler geliştirerek teknik becerilerimi geliştirdim. Freelance işler, takım çalışmaları
          ve sosyal sorumluluk projeleriyle gerçek dünya deneyimi kazandım. Öğrenmeye açık, üretmeyi
          seven biri olarak teknolojiyle değer katan projeler üretmeyi hedefliyorum.
        </span>
      </motion.p>

      <div className="mt-8 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-8">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
