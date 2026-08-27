import { memo } from "react";
import { motion } from "framer-motion";

import { fadeIn } from "../utils/motion";
import { getServiceIcon } from "../utils/serviceIcons";

const ServiceCard = memo(({ title, description, iconKey, index }) => {
  const Icon = getServiceIcon(iconKey);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.06, 0.5)}
      className="group relative"
    >
      <div className="h-full p-5 sm:p-6 rounded-2xl bg-tertiary/80 border border-white/10 transition-all duration-300 hover:border-[#915EFF]/40 hover:shadow-[0_12px_40px_rgba(145,94,255,0.12)]">
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-[#915EFF]/10 via-transparent to-transparent" />

        <div className="relative flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#915EFF]/15 border border-[#915EFF]/25 flex items-center justify-center text-[#915EFF] transition-transform duration-300 group-hover:scale-105">
            <Icon className="w-5 h-5" aria-hidden />
          </div>

          <div>
            <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>
            {description && (
              <p className="mt-2 text-secondary text-sm leading-relaxed line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
