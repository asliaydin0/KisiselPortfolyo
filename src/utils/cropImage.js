const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

const rotateSize = (width, height, rotation) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

/**
 * Kırpılmış görseli canvas üzerinden Blob olarak döndürür.
 * @param {string} imageSrc - Object URL veya görsel kaynağı
 * @param {{ x: number, y: number, width: number, height: number }} pixelCrop
 * @param {number} rotation - derece cinsinden döndürme
 * @returns {Promise<Blob>}
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context oluşturulamadı.");

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) throw new Error("Canvas context oluşturulamadı.");

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Görsel kırpılamadı."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
};

export const blobToFile = (blob, fileName = `cropped-${Date.now()}.jpg`) =>
  new File([blob], fileName, { type: blob.type || "image/jpeg" });

export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file.type.startsWith("image/")) {
    return "Lütfen geçerli bir görsel dosyası seçin.";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Dosya boyutu ${maxSizeMB} MB'dan küçük olmalıdır.`;
  }
  return null;
};
