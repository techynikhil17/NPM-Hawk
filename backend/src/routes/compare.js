import { Router } from "express";
import { getPackageMeta, getDownloadsPoint, getDownloadsRange, getAllTimeDownloads } from "../services/npmService.js";
import { getNpmsScore }       from "../services/npmsService.js";
import { getRepoInfo, parseRepoUrl } from "../services/githubService.js";
import { getVulnerabilities } from "../services/securityService.js";
import { computeHealthScore } from "../services/healthService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL }                from "../utils/constants.js";

const router = Router();

async function runInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function fetchPackageSummary(name) {
  const key = `compare:${name}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const [meta, npms, security, weeklyDl, monthlyDl, allTimeDl] = await Promise.allSettled([
    getPackageMeta(name),
    getNpmsScore(name),
    getVulnerabilities(name),
    getDownloadsPoint(name, "last-week"),
    getDownloadsPoint(name, "last-month"),
    getAllTimeDownloads(name),
  ]);

  const metaVal    = meta.status    === "fulfilled" ? meta.value    : { name };
  const npmsVal    = npms.status    === "fulfilled" ? npms.value    : null;
  const secVal     = security.status=== "fulfilled" ? security.value: { vulnerabilities: [] };
  const weeklyDlV  = weeklyDl.status=== "fulfilled" ? weeklyDl.value: null;
  const monthlyDlV = monthlyDl.status==="fulfilled" ? monthlyDl.value: null;
  const allTimeV   = allTimeDl.status==="fulfilled"? allTimeDl.value: null;

  let githubVal = null;
  if (metaVal?.repository) {
    const parsed = parseRepoUrl(metaVal.repository);
    if (parsed) {
      try { githubVal = await getRepoInfo(parsed.owner, parsed.repo); } catch {}
    }
  }

  const health = computeHealthScore(npmsVal, githubVal, secVal, weeklyDlV?.downloads || 0);

  const result = {
    name,
    meta:     metaVal,
    downloads: {
      weekly:  weeklyDlV?.downloads  || 0,
      monthly: monthlyDlV?.downloads || 0,
      allTime: allTimeV?.downloads   || null,
    },
    github:   githubVal,
    security: secVal,
    health,
    npms:     npmsVal ? { score: npmsVal.score } : null,
  };

  cacheSet(key, result, TTL.HEALTH);
  return result;
}

// No hard limit — batches 10 at a time internally
router.get("/", async (req, res, next) => {
  try {
    const names = (req.query.packages || "").split(",").map(p => p.trim()).filter(Boolean);
    if (!names.length) return res.status(400).json({ error: "No packages specified" });
    const results = await runInBatches(names, 10, fetchPackageSummary);
    res.json(results);
  } catch (err) { next(err); }
});

// Download history — kept at 5 for chart legibility
router.get("/downloads", async (req, res, next) => {
  try {
    const names  = (req.query.packages || "").split(",").map(p=>p.trim()).filter(Boolean).slice(0,5);
    const period = req.query.period || "last-month";
    if (!names.length) return res.status(400).json({ error: "No packages specified" });

    const results = await Promise.all(
      names.map(async (name) => {
        const key = `compare-dl:${period}:${name}`;
        const cached = cacheGet(key);
        if (cached) return cached;

        // Retry once on failure (handles transient npm API blips)
        let data = await getDownloadsRange(name, period);
        if (data?.error) {
          await new Promise(r => setTimeout(r, 500));
          data = await getDownloadsRange(name, period);
        }

        if (!data?.error) cacheSet(key, data, TTL.DOWNLOADS_RANGE);
        return data || { package: name, downloads: [] };
      })
    );
    res.json(results);
  } catch (err) { next(err); }
});

export default router;

