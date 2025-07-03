import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

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
      <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
        {/* Form Alanı */}
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
        >
          <p className={styles.sectionSubText}>BENİMLE İLETİŞİME GEÇİN</p>
          <h3 className={styles.sectionHeadText}>İletişim</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">İsmin</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="İsminiz nedir?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">
                E-posta Adresin
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="E-posta adresiniz nedir?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Mesajın</span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Ne söylemek istersiniz?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <button
              type="submit"
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        </motion.div>

        {/* Dünya Modeli */}
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>

      {/* Sosyal Medya Butonları */}
      <div className="w-full mt-12 flex justify-center gap-10">
        <a
          href="https://www.linkedin.com/in/asliaydin0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-5xl hover:text-[#0e76a8] transition-transform duration-300 transform hover:scale-110"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://www.instagram.com/asliaydn_w"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-5xl hover:text-pink-500 transition-transform duration-300 transform hover:scale-110"
        >
          <FaInstagram />
        </a>
        <a
          href="https://twitter.com/Aslaydn0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-5xl hover:text-sky-400 transition-transform duration-300 transform hover:scale-110"
        >
          <FaTwitter />
        </a>
        <a
          href="https://github.com/asliaydin0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-5xl hover:text-gray-900 transition-transform duration-300 transform hover:scale-110"
        >
          <FaGithub />
        </a>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
