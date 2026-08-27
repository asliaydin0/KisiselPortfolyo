import { createCircularDataUrl } from "./circularImage";

let activeFaviconUrl = null;

const applyFaviconHref = (href, type = "image/png") => {
  ["icon", "apple-touch-icon"].forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.type = type;
    link.href = href;
  });
};

const revokeActiveFavicon = () => {
  if (activeFaviconUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(activeFaviconUrl);
  }
  activeFaviconUrl = null;
};

export const updateFavicon = async (href) => {
  if (!href || typeof document === "undefined") return;

  try {
    const dataUrl = await createCircularDataUrl(href, 128);

    if (!dataUrl) {
      applyFaviconHref(href);
      return;
    }

    revokeActiveFavicon();
    activeFaviconUrl = dataUrl;
    applyFaviconHref(dataUrl, "image/png");
  } catch (err) {
    console.warn("Yuvarlak favicon oluşturulamadı, orijinal logo kullanılıyor:", err);
    revokeActiveFavicon();
    applyFaviconHref(href);
  }
};
