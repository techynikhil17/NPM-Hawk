import { Router } from "express";
import { getAllVersions } from "../services/npmService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/:name(*)", async (req, res, next) => {
  try {
    const { name } = req.params;
    const key = `ver:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getAllVersions(name);
    cacheSet(key, data, TTL.VERSIONS);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
