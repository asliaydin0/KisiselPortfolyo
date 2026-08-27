import { memo } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { fadeIn } from "../utils/motion";
import { getServiceIcon } from "../utils/serviceIcons";
import { getServiceImage, getServiceAccent } from "../utils/serviceImages";

const FeaturePills = ({ features }) => {
  if (!features?.length) return null;

  return (
    <ul className="flex flex-wrap gap-2 mt-4">
      {features.map((feature) => (
        <li
          key={feature}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#dfd9ff]/90 bg-white/[0.06] border border-white/10"
        >
          {feature}
        </li>
      ))}
    </ul>
  );
};

const ServiceImage = ({ image, title, iconKey, accent, tall = false }) => {
  const Icon = getServiceIcon(iconKey);

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${
        tall ? "h-52 md:h-full md:min-h-[240px] md:w-[46%]" : "h-44 w-full"
      }`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${accent}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#151030]/90" />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
          <Icon className="w-4 h-4" aria-hidden />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#151030] to-transparent pointer-events-none" />
    </div>
  );
};

const ServiceCard = memo(
  ({ title, description, iconKey, imageUrl, features = [], index, featured = false }) => {
    const image = getServiceImage(iconKey, imageUrl);
    const accent = getServiceAccent(iconKey);

    if (featured) {
      return (
        <motion.article
          variants={fadeIn("up", "spring", index * 0.05, 0.6)}
          className="group relative md:col-span-2"
        >
          <div className="h-full flex flex-col md:flex-row overflow-hidden rounded-2xl bg-tertiary/90 border border-white/10 transition-all duration-500 hover:border-[#915EFF]/45 hover:shadow-[0_20px_60px_rgba(145,94,255,0.18)]">
            <ServiceImage
              image={image}
              title={title}
              iconKey={iconKey}
              accent={accent}
              tall
            />

            <div className="relative flex flex-col justify-center flex-1 p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#915EFF] bg-[#915EFF]/10 border border-[#915EFF]/25 mb-4">
                Öne Çıkan Hizmet
              </span>

              <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight">
                {title}
              </h3>

              {description && (
                <p className="mt-3 text-secondary text-sm sm:text-[15px] leading-relaxed">
                  {description}
                </p>
              )}

              <FeaturePills features={features} />

              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#915EFF] hover:text-white transition-colors group/link w-fit"
              >
                Teklif Al
                <FiArrowUpRight className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </motion.article>
      );
    }

    return (
      <motion.article
        variants={fadeIn("up", "spring", index * 0.05, 0.55)}
        className="group relative"
      >
        <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-tertiary/90 border border-white/10 transition-all duration-500 hover:border-[#915EFF]/40 hover:shadow-[0_16px_48px_rgba(145,94,255,0.14)] hover:-translate-y-1">
          <ServiceImage
            image={image}
            title={title}
            iconKey={iconKey}
            accent={accent}
          />

          <div className="relative flex flex-col flex-1 p-5 sm:p-6">
            <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>

            {description && (
              <p className="mt-2 text-secondary text-sm leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            <FeaturePills features={features} />

            <div className="mt-auto pt-4 flex items-center justify-between">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#915EFF] hover:text-white transition-colors"
              >
                İletişime Geç
                <FiArrowUpRight size={14} />
              </a>
              <span className="text-[10px] text-[#dfd9ff]/40 font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
