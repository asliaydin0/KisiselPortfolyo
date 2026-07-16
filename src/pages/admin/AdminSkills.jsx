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
  yetenek_adi: "",
  seviye: 50,
};

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("seviye", { ascending: false });

    if (error) {
      toast.error("Yetenekler yüklenemedi: " + error.message);
    } else {
      setSkills(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (skill) => {
    setEditingId(skill.id);
    setForm({
      yetenek_adi: skill.yetenek_adi || "",
      seviye: skill.seviye ?? 50,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "seviye" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.yetenek_adi.trim()) {
      toast.error("Yetenek adı zorunludur.");
      return;
    }

    if (form.seviye < 0 || form.seviye > 100) {
      toast.error("Seviye 0 ile 100 arasında olmalıdır.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      editingId ? "Yetenek güncelleniyor..." : "Yetenek ekleniyor..."
    );

    try {
      const payload = {
        yetenek_adi: form.yetenek_adi.trim(),
        seviye: form.seviye,
      };

      if (editingId) {
        const { error } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Yetenek güncellendi.", { id: toastId });
      } else {
        const { error } = await supabase.from("skills").insert([payload]);
        if (error) throw error;
        toast.success("Yetenek eklendi.", { id: toastId });
      }

      resetForm();
      fetchSkills();
    } catch (err) {
      toast.error(err.message || "İşlem başarısız.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const toastId = toast.loading("Yetenek siliniyor...");

    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      toast.success("Yetenek silindi.", { id: toastId });
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      toast.error(err.message || "Silme başarısız.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 80) return "from-[#915EFF] to-[#bf61ff]";
    if (level >= 50) return "from-[#3b82f6] to-[#60a5fa]";
    return "from-[#6b7280] to-[#9ca3af]";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Yetenekleri Yönet</h2>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            Teknik yeteneklerinizi ve seviyelerinizi yönetin.
          </p>
        </div>
        {!showForm && (
          <button onClick={openCreateForm} className={adminBtnPrimary}>
            <FiPlus /> Yeni Yetenek
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${adminCardClass} space-y-5 border-emerald-500/30`}
        >
          <h3 className="text-lg font-bold text-white">
            {editingId ? "Yeteneği Düzenle" : "Yeni Yetenek Ekle"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={adminLabelClass}>Yetenek Adı *</label>
              <input
                name="yetenek_adi"
                value={form.yetenek_adi}
                onChange={handleChange}
                required
                placeholder="React, Python, Figma..."
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>
                Seviye: <span className="text-[#915EFF] font-bold">{form.seviye}%</span>
              </label>
              <input
                name="seviye"
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.seviye}
                onChange={handleChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#915EFF] bg-white/10"
              />
              <div className="flex justify-between text-[10px] text-[#dfd9ff]/50 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-[#dfd9ff]/60 mb-2">Önizleme</p>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium w-24 truncate">
                {form.yetenek_adi || "Yetenek"}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(form.seviye)} transition-all duration-300`}
                  style={{ width: `${form.seviye}%` }}
                />
              </div>
              <span className="text-sm text-[#915EFF] font-bold w-10 text-right">
                {form.seviye}%
              </span>
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-400" />
        </div>
      ) : skills.length === 0 ? (
        <div className={`${adminCardClass} text-center py-12`}>
          <p className="text-[#dfd9ff]/70">Henüz yetenek eklenmemiş.</p>
          <button onClick={openCreateForm} className={`${adminBtnPrimary} mt-4 mx-auto`}>
            <FiPlus /> İlk Yeteneği Ekle
          </button>
        </div>
      ) : (
        <div className={`${adminCardClass} space-y-4`}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <span className="text-white font-medium w-32 sm:w-40 truncate shrink-0">
                {skill.yetenek_adi}
              </span>
              <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(skill.seviye)} transition-all duration-500`}
                  style={{ width: `${skill.seviye}%` }}
                />
              </div>
              <span className="text-sm text-[#915EFF] font-bold w-12 text-right shrink-0">
                {skill.seviye}%
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEditForm(skill)}
                  className={adminBtnIcon}
                  title="Düzenle"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(skill)}
                  className={`${adminBtnIcon} hover:text-red-300 hover:border-red-500/30`}
                  title="Sil"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Yeteneği Sil"
        message={`"${deleteTarget?.yetenek_adi}" yeteneğini silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminSkills;
