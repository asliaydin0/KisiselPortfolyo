import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiGithub, FiDownload, FiCheckSquare, FiSquare } from "react-icons/fi";
import { supabase } from "../../config/supabaseClient";
import {
  fetchGitHubRepos,
  filterReposForImport,
  mapGitHubRepoToProject,
  isRepoAlreadyImported,
} from "../../utils/githubApi";
import {
  adminInputClass,
  adminLabelClass,
  adminCardClass,
  adminBtnPrimary,
  adminBtnSecondary,
} from "../../utils/adminStyles";

const GitHubImportPanel = ({ existingProjects = [], onImported }) => {
  const [username, setUsername] = useState("asliaydin0");
  const [token, setToken] = useState("");
  const [includeForks, setIncludeForks] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [fetching, setFetching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const importableRepos = useMemo(
    () => filterReposForImport(repos, { includeForks }),
    [repos, includeForks]
  );

  const newRepos = useMemo(
    () =>
      importableRepos.filter(
        (repo) => !isRepoAlreadyImported(repo, existingProjects)
      ),
    [importableRepos, existingProjects]
  );

  const toggleRepo = (repoId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(repoId)) next.delete(repoId);
      else next.add(repoId);
      return next;
    });
  };

  const selectAllNew = () => {
    setSelected(new Set(newRepos.map((repo) => repo.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const handleFetch = async () => {
    setFetching(true);
    const toastId = toast.loading("GitHub repoları getiriliyor...");

    try {
      const data = await fetchGitHubRepos(username, token);
      setRepos(data);
      setExpanded(true);

      const fresh = filterReposForImport(data, { includeForks }).filter(
        (repo) => !isRepoAlreadyImported(repo, existingProjects)
      );
      setSelected(new Set(fresh.map((repo) => repo.id)));

      toast.success(`${data.length} repo bulundu.`, { id: toastId });
    } catch (err) {
      toast.error(err.message || "Repolar alınamadı.", { id: toastId });
    } finally {
      setFetching(false);
    }
  };

  const handleImport = async () => {
    const chosen = newRepos.filter((repo) => selected.has(repo.id));

    if (chosen.length === 0) {
      toast.error("İçe aktarılacak en az bir repo seçin.");
      return;
    }

    setImporting(true);
    const toastId = toast.loading(`${chosen.length} proje içe aktarılıyor...`);

    try {
      const payload = chosen.map(mapGitHubRepoToProject);
      const { error } = await supabase.from("projects").insert(payload);

      if (error) throw error;

      toast.success(`${chosen.length} proje başarıyla eklendi.`, { id: toastId });
      setSelected(new Set());
      onImported?.();
    } catch (err) {
      toast.error(err.message || "İçe aktarma başarısız.", { id: toastId });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={`${adminCardClass} border-[#915EFF]/20 space-y-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiGithub /> GitHub&apos;dan Toplu İçe Aktar
          </h3>
          <p className="text-sm text-[#dfd9ff]/70 mt-1">
            GitHub kullanıcı adınızı girin, repolarınızı seçin ve tek tıkla portföye
            ekleyin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>GitHub Kullanıcı Adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="asliaydin0"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>
            Token <span className="text-xs opacity-60">(opsiyonel)</span>
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_... (limit artırır)"
            className={adminInputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#dfd9ff]/80 cursor-pointer">
        <input
          type="checkbox"
          checked={includeForks}
          onChange={(e) => setIncludeForks(e.target.checked)}
          className="rounded accent-[#915EFF]"
        />
        Fork edilmiş repoları da göster
      </label>

      <button
        type="button"
        onClick={handleFetch}
        disabled={fetching || !username.trim()}
        className={adminBtnPrimary}
      >
        {fetching ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Repolar Getiriliyor...
          </>
        ) : (
          <>
            <FiGithub /> Repoları Listele
          </>
        )}
      </button>

      {expanded && repos.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#dfd9ff]/80">
              {newRepos.length} yeni repo · {selected.size} seçili
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={selectAllNew} className={adminBtnSecondary}>
                <FiCheckSquare /> Tüm Yenileri Seç
              </button>
              <button type="button" onClick={clearSelection} className={adminBtnSecondary}>
                <FiSquare /> Seçimi Temizle
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {importableRepos.map((repo) => {
              const imported = isRepoAlreadyImported(repo, existingProjects);
              const isSelected = selected.has(repo.id);

              return (
                <label
                  key={repo.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    imported
                      ? "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "border-[#915EFF]/40 bg-[#915EFF]/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={imported}
                    onChange={() => toggleRepo(repo.id)}
                    className="mt-1 rounded accent-[#915EFF]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white truncate">
                        {repo.name}
                      </span>
                      {repo.language && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#dfd9ff]">
                          {repo.language}
                        </span>
                      )}
                      {repo.fork && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200">
                          fork
                        </span>
                      )}
                      {imported && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">
                          zaten ekli
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#dfd9ff]/60 mt-1 line-clamp-2">
                      {repo.description || "Açıklama yok"}
                    </p>
                    {repo.topics?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[#915EFF]/15 text-[#dfd9ff]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={importing || selected.size === 0}
            className={adminBtnPrimary}
          >
            {importing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İçe Aktarılıyor...
              </>
            ) : (
              <>
                <FiDownload /> Seçilenleri İçe Aktar ({selected.size})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubImportPanel;
