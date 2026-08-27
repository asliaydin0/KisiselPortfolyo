import {
  FaGraduationCap,
  FaBriefcase,
  FaUsers,
  FaLaptopCode,
  FaTrophy,
  FaChalkboardTeacher,
  FaRocket,
  FaCertificate,
  FaBrain,
  FaBuilding,
  FaCode,
  FaHandshake,
  FaProjectDiagram,
} from "react-icons/fa";

export const EXPERIENCE_ICON_MAP = {
  education: FaGraduationCap,
  work: FaBriefcase,
  club: FaUsers,
  internship: FaBuilding,
  hackathon: FaTrophy,
  mentor: FaChalkboardTeacher,
  freelance: FaLaptopCode,
  project: FaRocket,
  certificate: FaCertificate,
  ai: FaBrain,
  code: FaCode,
  volunteer: FaHandshake,
  team: FaProjectDiagram,
};

export const EXPERIENCE_ICON_OPTIONS = [
  { value: "education", label: "Eğitim / Üniversite" },
  { value: "work", label: "İş Deneyimi" },
  { value: "club", label: "Kulüp / Topluluk" },
  { value: "internship", label: "Staj" },
  { value: "hackathon", label: "Hackathon / Yarışma" },
  { value: "mentor", label: "Mentorluk / Akademi" },
  { value: "freelance", label: "Freelance / Serbest" },
  { value: "project", label: "Proje / Girişim" },
  { value: "certificate", label: "Sertifika / Kurs" },
  { value: "ai", label: "Yapay Zeka / ML" },
  { value: "code", label: "Yazılım Geliştirme" },
  { value: "volunteer", label: "Gönüllülük" },
  { value: "team", label: "Ekip Çalışması" },
];

export const EXPERIENCE_ICON_STYLES = {
  education: { bg: "#4f46e5", shadow: "0 0 20px rgba(79,70,229,0.45)" },
  work: { bg: "#915EFF", shadow: "0 0 20px rgba(145,94,255,0.45)" },
  club: { bg: "#00cea8", shadow: "0 0 20px rgba(0,206,168,0.4)" },
  internship: { bg: "#3b82f6", shadow: "0 0 20px rgba(59,130,246,0.4)" },
  hackathon: { bg: "#f59e0b", shadow: "0 0 20px rgba(245,158,11,0.45)" },
  mentor: { bg: "#06b6d4", shadow: "0 0 20px rgba(6,182,212,0.4)" },
  freelance: { bg: "#ec4899", shadow: "0 0 20px rgba(236,72,153,0.4)" },
  project: { bg: "#8b5cf6", shadow: "0 0 20px rgba(139,92,246,0.45)" },
  certificate: { bg: "#10b981", shadow: "0 0 20px rgba(16,185,129,0.4)" },
  ai: { bg: "#a855f7", shadow: "0 0 20px rgba(168,85,247,0.45)" },
  code: { bg: "#6366f1", shadow: "0 0 20px rgba(99,102,241,0.4)" },
  volunteer: { bg: "#ef4444", shadow: "0 0 20px rgba(239,68,68,0.35)" },
  team: { bg: "#14b8a6", shadow: "0 0 20px rgba(20,184,166,0.4)" },
};

const KEYWORD_RULES = [
  { key: "education", words: ["eğitim", "egitim", "üniversite", "universite", "öğrenci", "ogrenci", "bölüm", "bolum", "okul", "lisans"] },
  { key: "club", words: ["kulüp", "kulup", "topluluk", "community"] },
  { key: "hackathon", words: ["hackathon", "bootcamp", "yarışma", "yarisma", "jam", "etkinlik"] },
  { key: "mentor", words: ["mentor", "akademi", "eğitmen", "egitmen"] },
  { key: "ai", words: ["yapay zeka", "ai", "makine öğren", "machine learning", "veri bilim"] },
  { key: "internship", words: ["staj", "intern"] },
  { key: "freelance", words: ["freelance", "serbest", "danışman", "danisman"] },
  { key: "certificate", words: ["sertifika", "kurs", "certificate"] },
  { key: "volunteer", words: ["gönüllü", "gonullu", "volunteer"] },
  { key: "project", words: ["proje", "girişim", "girisim", "startup"] },
  { key: "code", words: ["yazılım", "yazilim", "developer", "geliştirici", "gelistirici", "frontend", "backend"] },
];

export const guessExperienceIcon = (pozisyon = "", sirketAdi = "") => {
  const text = `${pozisyon} ${sirketAdi}`.toLocaleLowerCase("tr-TR");

  for (const rule of KEYWORD_RULES) {
    if (rule.words.some((word) => text.includes(word))) {
      return rule.key;
    }
  }

  return "work";
};

export const getExperienceIcon = (key) =>
  EXPERIENCE_ICON_MAP[key] || FaBriefcase;

export const getExperienceIconStyle = (key) =>
  EXPERIENCE_ICON_STYLES[key] || EXPERIENCE_ICON_STYLES.work;

export const resolveExperienceIconKey = (ikon, pozisyon, sirketAdi) => {
  if (ikon && EXPERIENCE_ICON_MAP[ikon]) return ikon;
  return guessExperienceIcon(pozisyon, sirketAdi);
};
