import { Router } from "express";
import { getDownloadsPoint, getDownloadsRange, getVersionDownloads } from "../services/npmService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/point/:period/:name(*)", async (req, res, next) => {
  try {
    const { period, name } = req.params;
    const key = `dl:point:${period}:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getDownloadsPoint(name, period);
    cacheSet(key, data, TTL.DOWNLOADS_POINT);
    res.json(data);
  } catch (err) { next(err); }
});

router.get("/range/:period/:name(*)", async (req, res, next) => {
  try {
    const { period, name } = req.params;
    const key = `dl:range:${period}:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getDownloadsRange(name, period);
    cacheSet(key, data, TTL.DOWNLOADS_RANGE);
    res.json(data);
  } catch (err) { next(err); }
});

router.get("/versions/:name(*)", async (req, res, next) => {
  try {
    const { name } = req.params;
    const key = `ver-dl:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getVersionDownloads(name);
    cacheSet(key, data, TTL.VERSIONS);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
