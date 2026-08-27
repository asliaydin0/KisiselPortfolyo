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
    <Tilt className="hidden sm:block xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
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
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className={styles.sectionSubText}>GİRİŞ</p>
          <h2 className={styles.sectionHeadText}>Hakkımda</h2>
        </div>

        <a
          href="/CV_AsliAydin.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="sm:bg-[#915EFF] sm:hover:bg-[#7b4de5] sm:text-white sm:px-6 sm:py-3 sm:rounded-lg sm:shadow-md sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:scale-105 text-sm font-medium text-[#915EFF] border border-[#915EFF]/30 hover:bg-[#915EFF]/10 px-5 py-2.5 rounded-full transition-colors w-fit min-h-[44px] flex items-center"
        >
          <span className="sm:hidden">CV İndir</span>
          <span className="hidden sm:inline">CV&apos;yi Görüntüle</span>
        </a>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[14px] sm:text-[17px] max-w-3xl leading-relaxed sm:leading-[30px]"
      >
        <span className="sm:hidden">
          Web, yapay zeka ve mobil alanlarında projeler geliştiriyorum. Teknik becerilerimi gerçek
          dünya deneyimiyle birleştiriyorum.
        </span>
        <span className="hidden sm:inline">
          Eğitim hayatım boyunca web geliştirme, yapay zeka ve mobil uygulama alanlarında çeşitli
          projeler geliştirerek teknik becerilerimi geliştirdim. Freelance işler, takım çalışmaları
          ve sosyal sorumluluk projeleriyle gerçek dünya deneyimi kazandım. Bu süreçte hem teknik
          yetkinliğimi hem de iletişim, problem çözme ve proje yönetimi gibi sosyal becerilerimi
          pekiştirdim. Öğrenmeye ve gelişmeye açık, üretmeyi seven biri olarak teknolojiyle değer
          katan projeler üretmeyi hedefliyorum.
        </span>
      </motion.p>

      <div className="mt-8 sm:mt-20 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
