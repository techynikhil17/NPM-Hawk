import fetch from "node-fetch";
import { GITHUB_API } from "../utils/constants.js";

function headers() {
  const h = { "User-Agent": "npm-hawk/1.0", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function getRepoInfo(owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: headers() });
  if (!res.ok) return null;
  const d = await res.json();
  return {
    stars: d.stargazers_count,
    forks: d.forks_count,
    openIssues: d.open_issues_count,
    license: d.license?.spdx_id || null,
    hasIssues: d.has_issues,
    archived: d.archived,
    defaultBranch: d.default_branch,
    pushedAt: d.pushed_at,
    createdAt: d.created_at,
  };
}

export async function getCommitActivity(owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/stats/commit_activity`, { headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((w) => ({ week: w.week, total: w.total, days: w.days }));
}

export function parseRepoUrl(url) {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([\w.-]+)\/([\w.-]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}
