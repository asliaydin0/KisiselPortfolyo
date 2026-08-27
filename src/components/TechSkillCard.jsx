import { memo } from "react";
import { motion } from "framer-motion";

import { fadeIn } from "../utils/motion";

const TechSkillCard = memo(({ icon, name, seviye = 0, index = 0 }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.04, 0.55)}
    className="group"
  >
    <div className="relative h-full p-4 sm:p-5 rounded-2xl bg-tertiary/90 border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#915EFF]/40 hover:shadow-[0_8px_32px_rgba(145,94,255,0.12)]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-[#915EFF]/10 via-transparent to-transparent" />

      <div className="relative flex items-center gap-4">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/70 border border-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-[#915EFF]/30">
          <img
            src={icon}
            alt={name || "Yetenek"}
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base truncate capitalize">
            {name}
          </p>

          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, Math.max(0, seviye))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.03, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#915EFF] to-[#bf61ff]"
            />
          </div>

          <p className="mt-1.5 text-secondary text-xs font-medium">
            %{seviye}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
));

TechSkillCard.displayName = "TechSkillCard";

export default TechSkillCard;
