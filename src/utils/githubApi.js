const GITHUB_API = "https://api.github.com";

const buildHeaders = (token) => {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  if (token?.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
};

const formatRepoTitle = (name) =>
  name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const mapGitHubRepoToProject = (repo) => {
  const technologies = [
    ...(repo.topics || []),
    repo.language,
  ].filter(Boolean);

  const uniqueTech = [...new Set(technologies.map((t) => String(t).toLowerCase()))];

  return {
    baslik: formatRepoTitle(repo.name),
    aciklama: repo.description?.trim() || `${formatRepoTitle(repo.name)} projesi.`,
    teknolojiler: uniqueTech,
    github_url: repo.html_url,
    live_url: repo.homepage?.trim() || null,
    image_url: null,
  };
};

/**
 * Kullanıcının GitHub repolarını çeker (sayfalamalı).
 */
export const fetchGitHubRepos = async (username, token = "") => {
  const cleanUsername = username.trim().replace(/^@/, "");
  if (!cleanUsername) {
    throw new Error("GitHub kullanıcı adı gerekli.");
  }

  const headers = buildHeaders(token || import.meta.env.VITE_GITHUB_TOKEN);
  const allRepos = [];
  let page = 1;
  const perPage = 100;

  while (page <= 10) {
    const url = `${GITHUB_API}/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=${perPage}&page=${page}&type=owner`;

    const response = await fetch(url, { headers });

    if (response.status === 404) {
      throw new Error(`"${cleanUsername}" GitHub kullanıcısı bulunamadı.`);
    }

    if (response.status === 403) {
      throw new Error(
        "GitHub API limiti aşıldı. Birkaç dakika bekleyin veya .env dosyasına VITE_GITHUB_TOKEN ekleyin."
      );
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || "GitHub repoları alınamadı.");
    }

    const repos = await response.json();
    allRepos.push(...repos);

    if (repos.length < perPage) break;
    page += 1;
  }

  return allRepos;
};

export const filterReposForImport = (repos, { includeForks = false } = {}) =>
  repos.filter((repo) => {
    if (repo.private) return false;
    if (!includeForks && repo.fork) return false;
    return true;
  });

export const isRepoAlreadyImported = (repo, existingProjects) => {
  const repoUrl = repo.html_url?.toLowerCase();
  return existingProjects.some(
    (project) => project.github_url?.toLowerCase() === repoUrl
  );
};
