import { memo } from "react";
import { motion } from "framer-motion";

import { fadeIn } from "../utils/motion";

const TechSkillCard = memo(({ icon, name, index = 0 }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.025, 0.45)}
    title={name}
    className="group flex flex-col items-center gap-2 w-[80px] sm:w-[84px]"
  >
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-all duration-300 group-hover:border-[#915EFF]/50 group-hover:bg-[#915EFF]/10 sm:group-hover:-translate-y-1 sm:group-hover:shadow-[0_12px_24px_rgba(145,94,255,0.18)]">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#915EFF]/20 to-transparent pointer-events-none" />
      <img
        src={icon}
        alt={name || "Yetenek"}
        className="relative w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        draggable={false}
      />
    </div>

    <span className="text-[11px] sm:text-xs text-secondary text-center leading-tight capitalize transition-colors duration-300 group-hover:text-white line-clamp-2">
      {name}
    </span>
  </motion.div>
));

TechSkillCard.displayName = "TechSkillCard";

export default TechSkillCard;
