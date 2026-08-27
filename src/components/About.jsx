import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="w-full sm:max-w-[250px]">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-6 sm:px-12 min-h-[220px] sm:min-h-[280px] flex justify-evenly items-center flex-col">
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()} className="flex flex-col xs:flex-row xs:items-center justify-between flex-wrap gap-4">
        <div>
          <p className={styles.sectionSubText}>GİRİŞ</p>
          <h2 className={styles.sectionHeadText}>Hakkımda</h2>
        </div>
        
        <a
          href="/CV_AsliAydin.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#915EFF] hover:bg-[#7b4de5] text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full xs:w-auto text-center min-h-[44px] flex items-center justify-center"
        >
          CV'yi Görüntüle
        </a>
      </motion.div>


      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[26px] sm:leading-[30px]'
      >
        Eğitim hayatım boyunca web geliştirme, yapay zeka ve mobil uygulama alanlarında çeşitli projeler 
        geliştirerek teknik becerilerimi geliştirdim. Freelance işler, takım çalışmaları ve sosyal sorumluluk 
        projeleriyle gerçek dünya deneyimi kazandım. Bu süreçte hem teknik yetkinliğimi hem de iletişim, problem
        çözme ve proje yönetimi gibi sosyal becerilerimi pekiştirdim. Öğrenmeye ve gelişmeye açık, üretmeyi seven
        biri olarak teknolojiyle değer katan projeler üretmeyi hedefliyorum.
      </motion.p>

      <div className='mt-12 sm:mt-20 flex flex-wrap gap-6 sm:gap-10 justify-center sm:justify-start'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
