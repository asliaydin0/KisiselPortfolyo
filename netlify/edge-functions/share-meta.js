const BOT_UA =
  /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest/i;

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildMetaTags = ({ title, description, imageUrl, pageUrl }) => {
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Aslı AYDIN" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  ];

  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
    tags.push(`<meta property="og:image:width" content="512" />`);
    tags.push(`<meta property="og:image:height" content="512" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`);
  }

  return tags.join("\n    ");
};

export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_UA.test(userAgent)) {
    return context.next();
  }

  const pageUrl = new URL(request.url);
  const siteUrl = `${pageUrl.origin}/`;
  const supabaseUrl = (Netlify.env.get("VITE_SUPABASE_URL") || "").replace(/\/$/, "");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY") || "";
  const configuredSiteUrl = (Netlify.env.get("VITE_SITE_URL") || pageUrl.origin).replace(/\/$/, "");

  let title = "Aslı AYDIN | Kişisel Portföy";
  let description =
    "Bilgisayar Teknolojisi ve Bilişim Sistemleri öğrencisi. Yazılım geliştirme ve yaratıcı projeler.";
  let imageUrl = `${configuredSiteUrl}/logo.png`;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/site_settings?id=eq.1&select=hero_title,hero_subtitle,updated_at`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const [settings] = await response.json();
        if (settings?.hero_title) {
          title = `${settings.hero_title} | Kişisel Portföy`;
        }
        if (settings?.hero_subtitle) {
          description = settings.hero_subtitle.replace(/\s+/g, " ").trim();
        }

        const shareBase = `${supabaseUrl}/storage/v1/object/public/profile-assets/logo/share.png`;
        const version = settings?.updated_at
          ? `?v=${new Date(settings.updated_at).getTime()}`
          : "";
        imageUrl = `${shareBase}${version}`;
      }
    } catch (error) {
      console.error("share-meta settings fetch failed:", error);
    }
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  const metaTags = buildMetaTags({
    title,
    description,
    imageUrl,
    pageUrl: siteUrl,
  });

  const cleanedHtml = html.replace(
    /<meta\s+(?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>\s*/gi,
    ""
  );

  const updatedHtml = cleanedHtml.replace("</head>", `    ${metaTags}\n  </head>`);

  return new Response(updatedHtml, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = {
  path: "/*",
};
