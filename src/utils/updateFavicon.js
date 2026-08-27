let activeFaviconUrl = null;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Logo yüklenemedi: ${src}`));
    img.src = src;
  });

const drawCircularFavicon = (img, size = 128) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const radius = size / 2;
  const inset = Math.max(2, Math.round(size * 0.04));

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.arc(radius, radius, radius - inset, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const scale = Math.max(size / img.width, size / img.height);
  const width = img.width * scale;
  const height = img.height * scale;
  ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(radius, radius, radius - inset, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(145, 94, 255, 0.9)";
  ctx.lineWidth = Math.max(2, Math.round(size * 0.05));
  ctx.stroke();

  return canvas.toDataURL("image/png");
};

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
    const img = await loadImage(href);
    const dataUrl = drawCircularFavicon(img, 128);

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
