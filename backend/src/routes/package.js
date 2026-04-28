import { Router } from "express";
import { getPackageMeta, searchPackages, getAllVersions } from "../services/npmService.js";
import { getNpmsScore } from "../services/npmsService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/search", async (req, res, next) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) return res.json([]);
    const key = `search:${q.toLowerCase()}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const results = await searchPackages(q);
    cacheSet(key, results, TTL.SEARCH);
    res.json(results);
  } catch (err) { next(err); }
});

router.get("/:name(*)", async (req, res, next) => {
  try {
    const name = req.params.name;
    const key = `pkg:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const meta = await getPackageMeta(name);
    cacheSet(key, meta, TTL.PACKAGE);
    res.json(meta);
  } catch (err) { next(err); }
});

export default router;
