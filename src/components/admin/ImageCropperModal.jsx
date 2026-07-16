import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { FiX, FiCrop } from "react-icons/fi";
import { getCroppedImg, blobToFile } from "../../utils/cropImage";
import { adminBtnPrimary, adminBtnSecondary } from "../../utils/adminStyles";

const ASPECT_LABELS = {
  1: "1:1 Kare",
  [16 / 9]: "16:9 Geniş",
};

const getAspectLabel = (aspect) =>
  ASPECT_LABELS[aspect] || `${aspect.toFixed(2)} Oran`;

const ImageCropperModal = ({
  open,
  imageSrc,
  aspect = 1,
  title = "Görseli Kırp",
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setProcessing(false);
      setStatusText("");
    }
  }, [open, imageSrc]);

  const onCropCompleteInternal = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    setProcessing(true);
    setStatusText("Kırpılıyor...");

    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = blobToFile(blob);

      setStatusText("Yükleniyor...");
      await onCropComplete(file);

      toast.success("Görsel başarıyla yüklendi.");
      onClose();
    } catch (err) {
      console.error("Kırpma/yükleme hatası:", err);
      toast.error(err.message || "Görsel işlenemedi.");
    } finally {
      setProcessing(false);
      setStatusText("");
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={processing ? undefined : onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#151030]/95 border border-white/10 shadow-2xl backdrop-blur-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-[#dfd9ff]/60 mt-0.5">
              {getAspectLabel(aspect)} · Sürükleyerek konumlandırın
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="p-2 rounded-lg text-[#dfd9ff] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="relative w-full h-[320px] sm:h-[400px] bg-black/50">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            cropShape={aspect === 1 ? "rect" : "rect"}
            showGrid
            objectFit="contain"
          />
        </div>

        <div className="px-6 py-4 space-y-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#dfd9ff]/70 shrink-0 w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={processing}
              className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#915EFF] bg-white/10 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className={adminBtnSecondary}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={processing || !croppedAreaPixels}
              className={adminBtnPrimary}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {statusText || "İşleniyor..."}
                </>
              ) : (
                <>
                  <FiCrop /> Kırp ve Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
