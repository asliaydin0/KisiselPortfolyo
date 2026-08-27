import {
  web,
  mobile,
  creator,
  carrent,
  jobit,
  tripguide,
  shopify,
  figma,
  backend,
} from "../assets";

export const SERVICE_FALLBACK_IMAGES = {
  web: carrent,
  "qr-menu": shopify,
  mobile: mobile,
  invitation: tripguide,
  album: jobit,
  "business-card": creator,
  design: figma,
  ecommerce: shopify,
  media: backend,
};

export const SERVICE_ACCENT_GRADIENTS = {
  web: "from-[#2f80ed]/70 via-[#915EFF]/30 to-transparent",
  "qr-menu": "from-[#00cea8]/70 via-[#915EFF]/20 to-transparent",
  mobile: "from-[#804dee]/70 via-[#bf61ff]/30 to-transparent",
  invitation: "from-[#ec008c]/60 via-[#915EFF]/25 to-transparent",
  album: "from-[#f5af19]/50 via-[#915EFF]/20 to-transparent",
  "business-card": "from-[#56ccf2]/60 via-[#915EFF]/20 to-transparent",
  design: "from-[#bf61ff]/60 via-[#915EFF]/25 to-transparent",
  ecommerce: "from-[#00cea8]/60 via-[#2f80ed]/25 to-transparent",
  media: "from-[#fc6767]/50 via-[#915EFF]/25 to-transparent",
};

export const getServiceImage = (iconKey, customUrl) => {
  if (customUrl) return customUrl;
  return SERVICE_FALLBACK_IMAGES[iconKey] || web;
};

export const getServiceAccent = (iconKey) =>
  SERVICE_ACCENT_GRADIENTS[iconKey] ||
  "from-[#915EFF]/60 via-[#915EFF]/20 to-transparent";
