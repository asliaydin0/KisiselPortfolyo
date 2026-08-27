import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  SERVICE_ICON_OPTIONS,
  getServiceIcon,
} from "../../utils/serviceIcons";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnIcon,
} from "../../utils/adminStyles";

const emptyForm = {
  baslik: "",
  aciklama: "",
  ikon: "web",
  sira: 0,
};

const AdminServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sira", { ascending: true });

    if (error) {
      toast.error("Hizmetler yüklenemedi: " + error.message);
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
    setShowForm(false);
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
      sira: item.sira ?? 0,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sira" ? Number(value) : value,
    }));
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Hizmetleri Yönet</h2>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            Sitede gösterilen hizmet alanlarını düzenleyin.
          </p>
        </div>
        {!showForm && (
          <button onClick={openCreateForm} className={adminBtnPrimary}>
            <FiPlus /> Yeni Hizmet
          </button>
        )}
      </div>

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

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#915EFF]/15 flex items-center justify-center text-[#915EFF] shrink-0">
              <PreviewIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#dfd9ff]/60 mb-1">Önizleme</p>
              <p className="text-white font-semibold">{form.baslik || "Hizmet başlığı"}</p>
              <p className="text-sm text-[#dfd9ff]/70 mt-1 line-clamp-2">
                {form.aciklama || "Açıklama burada görünür."}
              </p>
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
        <div className={`${adminCardClass} text-center py-12`}>
          <p className="text-[#dfd9ff]/70">Henüz hizmet eklenmemiş.</p>
          <button onClick={openCreateForm} className={`${adminBtnPrimary} mt-4 mx-auto`}>
            <FiPlus /> İlk Hizmeti Ekle
          </button>
        </div>
      ) : (
        <div className={`${adminCardClass} space-y-3`}>
          {items.map((item) => {
            const Icon = getServiceIcon(item.ikon);
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#915EFF]/15 flex items-center justify-center text-[#915EFF] shrink-0">
                  <Icon className="w-4 h-4" />
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
    </div>
  );
};

export default AdminServices;
