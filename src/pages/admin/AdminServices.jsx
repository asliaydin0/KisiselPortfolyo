import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import { isMissingTableError } from "../../utils/supabaseHelpers";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ImageCropperModal from "../../components/admin/ImageCropperModal";
import { validateImageFile } from "../../utils/cropImage";
import {
  SERVICE_ICON_OPTIONS,
  getServiceIcon,
} from "../../utils/serviceIcons";
import { getServiceImage } from "../../utils/serviceImages";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnIcon,
} from "../../utils/adminStyles";

const BUCKET = "project-images";
const COVER_ASPECT = 16 / 10;

const emptyForm = {
  baslik: "",
  aciklama: "",
  ikon: "web",
  gorsel_url: "",
  ozellikler: "",
  sira: 0,
};

const AdminServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropModal, setCropModal] = useState({ open: false, imageSrc: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const fileInputRef = useRef(null);

  const closeCropModal = useCallback(() => {
    setCropModal((prev) => {
      if (prev.imageSrc) URL.revokeObjectURL(prev.imageSrc);
      return { open: false, imageSrc: null };
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setTableMissing(false);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sira", { ascending: true });

    if (error) {
      if (isMissingTableError(error)) {
        setTableMissing(true);
        setItems([]);
      } else {
        toast.error("Hizmetler yüklenemedi: " + error.message);
      }
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(false);
    closeCropModal();
  };

  const openCreateForm = () => {
    resetForm();
    setForm({ ...emptyForm, sira: items.length + 1 });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({
      baslik: item.baslik || "",
      aciklama: item.aciklama || "",
      ikon: item.ikon || "web",
      gorsel_url: item.gorsel_url || "",
      ozellikler: (item.ozellikler || []).join(", "),
      sira: item.sira ?? 0,
    });
    setImagePreview(item.gorsel_url || null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sira" ? Number(value) : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const errorMsg = validateImageFile(file);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    const imageSrc = URL.createObjectURL(file);
    setCropModal({ open: true, imageSrc });
  };

  const uploadCoverImage = async (file) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const filePath = `services/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCropComplete = async (file) => {
    const url = await uploadCoverImage(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, gorsel_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(form.baslik ?? "").trim()) {
      toast.error("Hizmet başlığı zorunludur.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      editingId ? "Hizmet güncelleniyor..." : "Hizmet ekleniyor..."
    );

    try {
      const payload = {
        baslik: (form.baslik ?? "").trim(),
        aciklama: (form.aciklama ?? "").trim() || null,
        ikon: form.ikon || "web",
        gorsel_url: (form.gorsel_url ?? "").trim() || null,
        ozellikler: (form.ozellikler ?? "")
          .split(",")
          .map((t) => (t ?? "").trim())
          .filter(Boolean),
        sira: form.sira ?? 0,
      };

      if (editingId) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Hizmet güncellendi.", { id: toastId });
      } else {
        const { error } = await supabase.from("services").insert([payload]);
        if (error) throw error;
        toast.success("Hizmet eklendi.", { id: toastId });
      }

      resetForm();
      fetchServices();
    } catch (err) {
      toast.error(err.message || "İşlem başarısız.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const toastId = toast.loading("Hizmet siliniyor...");

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      toast.success("Hizmet silindi.", { id: toastId });
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      toast.error(err.message || "Silme başarısız.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const PreviewIcon = getServiceIcon(form.ikon);
  const previewImage = getServiceImage(form.ikon, imagePreview || form.gorsel_url);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Hizmetleri Yönet</h2>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            Hizmet kartlarına görsel ve özellik etiketleri ekleyin.
          </p>
        </div>
        {!showForm && !tableMissing && (
          <button onClick={openCreateForm} className={adminBtnPrimary}>
            <FiPlus /> Yeni Hizmet
          </button>
        )}
      </div>

      {tableMissing && (
        <div className={`${adminCardClass} border-amber-500/40 bg-amber-500/10 space-y-3`}>
          <h3 className="text-lg font-bold text-amber-200">Hizmetler tablosu henüz oluşturulmamış</h3>
          <p className="text-sm text-[#dfd9ff]/80 leading-relaxed">
            Supabase projenizde <code className="text-amber-200">services</code> tablosu yok.
            Proje klasöründeki <strong className="text-white">supabase/services.sql</strong> dosyasını
            Supabase Dashboard → SQL Editor&apos;de çalıştırın, ardından sayfayı yenileyin.
          </p>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${adminCardClass} space-y-5 border-[#915EFF]/30`}
        >
          <h3 className="text-lg font-bold text-white">
            {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={adminLabelClass}>Başlık *</label>
              <input
                name="baslik"
                value={form.baslik}
                onChange={handleChange}
                required
                placeholder="Web Sitesi Yapımı"
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>İkon</label>
              <select
                name="ikon"
                value={form.ikon}
                onChange={handleChange}
                className={adminInputClass}
              >
                {SERVICE_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={adminLabelClass}>Açıklama</label>
            <textarea
              name="aciklama"
              value={form.aciklama}
              onChange={handleChange}
              rows={3}
              placeholder="Hizmetin kısa açıklaması..."
              className={adminInputClass}
            />
          </div>

          <div>
            <label className={adminLabelClass}>Özellikler (virgülle ayırın)</label>
            <input
              name="ozellikler"
              value={form.ozellikler}
              onChange={handleChange}
              placeholder="Responsive, SEO Uyumlu, Mobil Menü"
              className={adminInputClass}
            />
          </div>

          <div>
            <label className={adminLabelClass}>Kapak Görseli</label>
            <div className="flex flex-wrap items-center gap-4">
              <label className={`${adminBtnSecondary} cursor-pointer`}>
                <FiUpload /> Görsel Seç ve Kırp
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Önizleme"
                  className="w-32 h-20 object-cover rounded-lg border border-white/10"
                />
              )}
            </div>
            <p className="text-xs text-[#dfd9ff]/50 mt-2">
              Görsel yüklemezseniz hizmet türüne göre varsayılan görsel kullanılır.
            </p>
          </div>

          <div>
            <label className={adminLabelClass}>Sıra</label>
            <input
              name="sira"
              type="number"
              min={0}
              value={form.sira}
              onChange={handleChange}
              className={adminInputClass}
            />
          </div>

          <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10">
            <div className="relative h-28">
              <img
                src={previewImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151030] to-transparent" />
            </div>
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#915EFF]/15 flex items-center justify-center text-[#915EFF] shrink-0">
                <PreviewIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-[#dfd9ff]/60 mb-1">Kart Önizlemesi</p>
                <p className="text-white font-semibold">{form.baslik || "Hizmet başlığı"}</p>
                <p className="text-sm text-[#dfd9ff]/70 mt-1 line-clamp-2">
                  {form.aciklama || "Açıklama burada görünür."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className={adminBtnSecondary}
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#915EFF]" />
        </div>
      ) : items.length === 0 ? (
        !tableMissing && (
          <div className={`${adminCardClass} text-center py-12`}>
            <p className="text-[#dfd9ff]/70">Henüz hizmet eklenmemiş.</p>
            <button onClick={openCreateForm} className={`${adminBtnPrimary} mt-4 mx-auto`}>
              <FiPlus /> İlk Hizmeti Ekle
            </button>
          </div>
        )
      ) : (
        <div className={`${adminCardClass} space-y-3`}>
          {items.map((item) => {
            const Icon = getServiceIcon(item.ikon);
            const thumb = getServiceImage(item.ikon, item.gorsel_url);
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <img
                  src={thumb}
                  alt=""
                  className="w-16 h-11 object-cover rounded-lg border border-white/10 shrink-0"
                />
                <div className="w-8 h-8 rounded-lg bg-[#915EFF]/15 flex items-center justify-center text-[#915EFF] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.baslik}</p>
                  <p className="text-xs text-[#dfd9ff]/60 truncate">
                    {item.aciklama || "—"}
                  </p>
                </div>
                <span className="text-xs text-[#915EFF] font-mono shrink-0">
                  #{item.sira}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEditForm(item)}
                    className={adminBtnIcon}
                    title="Düzenle"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className={`${adminBtnIcon} hover:text-red-300 hover:border-red-500/30`}
                    title="Sil"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hizmeti Sil"
        message={`"${deleteTarget?.baslik}" hizmetini silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <ImageCropperModal
        open={cropModal.open}
        imageSrc={cropModal.imageSrc}
        aspect={COVER_ASPECT}
        title="Hizmet Görselini Kırp"
        onClose={closeCropModal}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default AdminServices;
