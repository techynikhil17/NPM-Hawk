import fetch from "node-fetch";
import { NPM_REGISTRY, NPM_DOWNLOADS } from "../utils/constants.js";

export async function getPackageMeta(name) {
  const encoded = encodeURIComponent(name).replace("%40", "@");
  const res = await fetch(`${NPM_REGISTRY}/${encoded}/latest`);
  if (!res.ok) {
    const err = new Error(`Package "${name}" not found`);
    err.status = 404;
    throw err;
  }
  const data = await res.json();
  return {
    name: data.name,
    version: data.version,
    description: data.description || "",
    license: data.license || "Unknown",
    homepage: data.homepage || null,
    repository: data.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") || null,
    maintainers: (data.maintainers || []).map((m) => m.name),
    keywords: data.keywords || [],
    engines: data.engines || {},
    dependencies: Object.keys(data.dependencies || {}).length,
    devDependencies: Object.keys(data.devDependencies || {}).length,
  };
}

export async function getDownloadsPoint(name, period) {
  const encoded = encodeURIComponent(name);
  const res = await fetch(`${NPM_DOWNLOADS}/downloads/point/${period}/${encoded}`);
  if (!res.ok) throw new Error(`Downloads point fetch failed for ${name}`);
  return res.json();
}

export async function getDownloadsRange(name, period) {
  try {
    const encoded = encodeURIComponent(name);
    const res = await fetch(`${NPM_DOWNLOADS}/downloads/range/${period}/${encoded}`);
    if (!res.ok) return { package: name, downloads: [], error: `HTTP ${res.status}` };
    return res.json();
  } catch (e) {
    return { package: name, downloads: [], error: e.message };
  }
}

export async function getVersionDownloads(name) {
  const encoded = encodeURIComponent(name);
  const res = await fetch(`${NPM_DOWNLOADS}/versions/${encoded}/last-week`);
  if (!res.ok) return { downloads: {} };
  return res.json();
}

export async function getAllVersions(name) {
  const encoded = encodeURIComponent(name).replace("%40", "@");
  const res = await fetch(`${NPM_REGISTRY}/${encoded}`);
  if (!res.ok) throw new Error(`Versions fetch failed for ${name}`);
  const data = await res.json();
  const time = data.time || {};
  return {
    distTags: data["dist-tags"] || {},
    versions: Object.keys(data.versions || {})
      .filter((v) => time[v])
      .map((v) => ({ version: v, date: time[v] }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30),
  };
}

export async function searchPackages(query) {
  const encoded = encodeURIComponent(query);
  const res = await fetch(`${NPM_REGISTRY}/-/v1/search?text=${encoded}&size=10`);
  if (!res.ok) return { objects: [] };
  const data = await res.json();
  return data.objects.map((o) => ({
    name: o.package.name,
    description: o.package.description,
    version: o.package.version,
    score: o.score?.final || 0,
  }));
}

export async function getAllTimeDownloads(name) {
  const today = new Date().toISOString().slice(0, 10);
  const encoded = encodeURIComponent(name);
  const url = `${NPM_DOWNLOADS}/downloads/point/2015-01-10:${today}/${encoded}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

