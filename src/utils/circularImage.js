export const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Görsel yüklenemedi: ${src}`));
    img.src = src;
  });

export const renderCircularImage = (img, size = 128) => {
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

  return canvas;
};

export const createCircularDataUrl = async (src, size = 128) => {
  const img = await loadImage(src);
  const canvas = renderCircularImage(img, size);
  return canvas?.toDataURL("image/png") ?? null;
};

export const createCircularBlob = async (src, size = 512) => {
  const img = await loadImage(src);
  const canvas = renderCircularImage(img, size);
  if (!canvas) return null;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Yuvarlak görsel oluşturulamadı."))),
      "image/png"
    );
  });
};
