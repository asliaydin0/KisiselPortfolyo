import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const buildShareImageUrl = (env, siteUrl) => {
  const supabaseUrl = env.VITE_SUPABASE_URL?.trim()?.replace(/\/$/, "");
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/profile-assets/logo/share.png`;
  }
  return `${siteUrl}/logo.png`;
};

const buildSocialMetaTags = ({ siteUrl, shareImageUrl, title, description }) => `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Aslı AYDIN" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${siteUrl}/" />
    <meta property="og:image" content="${shareImageUrl}" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${shareImageUrl}" />`;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://asliaydn.com").replace(/\/$/, "");
  const shareImageUrl = buildShareImageUrl(env, siteUrl);
  const title = "Aslı AYDIN | Kişisel Portföy";
  const description =
    "Bilgisayar Teknolojisi ve Bilişim Sistemleri öğrencisi. Yazılım geliştirme ve yaratıcı projeler.";

  return {
    plugins: [
      react(),
      {
        name: "inject-social-meta",
        transformIndexHtml(html) {
          return html.replace(
            "</head>",
            `${buildSocialMetaTags({ siteUrl, shareImageUrl, title, description })}\n  </head>`
          );
        },
      },
    ],
  };
});
