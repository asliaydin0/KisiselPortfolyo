import { memo } from "react";
import { motion } from "framer-motion";

import { fadeIn } from "../utils/motion";

const TechSkillCard = memo(({ icon, name, index = 0 }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.02, 0.4)}
    title={name}
    className="group flex flex-col items-center gap-1.5 w-[72px] sm:w-[84px]"
  >
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center sm:group-hover:border-[#915EFF]/40 transition-colors">
      <img
        src={icon}
        alt={name || "Yetenek"}
        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        loading="lazy"
        draggable={false}
      />
    </div>
    <span className="text-[10px] sm:text-[11px] text-secondary text-center leading-tight capitalize line-clamp-2 group-hover:text-white/90 transition-colors">
      {name}
    </span>
  </motion.div>
));

TechSkillCard.displayName = "TechSkillCard";

export default TechSkillCard;
