import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnIcon,
} from "../../utils/adminStyles";

const emptyForm = {
  sirket_adi: "",
  pozisyon: "",
  baslangic_tarihi: "",
  bitis_tarihi: "",
  aciklama: "",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });
};

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [devamEdiyor, setDevamEdiyor] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("baslangic_tarihi", { ascending: false });

    if (error) {
      toast.error("Deneyimler yüklenemedi: " + error.message);
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDevamEdiyor(false);
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (exp) => {
    setEditingId(exp.id);
    setForm({
      sirket_adi: exp.sirket_adi || "",
      pozisyon: exp.pozisyon || "",
      baslangic_tarihi: exp.baslangic_tarihi || "",
      bitis_tarihi: exp.bitis_tarihi || "",
      aciklama: exp.aciklama || "",
    });
    setDevamEdiyor(!exp.bitis_tarihi);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(form.sirket_adi ?? "").trim() || !(form.pozisyon ?? "").trim()) {
      toast.error("Şirket adı ve pozisyon zorunludur.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      editingId ? "Deneyim güncelleniyor..." : "Deneyim ekleniyor..."
    );

    try {
      const payload = {
        sirket_adi: (form.sirket_adi ?? "").trim(),
        pozisyon: (form.pozisyon ?? "").trim(),
        baslangic_tarihi: form.baslangic_tarihi || null,
        bitis_tarihi: devamEdiyor ? null : form.bitis_tarihi || null,
        aciklama: (form.aciklama ?? "").trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("experiences")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Deneyim güncellendi.", { id: toastId });
      } else {
        const { error } = await supabase.from("experiences").insert([payload]);
        if (error) throw error;
        toast.success("Deneyim eklendi.", { id: toastId });
      }

      resetForm();
      fetchExperiences();
    } catch (err) {
      toast.error(err.message || "İşlem başarısız.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const toastId = toast.loading("Deneyim siliniyor...");

    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      toast.success("Deneyim silindi.", { id: toastId });
      setDeleteTarget(null);
      fetchExperiences();
    } catch (err) {
      toast.error(err.message || "Silme başarısız.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Deneyimleri Yönet</h2>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            İş, eğitim ve kulüp deneyimlerinizi yönetin.
          </p>
        </div>
        {!showForm && (
          <button onClick={openCreateForm} className={adminBtnPrimary}>
            <FiPlus /> Yeni Deneyim
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${adminCardClass} space-y-5 border-[#3b82f6]/30`}
        >
          <h3 className="text-lg font-bold text-white">
            {editingId ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={adminLabelClass}>Şirket / Kurum Adı *</label>
              <input
                name="sirket_adi"
                value={form.sirket_adi}
                onChange={handleChange}
                required
                placeholder="Barın Üniversitesi"
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>Pozisyon *</label>
              <input
                name="pozisyon"
                value={form.pozisyon}
                onChange={handleChange}
                required
                placeholder="Bilgisayar Teknolojisi Öğrencisi"
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>Başlangıç Tarihi</label>
              <input
                name="baslangic_tarihi"
                type="date"
                value={form.baslangic_tarihi}
                onChange={handleChange}
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>Bitiş Tarihi</label>
              <input
                name="bitis_tarihi"
                type="date"
                value={form.bitis_tarihi}
                onChange={handleChange}
                disabled={devamEdiyor}
                className={adminInputClass}
              />
              <label className="flex items-center gap-2 mt-2 text-sm text-[#dfd9ff]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={devamEdiyor}
                  onChange={(e) => {
                    setDevamEdiyor(e.target.checked);
                    if (e.target.checked) {
                      setForm((prev) => ({ ...prev, bitis_tarihi: "" }));
                    }
                  }}
                  className="rounded accent-[#915EFF]"
                />
                Halen devam ediyor
              </label>
            </div>

            <div className="md:col-span-2">
              <label className={adminLabelClass}>Açıklama</label>
              <textarea
                name="aciklama"
                value={form.aciklama}
                onChange={handleChange}
                rows={4}
                placeholder="Deneyim detayları..."
                className={adminInputClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : editingId ? (
                "Güncelle"
              ) : (
                "Kaydet"
              )}
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3b82f6]" />
        </div>
      ) : experiences.length === 0 ? (
        <div className={`${adminCardClass} text-center py-12`}>
          <p className="text-[#dfd9ff]/70">Henüz deneyim eklenmemiş.</p>
          <button onClick={openCreateForm} className={`${adminBtnPrimary} mt-4 mx-auto`}>
            <FiPlus /> İlk Deneyimi Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className={adminCardClass}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-white text-lg">{exp.pozisyon}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#93c5fd]">
                      {exp.sirket_adi}
                    </span>
                  </div>
                  <p className="text-xs text-[#dfd9ff]/60 mt-1">
                    {formatDate(exp.baslangic_tarihi)} —{" "}
                    {exp.bitis_tarihi ? formatDate(exp.bitis_tarihi) : "Devam Ediyor"}
                  </p>
                  {exp.aciklama && (
                    <p className="text-sm text-[#dfd9ff]/80 mt-3 whitespace-pre-line">
                      {exp.aciklama}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditForm(exp)}
                    className={adminBtnIcon}
                    title="Düzenle"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(exp)}
                    className={`${adminBtnIcon} hover:text-red-300 hover:border-red-500/30`}
                    title="Sil"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Deneyimi Sil"
        message={`"${deleteTarget?.pozisyon}" deneyimini silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminExperiences;
