import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import profilePic from "../assets/profile-pic.jpg"; // → Fotoğraf yolun burası

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row justify-between items-start gap-5`}
      >
        {/* Sol taraf (metin ve çizgi) */}
        <div className="flex flex-row gap-5">
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
            <div className="w-1 sm:h-80 h-40 violet-gradient" />
          </div>

          <div>
            <h1 className={`${styles.heroHeadText} text-white`}>
              Merhaba, Ben <span className="text-[#915EFF]">Aslı</span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              Bilgisayar Teknolojisi ve Bilişim Sistemleri öğrencisiyim.
              <br className="sm:block hidden" />
              Yazılım geliştirme ve yaratıcı projeler üretme tutkusu ile yol alıyorum.
            </p>
          </div>
        </div>

        {/* Sağ taraf (fotoğraf) */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-10 sm:mt-0 mr-0"
        >
          <img
            src={profilePic}
            alt="Profil Fotoğrafı"
            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#915EFF] shadow-lg transition-all duration-300 hover:brightness-110"
          />
        </motion.div>
      </div>

      {/* Aşağı ok */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
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

      {/* 3D canvas */}
      <ComputersCanvas />
    </section>
  );
};

export default Hero;
