import { supabase } from "../config/supabaseClient";
import { createCircularBlob } from "./circularImage";

const BUCKET = "profile-assets";
const SHARE_PATH = "logo/share.png";

export const getShareImageUrl = () => {
  const base = import.meta.env.VITE_SUPABASE_URL?.trim()?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/${BUCKET}/${SHARE_PATH}`;
};

export const withShareImageVersion = (url, version) => {
  if (!url) return null;
  if (!version) return url;
  const stamp = new Date(version).getTime();
  if (!Number.isFinite(stamp)) return url;
  return `${url}?v=${stamp}`;
};

export const uploadShareImage = async (logoUrl) => {
  if (!logoUrl || !supabase) return null;

  try {
    const blob = await createCircularBlob(logoUrl, 512);
    const { error } = await supabase.storage.from(BUCKET).upload(SHARE_PATH, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: "image/png",
    });

    if (error) throw error;
    return getShareImageUrl();
  } catch (err) {
    console.warn("Paylaşım görseli yüklenemedi:", err);
    return null;
  }
};
