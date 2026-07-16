import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiSave } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import { SETTINGS_ID } from "../../context/SiteSettingsContext";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
} from "../../utils/adminStyles";

const BUCKET = "profile-assets";

const uploadAsset = async (file, folder) => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

const validateImage = (file) => {
  if (!file.type.startsWith("image/")) {
    toast.error("Lütfen geçerli bir görsel dosyası seçin.");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Dosya boyutu 5 MB'dan küçük olmalıdır.");
    return false;
  }
  return true;
};

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    logo_url: "",
    profile_img_url: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const logoInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .single();

      if (error) throw error;

      setForm({
        hero_title: data.hero_title || "",
        hero_subtitle: data.hero_subtitle || "",
        logo_url: data.logo_url || "",
        profile_img_url: data.profile_img_url || "",
      });
      setLogoPreview(data.logo_url || null);
      setProfilePreview(data.profile_img_url || null);
    } catch (err) {
      toast.error("Ayarlar yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleProfileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hero_title.trim()) {
      toast.error("Hero başlığı zorunludur.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Ayarlar kaydediliyor...");

    try {
      let logoUrl = form.logo_url || null;
      let profileUrl = form.profile_img_url || null;

      if (logoFile) {
        logoUrl = await uploadAsset(logoFile, "logo");
      }
      if (profileFile) {
        profileUrl = await uploadAsset(profileFile, "profile");
      }

      const payload = {
        hero_title: form.hero_title.trim(),
        hero_subtitle: form.hero_subtitle.trim() || null,
        logo_url: logoUrl,
        profile_img_url: profileUrl,
      };

      const { error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", SETTINGS_ID);

      if (error) throw error;

      setForm((prev) => ({
        ...prev,
        logo_url: logoUrl || "",
        profile_img_url: profileUrl || "",
      }));
      setLogoFile(null);
      setProfileFile(null);

      toast.success("Genel ayarlar kaydedildi.", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Kaydetme başarısız.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#915EFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Genel Ayarlar</h2>
        <p className="text-sm text-[#dfd9ff]/70 mt-1">
          Logo, profil fotoğrafı ve ana sayfa hero metinlerini yönetin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`${adminCardClass} space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={adminLabelClass}>Logo</label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className={`${adminBtnSecondary} flex items-center gap-2 w-fit`}
              >
                <FiUpload /> Logo Seç
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo önizleme"
                  className="w-16 h-16 object-contain rounded-xl border border-white/10 bg-white/5 p-1"
                />
              )}
            </div>
          </div>

          <div>
            <label className={adminLabelClass}>Profil Fotoğrafı</label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className={`${adminBtnSecondary} flex items-center gap-2 w-fit`}
              >
                <FiUpload /> Fotoğraf Seç
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileSelect}
                className="hidden"
              />
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profil önizleme"
                  className="w-24 h-24 object-cover rounded-full border-4 border-[#915EFF]/50"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={adminLabelClass}>Hero Başlık *</label>
          <input
            name="hero_title"
            value={form.hero_title}
            onChange={handleChange}
            required
            placeholder="Merhaba, Ben Aslı"
            className={adminInputClass}
          />
          <p className="text-xs text-[#dfd9ff]/50 mt-1">
            &quot;Ben&quot; kelimesinden sonraki kısım mor renkle vurgulanır.
          </p>
        </div>

        <div>
          <label className={adminLabelClass}>
            Hero Alt Metin{" "}
            <span className="text-xs opacity-60">(satır atlamak için Enter kullanın)</span>
          </label>
          <textarea
            name="hero_subtitle"
            value={form.hero_subtitle}
            onChange={handleChange}
            rows={4}
            placeholder="Kısa tanıtım metniniz..."
            className={adminInputClass}
          />
        </div>

        <button type="submit" disabled={saving} className={adminBtnPrimary}>
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <FiSave /> Kaydet
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
