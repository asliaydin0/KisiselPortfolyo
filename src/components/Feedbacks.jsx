import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.15, 0.5)}
    className="bg-white/[0.03] border border-white/[0.06] p-5 sm:p-8 rounded-xl w-full"
  >
    <p className="text-white text-[14px] sm:text-[16px] leading-relaxed line-clamp-4 sm:line-clamp-none">
      {testimonial}
    </p>

    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3">
      <img
        src={image}
        alt={name}
        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
      />
      <div className="min-w-0">
        <p className="text-white font-medium text-sm truncate">{name}</p>
        <p className="text-secondary text-[11px] sm:text-xs truncate">
          {designation}, {company}
        </p>
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Referanslar</p>
        <h2 className={`${styles.sectionHeadText} mt-1`}>Yorumlar</h2>
      </motion.div>

      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Feedbacks, "comment");
