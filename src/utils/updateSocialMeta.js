const upsertMeta = (selector, attributes, content) => {
  if (!content || typeof document === "undefined") return;

  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.content = content;
};

export const updateSocialMeta = ({
  title = "Aslı AYDIN | Kişisel Portföy",
  description = "Yazılım geliştirici Aslı AYDIN kişisel portföy sitesi.",
  imageUrl,
  pageUrl,
}) => {
  if (typeof document === "undefined") return;

  const siteUrl =
    pageUrl ||
    import.meta.env.VITE_SITE_URL?.trim()?.replace(/\/$/, "") ||
    window.location.origin;

  document.title = title;

  upsertMeta('meta[property="og:type"]', { property: "og:type" }, "website");
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, "Aslı AYDIN");
  upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
  upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
  upsertMeta('meta[property="og:url"]', { property: "og:url" }, `${siteUrl}/`);

  if (imageUrl) {
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width" }, "512");
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height" }, "512");
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
  }
};
