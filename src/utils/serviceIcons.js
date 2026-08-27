import {
  FaGlobe,
  FaQrcode,
  FaMobileAlt,
  FaEnvelopeOpenText,
  FaImages,
  FaIdCard,
  FaLaptopCode,
  FaPalette,
  FaShoppingCart,
  FaVideo,
} from "react-icons/fa";

export const SERVICE_ICON_MAP = {
  web: FaGlobe,
  "qr-menu": FaQrcode,
  mobile: FaMobileAlt,
  invitation: FaEnvelopeOpenText,
  album: FaImages,
  "business-card": FaIdCard,
  design: FaPalette,
  ecommerce: FaShoppingCart,
  media: FaVideo,
};

export const SERVICE_ICON_OPTIONS = [
  { value: "web", label: "Web Sitesi" },
  { value: "qr-menu", label: "QR Menü" },
  { value: "mobile", label: "Mobil Uygulama" },
  { value: "invitation", label: "Dijital Davetiye" },
  { value: "album", label: "Dijital Albüm" },
  { value: "business-card", label: "Kartvizit" },
  { value: "design", label: "Tasarım" },
  { value: "ecommerce", label: "E-Ticaret" },
  { value: "media", label: "Medya / Video" },
];

export const getServiceIcon = (key) =>
  SERVICE_ICON_MAP[key] || FaLaptopCode;
