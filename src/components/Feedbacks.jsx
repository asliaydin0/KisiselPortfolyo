import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const MobileFeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.15, 0.5)}
    className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-xl w-full"
  >
    <p className="text-white text-[14px] leading-relaxed line-clamp-4">{testimonial}</p>
    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3">
      <img src={image} alt={name} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
      <div className="min-w-0">
        <p className="text-white font-medium text-sm truncate">{name}</p>
        <p className="text-secondary text-[11px] truncate">
          {designation}, {company}
        </p>
      </div>
    </div>
  </motion.div>
);

const DesktopFeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full"
  >
    <p className="text-white font-black text-[48px]">&quot;</p>
    <div className="mt-1">
      <p className="text-white tracking-wider text-[18px]">{testimonial}</p>
      <div className="mt-7 flex justify-between items-center gap-1">
        <div className="flex-1 flex flex-col">
          <p className="text-white font-medium text-[16px]">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-secondary text-[12px]">
            {designation} of {company}
          </p>
        </div>
        <img src={image} alt={`feedback_by-${name}`} className="w-10 h-10 rounded-full object-cover" />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <>
      <div className="sm:hidden">
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Referanslar</p>
          <h2 className={`${styles.sectionHeadText} mt-1`}>Yorumlar</h2>
        </motion.div>
        <div className="mt-6 flex flex-col gap-4">
          {testimonials.map((testimonial, index) => (
            <MobileFeedbackCard key={testimonial.name} index={index} {...testimonial} />
          ))}
        </div>
      </div>

      <div className="hidden sm:block mt-12 bg-black-100 rounded-[20px]">
        <div className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}>
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>BaŞKALARI NE DİYOR?</p>
            <h2 className={styles.sectionHeadText}>Yorumlar</h2>
          </motion.div>
        </div>
        <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
          {testimonials.map((testimonial, index) => (
            <DesktopFeedbackCard key={testimonial.name} index={index} {...testimonial} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Feedbacks, "comment");
