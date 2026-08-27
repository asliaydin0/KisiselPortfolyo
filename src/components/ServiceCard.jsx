import { memo } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { fadeIn } from "../utils/motion";
import { getServiceIcon } from "../utils/serviceIcons";
import { getServiceImage, getServiceAccent } from "../utils/serviceImages";

const FeaturePills = ({ features, limit }) => {
  if (!features?.length) return null;
  const items = limit ? features.slice(0, limit) : features;

  return (
    <ul className="flex flex-wrap gap-1.5 mt-3">
      {items.map((feature) => (
        <li
          key={feature}
          className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium text-[#dfd9ff]/70 bg-white/[0.04] border border-white/[0.06]"
        >
          {feature}
        </li>
      ))}
    </ul>
  );
};

const ServiceImage = ({ image, title, iconKey, accent, compact = false, tall = false }) => {
  const Icon = getServiceIcon(iconKey);

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${
        compact
          ? "h-28 w-28 rounded-xl"
          : tall
            ? "h-48 md:h-auto md:min-h-[200px] md:w-[42%]"
            : "h-36 sm:h-44 w-full"
      }`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-500"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-80`} />
      {!compact && (
        <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white">
          <Icon className="w-3.5 h-3.5" aria-hidden />
        </div>
      )}
    </div>
  );
};

const ServiceCard = memo(
  ({ title, description, iconKey, imageUrl, features = [], index, featured = false }) => {
    const image = getServiceImage(iconKey, imageUrl);
    const accent = getServiceAccent(iconKey);
    const Icon = getServiceIcon(iconKey);

    if (featured) {
      return (
        <>
          {/* Mobil: kompakt yatay kart */}
          <motion.article
            variants={fadeIn("up", "spring", index * 0.04, 0.45)}
            className="md:hidden group"
          >
            <a
              href="#contact"
              className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#915EFF]/30 transition-colors"
            >
              <ServiceImage image={image} title={title} iconKey={iconKey} accent={accent} compact />
              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-white font-semibold text-[15px] leading-snug truncate">{title}</h3>
                {description && (
                  <p className="mt-1 text-secondary text-xs leading-relaxed line-clamp-2">{description}</p>
                )}
                <FeaturePills features={features} limit={2} />
              </div>
              <FiArrowUpRight className="w-4 h-4 text-[#915EFF]/70 shrink-0 mt-1" />
            </a>
          </motion.article>

          {/* Masaüstü: geniş kart */}
          <motion.article
            variants={fadeIn("up", "spring", index * 0.05, 0.6)}
            className="hidden md:block group relative md:col-span-2"
          >
            <div className="h-full flex flex-row overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#915EFF]/30 transition-colors">
              <ServiceImage image={image} title={title} iconKey={iconKey} accent={accent} tall />
              <div className="relative flex flex-col justify-center flex-1 p-6 lg:p-8">
                <h3 className="text-white font-semibold text-xl lg:text-2xl leading-tight">{title}</h3>
                {description && (
                  <p className="mt-2 text-secondary text-sm leading-relaxed line-clamp-3">{description}</p>
                )}
                <FeaturePills features={features} />
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#915EFF] hover:text-white transition-colors w-fit"
                >
                  Teklif Al <FiArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </motion.article>
        </>
      );
    }

    return (
      <motion.article
        variants={fadeIn("up", "spring", index * 0.04, 0.45)}
        className="group"
      >
        {/* Mobil */}
        <a
          href="#contact"
          className="md:hidden flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#915EFF]/25 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#915EFF]/10 border border-[#915EFF]/20 flex items-center justify-center text-[#915EFF] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-[15px] leading-snug">{title}</h3>
            {description && (
              <p className="mt-0.5 text-secondary text-xs line-clamp-1">{description}</p>
            )}
          </div>
          <FiArrowUpRight className="w-4 h-4 text-[#915EFF]/50 shrink-0 self-center" />
        </a>

        {/* Masaüstü */}
        <div className="hidden md:flex flex-col overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#915EFF]/30 transition-all h-full">
          <ServiceImage image={image} title={title} iconKey={iconKey} accent={accent} />
          <div className="flex flex-col flex-1 p-5">
            <h3 className="text-white font-semibold text-base leading-snug">{title}</h3>
            {description && (
              <p className="mt-1.5 text-secondary text-sm leading-relaxed line-clamp-2">{description}</p>
            )}
            <FeaturePills features={features} limit={3} />
          </div>
        </div>
      </motion.article>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
