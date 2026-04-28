import { Router } from "express";
import { getVulnerabilities } from "../services/securityService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/:name(*)", async (req, res, next) => {
  try {
    const { name } = req.params;
    const key = `sec:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getVulnerabilities(name);
    cacheSet(key, data, TTL.SECURITY);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
