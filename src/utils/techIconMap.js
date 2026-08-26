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
  python,
  dart,
  fastapi,
  unity,
  php,
  mysql,
  csharp,
} from "../assets";

/** Yerel asset eşleşmeleri */
const LOCAL_ICON_MAP = {
  html: html,
  html5: html,
  "html 5": html,
  css: css,
  css3: css,
  "css 3": css,
  javascript: javascript,
  js: javascript,
  typescript: typescript,
  ts: typescript,
  react: reactjs,
  "react js": reactjs,
  reactjs: reactjs,
  "react.js": reactjs,
  "react native": reactjs,
  reactnative: reactjs,
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
  python: python,
  py: python,
  dart: dart,
  fastapi: fastapi,
  "fast api": fastapi,
  unity: unity,
  unity3d: unity,
  "unity 3d": unity,
  php: php,
  sql: mysql,
  mysql: mysql,
  csharp: csharp,
  "c#": csharp,
  cs: csharp,
};

/** Devicon CDN yolları – yerel ikon yoksa yedek */
const DEVICON_PATHS = {
  java: "openjdk/openjdk-original",
  kotlin: "kotlin/kotlin-original",
  vue: "vuejs/vuejs-original",
  vuejs: "vuejs/vuejs-original",
  "vue.js": "vuejs/vuejs-original",
  angular: "angularjs/angularjs-original",
  nextjs: "nextjs/nextjs-original",
  "next.js": "nextjs/nextjs-original",
  nuxt: "nuxtjs/nuxtjs-original",
  go: "go/go-original",
  golang: "go/go-original",
  rust: "rust/rust-plain",
  ruby: "ruby/ruby-original",
  cplusplus: "cplusplus/cplusplus-original",
  "c++": "cplusplus/cplusplus-original",
  express: "express/express-original",
  nestjs: "nestjs/nestjs-plain",
  graphql: "graphql/graphql-plain",
  postgresql: "postgresql/postgresql-original",
  postgres: "postgresql/postgresql-original",
  sqlite: "sqlite/sqlite-original",
  redis: "redis/redis-original",
  kubernetes: "kubernetes/kubernetes-plain",
  nginx: "nginx/nginx-original",
  linux: "linux/linux-original",
  bash: "bash/bash-original",
  shell: "bash/bash-original",
  flutter: "flutter/flutter-original",
  android: "android/android-plain",
  spring: "spring/spring-original",
  springboot: "spring/spring-original",
  "spring boot": "spring/spring-original",
  dotnet: "dot-net/dot-net-original",
  ".net": "dot-net/dot-net-original",
  aspnet: "dot-net/dot-net-original",
  laravel: "laravel/laravel-original",
  symfony: "symfony/symfony-original",
  jest: "jest/jest-plain",
  cypress: "cypress/cypress-plain",
  tensorflow: "tensorflow/tensorflow-original",
  pytorch: "pytorch/pytorch-original",
  pandas: "pandas/pandas-original",
  numpy: "numpy/numpy-original",
  jupyter: "jupyter/jupyter-original",
  opencv: "opencv/opencv-original",
  electron: "electron/electron-original",
  vercel: "vercel/vercel-original",
  netlify: "netlify/netlify-original",
  cloudflare: "cloudflare/cloudflare-original",
  stripe: "stripe/stripe-original",
  rabbitmq: "rabbitmq/rabbitmq-original",
  elasticsearch: "elasticsearch/elasticsearch-original",
  jenkins: "jenkins/jenkins-original",
  terraform: "terraform/terraform-original",
  grpc: "grpc/grpc-original",
  expo: "expo/expo-original",
  flask: "flask/flask-original",
  django: "django/django-plain",
  bootstrap: "bootstrap/bootstrap-original",
  sass: "sass/sass-original",
  scss: "sass/sass-original",
  less: "less/less-plain",
  webpack: "webpack/webpack-original",
  vite: "vite/vite-original",
  npm: "npm/npm-original",
  yarn: "yarn/yarn-original",
  pnpm: "pnpm/pnpm-original",
  github: "github/github-original",
  gitlab: "gitlab/gitlab-original",
  bitbucket: "bitbucket/bitbucket-original",
  vscode: "vscode/vscode-original",
  "visual studio code": "vscode/vscode-original",
  intellij: "intellij/intellij-original",
  firebase: "firebase/firebase-plain",
  supabase: "supabase/supabase-original",
  wordpress: "wordpress/wordpress-plain",
  shopify: "shopify/shopify-original",
  blender: "blender/blender-original",
  godot: "godot/godot-original",
  unrealengine: "unrealengine/unrealengine-original",
  socketio: "socketio/socketio-original",
  "socket.io": "socketio/socketio-original",
  markdown: "markdown/markdown-original",
  arduino: "arduino/arduino-plain",
  raspberrypi: "raspberrypi/raspberrypi-original",
  ethereum: "ethereum/ethereum-original",
  solidity: "solidity/solidity-original",
  swift: "swift/swift-original",
  xcode: "xcode/xcode-original",
  apple: "apple/apple-original",
  ios: "apple/apple-original",
  postman: "postman/postman-original",
  insomnia: "insomnia/insomnia-original",
  swagger: "swagger/swagger-original",
  selenium: "selenium/selenium-original",
  playwright: "playwright/playwright-original",
  prisma: "prisma/prisma-original",
  sequelize: "sequelize/sequelize-original",
  scikitlearn: "scikitlearn/scikitlearn-original",
  "scikit-learn": "scikitlearn/scikitlearn-original",
  tkinter: "python/python-original",
  powershell: "powershell/powershell-original",
  matlab: "matlab/matlab-original",
  r: "r/r-original",
  tableau: "tableau/tableau-original",
  canva: "canva/canva-original",
  adobe: "adobe/adobe-original",
  photoshop: "photoshop/photoshop-plain",
  slack: "slack/slack-original",
  discord: "discord/discord-original",
  trello: "trello/trello-plain",
  jira: "jira/jira-original",
  aws: "amazonwebservices/amazonwebservices-plain-wordmark",
  azure: "azure/azure-original",
  gcp: "googlecloud/googlecloud-original",
  openai: "openai/openai-original",
  ai: "openai/openai-original",
  chatgpt: "openai/openai-original",
  machinelearning: "tensorflow/tensorflow-original",
  "machine learning": "tensorflow/tensorflow-original",
  deeplearning: "pytorch/pytorch-original",
  "deep learning": "pytorch/pytorch-original",
  svelte: "svelte/svelte-original",
  kafka: "apachekafka/apachekafka-original",
  openapi: "openapi/openapi-original",
  latex: "latex/latex-original",
  blockchain: "ethereum/ethereum-original",
  excel: "microsoftexcel/microsoftexcel-original",
  powerbi: "microsoftsqlserver/microsoftsqlserver-plain",
  woocommerce: "woocommerce/woocommerce-original",
  jwt: "jsonwebtokens/jsonwebtokens-original",
};

const normalizeKey = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "js")
    .replace(/\.ts$/i, "ts")
    .replace(/[^a-z0-9+#]+/g, "");

const normalizeSpaced = (name) => name.trim().toLowerCase().replace(/\s+/g, " ");

/** Bilinmeyen teknolojiler için baş harfli SVG ikon */
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

const getCdnIconUrl = (slug) => {
  const path = DEVICON_PATHS[slug] || `${slug}/${slug}-original`;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`;
};

const lookupLocal = (name) => {
  const spaced = normalizeSpaced(name);
  const compact = normalizeKey(name);

  if (LOCAL_ICON_MAP[spaced]) return LOCAL_ICON_MAP[spaced];
  if (LOCAL_ICON_MAP[compact]) return LOCAL_ICON_MAP[compact];

  for (const [key, icon] of Object.entries(LOCAL_ICON_MAP)) {
    if (compact === normalizeKey(key) || spaced === key) return icon;
  }

  return null;
};

const lookupCdnSlug = (name) => {
  const spaced = normalizeSpaced(name);
  const compact = normalizeKey(name);

  if (DEVICON_PATHS[spaced]) return spaced;
  if (DEVICON_PATHS[compact]) return compact;

  for (const key of Object.keys(DEVICON_PATHS)) {
    if (compact === normalizeKey(key) || spaced === key) return key;
  }

  return null;
};

/**
 * Teknoloji adına göre ikon URL'si döndürür.
 * Öncelik: yerel asset → Devicon CDN → baş harf SVG
 */
export const getSkillIcon = (skillName) => {
  if (!skillName?.trim()) return createInitialsIcon("?");

  const local = lookupLocal(skillName);
  if (local) return local;

  const slug = lookupCdnSlug(skillName);
  if (slug) return getCdnIconUrl(slug);

  return createInitialsIcon(skillName);
};
