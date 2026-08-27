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
          setForm({ name: "", email: "", message: "" });
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
          className="flex-[0.75] bg-white/[0.02] sm:bg-black-100 border border-white/[0.06] sm:border-none p-5 sm:p-8 rounded-xl sm:rounded-2xl"
        >
          <p className={styles.sectionSubText}>BENİMLE İLETİŞİME GEÇİN</p>
          <h3 className={styles.sectionHeadText}>İletişim</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-12 flex flex-col gap-5 sm:gap-8"
          >
            <label className="flex flex-col">
              <span className="text-white/90 sm:text-white font-medium mb-2 sm:mb-4 text-sm sm:text-base">
                İsim
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="İsminiz nedir?"
                className="bg-white/[0.04] sm:bg-tertiary border border-white/[0.06] sm:border-none py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary/70 sm:placeholder:text-secondary text-white text-base rounded-lg outline-none font-normal sm:font-medium focus:border-[#915EFF]/40 sm:focus:border-none transition-colors"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white/90 sm:text-white font-medium mb-2 sm:mb-4 text-sm sm:text-base">
                E-posta
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="E-posta adresiniz nedir?"
                className="bg-white/[0.04] sm:bg-tertiary border border-white/[0.06] sm:border-none py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary/70 sm:placeholder:text-secondary text-white text-base rounded-lg outline-none font-normal sm:font-medium focus:border-[#915EFF]/40 sm:focus:border-none transition-colors"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white/90 sm:text-white font-medium mb-2 sm:mb-4 text-sm sm:text-base">
                Mesaj
              </span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Ne söylemek istersiniz?"
                className="bg-white/[0.04] sm:bg-tertiary border border-white/[0.06] sm:border-none py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary/70 sm:placeholder:text-secondary text-white text-base rounded-lg outline-none font-normal sm:font-medium resize-y min-h-[120px] sm:min-h-[180px] focus:border-[#915EFF]/40 sm:focus:border-none transition-colors"
              />
            </label>

            <button
              type="submit"
              className="bg-[#915EFF] sm:bg-tertiary hover:bg-[#7b4de5] sm:hover:bg-tertiary py-3 px-8 rounded-full sm:rounded-xl outline-none w-full sm:w-fit text-white font-medium sm:font-bold shadow-none sm:shadow-md sm:shadow-primary min-h-[48px] transition-colors"
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[220px] sm:h-[350px] pointer-events-none sm:pointer-events-auto touch-none sm:touch-auto opacity-60 sm:opacity-100"
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
