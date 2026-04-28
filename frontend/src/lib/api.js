const BASE = "/api/v1";

async function apiFetch(url) {
  const res = await fetch(BASE + url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw Object.assign(new Error(err.error || "API error"), { status: res.status });
  }
  return res.json();
}

export const api = {
  search: (q) => apiFetch(`/package/search?q=${encodeURIComponent(q)}`),
  package: (name) => apiFetch(`/package/${encodeURIComponent(name)}`),
  versions: (name) => apiFetch(`/versions/${encodeURIComponent(name)}`),
  downloadsPoint: (name, period) => apiFetch(`/downloads/point/${period}/${encodeURIComponent(name)}`),
  downloadsRange: (name, period) => apiFetch(`/downloads/range/${period}/${encodeURIComponent(name)}`),
  versionDownloads: (name) => apiFetch(`/downloads/versions/${encodeURIComponent(name)}`),
  github: (owner, repo) => apiFetch(`/github/${owner}/${repo}`),
  githubCommits: (owner, repo) => apiFetch(`/github/${owner}/${repo}/commits`),
  health: (name) => apiFetch(`/health/${encodeURIComponent(name)}`),
  security: (name) => apiFetch(`/security/${encodeURIComponent(name)}`),
  compare: (names) => apiFetch(`/compare?packages=${names.map(encodeURIComponent).join(",")}`),
  compareDownloads: (names, period = "last-month") =>
    apiFetch(`/compare/downloads?packages=${names.map(encodeURIComponent).join(",")}&period=${period}`),
};
