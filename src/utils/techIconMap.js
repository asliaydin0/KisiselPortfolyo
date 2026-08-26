import {
  css,
  docker,
  figma,
  git,
  html,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  redux,
  tailwind,
  typescript,
  threejs,
} from "../assets";

/** Yerel asset eşleşmeleri (yüksek kalite) */
const LOCAL_ICON_MAP = {
  html: html,
  "html5": html,
  "html 5": html,
  css: css,
  "css3": css,
  "css 3": css,
  javascript: javascript,
  js: javascript,
  typescript: typescript,
  ts: typescript,
  react: reactjs,
  "react js": reactjs,
  reactjs: reactjs,
  "react.js": reactjs,
  redux: redux,
  "redux toolkit": redux,
  tailwind: tailwind,
  "tailwind css": tailwind,
  tailwindcss: tailwind,
  node: nodejs,
  "node js": nodejs,
  nodejs: nodejs,
  mongodb: mongodb,
  mongo: mongodb,
  mongoDB: mongodb,
  three: threejs,
  "three js": threejs,
  threejs: threejs,
  "three.js": threejs,
  git: git,
  figma: figma,
  docker: docker,
};

/**
 * Simple Icons CDN slug eşleşmeleri
 * https://cdn.simpleicons.org/{slug}
 */
const CDN_SLUG_MAP = {
  python: "python",
  flask: "flask",
  fastapi: "fastapi",
  django: "django",
  bootstrap: "bootstrap",
  java: "openjdk",
  kotlin: "kotlin",
  swift: "swift",
  go: "go",
  golang: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  csharp: "csharp",
  "c#": "csharp",
  cplusplus: "cplusplus",
  "c++": "cplusplus",
  vue: "vuedotjs",
  vuejs: "vuedotjs",
  "vue.js": "vuedotjs",
  angular: "angular",
  nextjs: "nextdotjs",
  "next.js": "nextdotjs",
  nuxt: "nuxtdotjs",
  svelte: "svelte",
  express: "express",
  nestjs: "nestjs",
  graphql: "graphql",
  postgresql: "postgresql",
  postgres: "postgresql",
  mysql: "mysql",
  sqlite: "sqlite",
  redis: "redis",
  firebase: "firebase",
  supabase: "supabase",
  aws: "amazonaws",
  azure: "microsoftazure",
  gcp: "googlecloud",
  kubernetes: "kubernetes",
  linux: "linux",
  nginx: "nginx",
  vite: "vite",
  webpack: "webpack",
  sass: "sass",
  scss: "sass",
  less: "less",
  npm: "npm",
  yarn: "yarn",
  pnpm: "pnpm",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  jira: "jira",
  trello: "trello",
  slack: "slack",
  discord: "discord",
  vscode: "visualstudiocode",
  "visual studio code": "visualstudiocode",
  intellij: "intellijidea",
  pytorch: "pytorch",
  tensorflow: "tensorflow",
  pandas: "pandas",
  numpy: "numpy",
  jupyter: "jupyter",
  scikitlearn: "scikitlearn",
  "scikit-learn": "scikitlearn",
  opencv: "opencv",
  flutter: "flutter",
  dart: "dart",
  kotlinandroid: "android",
  android: "android",
  ios: "apple",
  xcode: "xcode",
  spring: "spring",
  springboot: "springboot",
  "spring boot": "springboot",
  dotnet: "dotnet",
  ".net": "dotnet",
  aspnet: "dotnet",
  laravel: "laravel",
  symfony: "symfony",
  prisma: "prisma",
  sequelize: "sequelize",
  jest: "jest",
  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",
  postman: "postman",
  insomnia: "insomnia",
  swagger: "swagger",
  openapi: "openapiinitiative",
  markdown: "markdown",
  latex: "latex",
  arduino: "arduino",
  raspberrypi: "raspberrypi",
  blockchain: "ethereum",
  solidity: "solidity",
  ethereum: "ethereum",
  ai: "openai",
  openai: "openai",
  chatgpt: "openai",
  machinelearning: "tensorflow",
  "machine learning": "tensorflow",
  deeplearning: "pytorch",
  "deep learning": "pytorch",
  tkinter: "python",
  bash: "gnubash",
  shell: "gnubash",
  powershell: "powershell",
  linuxterminal: "gnubash",
  matlab: "mathworks",
  r: "r",
  excel: "microsoftexcel",
  powerbi: "powerbi",
  tableu: "tableau",
  tableau: "tableau",
  wordpress: "wordpress",
  shopify: "shopify",
  woocommerce: "woocommerce",
  figma: "figma",
  canva: "canva",
  adobe: "adobe",
  photoshop: "adobephotoshop",
  blender: "blender",
  unity: "unity",
  unrealengine: "unrealengine",
  godot: "godotengine",
  electron: "electron",
  vercel: "vercel",
  netlify: "netlify",
  cloudflare: "cloudflare",
  stripe: "stripe",
  socketio: "socketdotio",
  "socket.io": "socketdotio",
  rabbitmq: "rabbitmq",
  kafka: "apachekafka",
  elasticsearch: "elasticsearch",
  jenkins: "jenkins",
  terraform: "terraform",
  reactnative: "react",
  "react native": "react",
  expo: "expo",
  grpc: "grpc",
  jwt: "jsonwebtokens",
};

const normalizeKey = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "js")
    .replace(/\.ts$/i, "ts")
    .replace(/[^a-z0-9+#]+/g, "");

const normalizeSpaced = (name) => name.trim().toLowerCase().replace(/\s+/g, " ");

/** Bilinmeyen teknolojiler için baş harfli SVG ikon (JS logosu yerine) */
export const createInitialsIcon = (name) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (
    words.length >= 2
      ? words[0][0] + words[1][0]
      : words[0]?.slice(0, 2) || "?"
  ).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="#915EFF"/>
    <text x="64" y="72" text-anchor="middle" fill="#ffffff" font-size="44" font-family="Arial,sans-serif" font-weight="700">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const getCdnIconUrl = (slug) => `https://cdn.simpleicons.org/${slug}`;

const lookupLocal = (name) => {
  const spaced = normalizeSpaced(name);
  const compact = normalizeKey(name);

  if (LOCAL_ICON_MAP[spaced]) return LOCAL_ICON_MAP[spaced];
  if (LOCAL_ICON_MAP[compact]) return LOCAL_ICON_MAP[compact];

  for (const [key, icon] of Object.entries(LOCAL_ICON_MAP)) {
    const keyCompact = normalizeKey(key);
    if (compact === keyCompact || spaced === key) return icon;
  }

  return null;
};

const lookupCdnSlug = (name) => {
  const spaced = normalizeSpaced(name);
  const compact = normalizeKey(name);

  if (CDN_SLUG_MAP[spaced]) return CDN_SLUG_MAP[spaced];
  if (CDN_SLUG_MAP[compact]) return CDN_SLUG_MAP[compact];

  for (const [key, slug] of Object.entries(CDN_SLUG_MAP)) {
    if (compact === normalizeKey(key) || spaced === key) return slug;
  }

  if (compact.length >= 2) return compact;

  return null;
};

/**
 * Teknoloji adına göre ikon URL'si döndürür.
 * Öncelik: yerel asset → Simple Icons CDN → baş harf SVG
 */
export const getSkillIcon = (skillName) => {
  if (!skillName?.trim()) return createInitialsIcon("?");

  const local = lookupLocal(skillName);
  if (local) return local;

  const slug = lookupCdnSlug(skillName);
  if (slug) return getCdnIconUrl(slug);

  return createInitialsIcon(skillName);
};
