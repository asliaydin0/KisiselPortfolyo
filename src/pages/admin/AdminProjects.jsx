import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiExternalLink } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ImageCropperModal from "../../components/admin/ImageCropperModal";
import GitHubImportPanel from "../../components/admin/GitHubImportPanel";
import { validateImageFile } from "../../utils/cropImage";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnIcon,
} from "../../utils/adminStyles";

const BUCKET = "project-images";
const COVER_ASPECT = 16 / 9;

const emptyForm = {
  baslik: "",
  aciklama: "",
  teknolojiler: "",
  github_url: "",
  live_url: "",
  image_url: "",
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropModal, setCropModal] = useState({ open: false, imageSrc: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const closeCropModal = useCallback(() => {
    setCropModal((prev) => {
      if (prev.imageSrc) URL.revokeObjectURL(prev.imageSrc);
      return { open: false, imageSrc: null };
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Projeler yüklenemedi: " + error.message);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
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
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingId(project.id);
    setForm({
      baslik: project.baslik || "",
      aciklama: project.aciklama || "",
      teknolojiler: (project.teknolojiler || []).join(", "),
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
    });
    setImagePreview(project.image_url || null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { cacheControl: "3600", upsert: false, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCropComplete = async (file) => {
    const url = await uploadCoverImage(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(form.baslik ?? "").trim()) {
      toast.error("Proje başlığı zorunludur.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingId ? "Proje güncelleniyor..." : "Proje ekleniyor...");

    try {
      const payload = {
        baslik: (form.baslik ?? "").trim(),
        aciklama: (form.aciklama ?? "").trim(),
        teknolojiler: (form.teknolojiler ?? "")
          .split(",")
          .map((t) => (t ?? "").trim())
          .filter(Boolean),
        github_url: (form.github_url ?? "").trim() || null,
        live_url: (form.live_url ?? "").trim() || null,
        image_url: form.image_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Proje başarıyla güncellendi.", { id: toastId });
      } else {
        const { error } = await supabase.from("projects").insert([payload]);
        if (error) throw error;
        toast.success("Proje başarıyla eklendi.", { id: toastId });
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      toast.error(err.message || "İşlem başarısız oldu.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const toastId = toast.loading("Proje siliniyor...");

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      toast.success("Proje silindi.", { id: toastId });
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || "Silme işlemi başarısız.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Projeleri Yönet</h2>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            Portföyünüzde görünecek projeleri ekleyin, düzenleyin veya silin.
          </p>
        </div>
        {!showForm && (
          <div className="flex flex-wrap gap-3">
            <button onClick={openCreateForm} className={adminBtnPrimary}>
              <FiPlus /> Yeni Proje
            </button>
          </div>
        )}
      </div>

      {!showForm && (
        <GitHubImportPanel
          existingProjects={projects}
          onImported={fetchProjects}
        />
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${adminCardClass} space-y-5 border-[#915EFF]/30`}
        >
          <h3 className="text-lg font-bold text-white">
            {editingId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={adminLabelClass}>Başlık *</label>
              <input
                name="baslik"
                value={form.baslik}
                onChange={handleChange}
                required
                placeholder="MentalGarden"
                className={adminInputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={adminLabelClass}>Açıklama</label>
              <textarea
                name="aciklama"
                value={form.aciklama}
                onChange={handleChange}
                rows={4}
                placeholder="Projenin kısa açıklaması..."
                className={adminInputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={adminLabelClass}>
                Teknolojiler <span className="text-xs opacity-60">(virgülle ayırın)</span>
              </label>
              <input
                name="teknolojiler"
                value={form.teknolojiler}
                onChange={handleChange}
                placeholder="React, Python, FastAPI"
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>GitHub URL</label>
              <input
                name="github_url"
                type="url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={adminInputClass}
              />
            </div>

            <div>
              <label className={adminLabelClass}>Canlı Demo URL</label>
              <input
                name="live_url"
                type="url"
                value={form.live_url}
                onChange={handleChange}
                placeholder="https://..."
                className={adminInputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={adminLabelClass}>Kapak Fotoğrafı (16:9)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`${adminBtnSecondary} flex items-center gap-2`}
                >
                  <FiUpload /> Görsel Seç ve Kırp
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="w-40 h-[90px] object-cover rounded-xl border border-white/10"
                  />
                )}
              </div>
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#915EFF]" />
        </div>
      ) : projects.length === 0 ? (
        <div className={`${adminCardClass} text-center py-12`}>
          <p className="text-[#dfd9ff]/70">Henüz proje eklenmemiş.</p>
          <button onClick={openCreateForm} className={`${adminBtnPrimary} mt-4 mx-auto`}>
            <FiPlus /> İlk Projeyi Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((project) => (
            <div key={project.id} className={adminCardClass}>
              <div className="flex gap-4">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.baslik}
                    className="w-24 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    📁
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate">{project.baslik}</h4>
                  <p className="text-xs text-[#dfd9ff]/60 mt-1 line-clamp-2">
                    {project.aciklama || "Açıklama yok"}
                  </p>
                  {project.teknolojiler?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.teknolojiler.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#915EFF]/20 text-[#dfd9ff]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={adminBtnIcon}
                      title="GitHub"
                    >
                      <FiExternalLink size={16} />
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(project)}
                    className={adminBtnIcon}
                    title="Düzenle"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
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
        title="Projeyi Sil"
        message={`"${deleteTarget?.baslik}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <ImageCropperModal
        open={cropModal.open}
        imageSrc={cropModal.imageSrc}
        aspect={COVER_ASPECT}
        title="Kapak Fotoğrafını Kırp"
        onClose={closeCropModal}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default AdminProjects;
