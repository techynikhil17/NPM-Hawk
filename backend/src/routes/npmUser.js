import { Router } from "express";
import fetch from "node-fetch";
import { NPM_REGISTRY } from "../utils/constants.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";

const router = Router();

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const key = `npm-user:${username}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    // Fetch packages maintained by this user via npm search
    const searchUrl = `${NPM_REGISTRY}/-/v1/search?text=maintainer:${encodeURIComponent(username)}&size=250`;
    const res1 = await fetch(searchUrl);
    if (!res1.ok) {
      return res.status(404).json({ error: `npm user "${username}" not found or has no packages` });
    }
    const searchData = await res1.json();
    const packages = (searchData.objects || []).map((o) => ({
      name: o.package.name,
      description: o.package.description || "",
      version: o.package.version,
      date: o.package.date,
      keywords: o.package.keywords || [],
      links: o.package.links || {},
      score: o.score?.final || 0,
      searchScore: o.searchScore || 0,
    }));

    const result = {
      username,
      packageCount: packages.length,
      packages,
    };

    cacheSet(key, result, 1800); // 30 min TTL
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
