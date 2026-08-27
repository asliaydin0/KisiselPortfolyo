import React, { useRef, useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import ErrorBoundary from "./ErrorBoundary";
import SceneLoader from "./SceneLoader";

const EarthCanvas = lazy(() =>
  import("./canvas/Earth").then((mod) => ({ default: mod.default }))
);

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Teşekkürler. En kısa sürede sizinle iletişime geçeceğim.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      );
  };

  return (
    <>
      <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-8 sm:gap-10 overflow-hidden">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-white/[0.02] border border-white/[0.06] p-5 sm:p-8 rounded-xl"
        >
          <p className={styles.sectionSubText}>İletişim</p>
          <h3 className={`${styles.sectionHeadText} mt-1`}>Bana Ulaşın</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-10 flex flex-col gap-5 sm:gap-7"
          >
            <label className="flex flex-col">
              <span className="text-white/90 text-sm font-medium mb-2">İsim</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="İsminiz nedir?"
                className="bg-white/[0.04] border border-white/[0.06] py-3 px-4 placeholder:text-secondary/70 text-white text-base rounded-lg outline-none font-normal focus:border-[#915EFF]/40 transition-colors"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white/90 text-sm font-medium mb-2">E-posta</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="E-posta adresiniz nedir?"
                className="bg-white/[0.04] border border-white/[0.06] py-3 px-4 placeholder:text-secondary/70 text-white text-base rounded-lg outline-none font-normal focus:border-[#915EFF]/40 transition-colors"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white/90 text-sm font-medium mb-2">Mesaj</span>
              <textarea
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Ne söylemek istersiniz?"
                className="bg-white/[0.04] border border-white/[0.06] py-3 px-4 placeholder:text-secondary/70 text-white text-base rounded-lg outline-none font-normal resize-y min-h-[120px] focus:border-[#915EFF]/40 transition-colors"
              />
            </label>

            <button
              type="submit"
              className="bg-[#915EFF] hover:bg-[#7b4de5] py-3 px-8 rounded-full outline-none w-full sm:w-fit text-white text-sm font-medium min-h-[48px] transition-colors"
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[220px] sm:h-[320px] pointer-events-none sm:pointer-events-auto touch-none sm:touch-auto opacity-60 sm:opacity-100"
        >
          <ErrorBoundary message="3D dünya modeli yüklenemedi.">
            <Suspense fallback={<SceneLoader label="3D model yükleniyor..." />}>
              <EarthCanvas />
            </Suspense>
          </ErrorBoundary>
        </motion.div>
      </div>

      <div className="w-full mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-10">
        {[
          { href: "https://www.linkedin.com/in/asliaydin0", Icon: FaLinkedin, hover: "hover:text-[#0e76a8]" },
          { href: "https://www.instagram.com/asliaydn_w", Icon: FaInstagram, hover: "hover:text-pink-500" },
          { href: "https://twitter.com/Aslaydn0", Icon: FaTwitter, hover: "hover:text-sky-400" },
          { href: "https://github.com/asliaydin0", Icon: FaGithub, hover: "hover:text-gray-300" },
        ].map(({ href, Icon, hover }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={href}
            className={`text-white text-4xl sm:text-5xl ${hover} transition-transform duration-300 transform hover:scale-110 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14`}
          >
            <Icon />
          </a>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
