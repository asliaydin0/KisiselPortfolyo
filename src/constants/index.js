import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "Hakkımda",
  },
  {
    id: "work",
    title: "Deneyimler",
  },
  {
    id: "projects",
    title: "Projeler",
  },
  {
    id: "comment",
    title: "Yorumlar",
  },
  {
    id: "contact",
    title: "İletişim",
  },
];

const services = [
  {
    title: "UI/UX Designer",
    icon: web,
  },
  {
    title: "AI Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Frontend Developer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Bilgisayar Teknolojisi ve Bilişim Sistemleri Bölümü",
    company_name: "Eğitim",
    icon: starbucks,
    iconBg: "#383E56",
    date: "2 Ekim 2023",
    points: [
      "Barın Üniversitesinde eğitimime başladım.",
      "Bu süreçte temel programlama, veri yapıları, veritabanı sistemleri, web programlama gibi bir çok derste hem teorik hem uygulamalı olarak kendimi geliştirme fırsatı buldum.",
      "Özellikle algoritma mantığını kavramak ve proje odaklı öğrenme benim için dönüm noktası oldu.",
      
    ],
  },
  {
    title: "Blockchain ve Yazılım Kulüpleri",
    company_name: "Kulüp",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "2024",
    points: [
      "Üniversite bünyesindeki teknik kulüplere aktif olarak katıldım. Bu kulüplerde:",
      "Frontend projeleri geliştirdim (HTML, CSS, JS)",
      "Ekip içi iletişim ve görev paylaşımı tecrübesi kazandım",
      "Github ve sürüm kontrol sistemlerini öğrendim.",
    ],
  },
  {
    title: "Online Eğitim ve Mentorluk",
    company_name: "Yapay Zeka ve Teknoloji Akademisi",
    icon: shopify,
    iconBg: "#383E56",
    date: "2024 - Devam Ediyor",
    points: [
      "Yapay zekâ, makine öğrenimi ve veri bilimine olan ilgim doğrultusunda Yapay Zekâ ve Teknoloji Akademisi'ne katıldım. Bu kapsamda:",
      "Teknik ve girişimcilik odaklı çok yönlü bir eğitim aldım.",
      "HTML, CSS, JavaScript, modern frontend framework'ler ve backend API entegrasyonu konularında bilgi sahibi oldum.",
      "Görüntü işleme, veri seti hazırlama, temel sınıflandırma modelleri ve makine öğrenimi algoritmaları üzerine çalıştım.",
    ],
  },
  {
    title: "Yarışma ve Etkinliklere Katılım",
    company_name: "Bootcamp, Hackathon ve Proje Yarışmaları",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "2024 - Devam Ediyor",
    points: [
      "Jam Etkinlikleri: Belirli süre içinde ürün geliştirme odaklı yarışmalarda ekipler halinde çalışarak proje yönetimi ve hızlı geliştirme yeteneklerimi test ettim.",
      "Hackathonlar: Sosyal etki temalı projeler geliştirdim. Eğitimde yapay zeka kullanımı gibi konular üzerine yoğunlaştım.",
      "Al Bootcamp Projeleri: Gelişim geriliği tespiti ve ödev değerlendirme sistemi gibi iki farklı Al projesi üzerine araştırma ve tasarım yaptım.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Portfolyo sitesini incelerken hem yazılım becerilerini hem de tasarımsal yönünü bir arada görebiliyorsunuz.",
    name: "Büşra Aydın",
    designation: "Diş Hekimi",
    company: "Aydın Diş Kliniği",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "Aslı gibi müşterilerinin başarısını gerçekten önemseyen bir web geliştiricisiyle hiç tanışmadım..",
    name: "Arif Aydın",
    designation: "CEO",
    company: "Aydın İnşaat",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "Verdiğimiz e-ticaret sitesi projesini hem zamanında hem de beklediğimizden daha iyi bir şekilde teslim etti. Her zaman iletişime açık ve çözüm odaklı.",
    name: "Lisa Wang",
    designation: "CTO",
    company: "Tech Innovations",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "MentalGarden",
    description:
      "Kullanıcıların duygusal deneyimlerini doğru kelimeleri seçme çabası olmadan kişisel bir günlük tutabilecekleri ve arkadaşlarıyla kolektif bir huzur ortamı yaratabilecekleri sıcak ve destekleyici bir platformdur.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "fastapi",
        color: "green-text-gradient",
      },
      {
        name: "ai",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/asliaydin0/MentalGarden",
  },
  {
    name: "Soru-Cevap Asistanı",
    description:
      "Basit bir kural tabanlı yapay zeka uygulaması olan bu proje, kullanıcıdan alınan metne anlamlı cevaplar üreterek temel Al mantığını göstermektedir. Flask tabanlı backend ve Bootstrap destekli responsive frontend ile geliştirilmiştir.",
    tags: [
      {
        name: "flask",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "green-text-gradient",
      },
      {
        name: "python",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/asliaydin0/SoruCevapAsistani",
  },
  {
    name: "To-Do List Uygulaması",
    description:
      "Python dilinde Tkinter kütüphanesi kullanılarak geliştirilmiş basit ve kullanıcı dostu bir To-Do List (Yapılacaklar Listesi) uygulamasıdır. Kullanıcılar görev ekleyebilir, görevleri tamamlandı olarak işaretleyebilir, silebilir ve görevlerini JSON dosyasına kaydedip yeniden yükleyebilir.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tkinter",
        color: "green-text-gradient",
      },
      {
        name: "json",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/asliaydin0/ToDoList",
  },
];

export { services, technologies, experiences, testimonials, projects };
