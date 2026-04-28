import { Router } from "express";
import { getPackageMeta, getDownloadsPoint } from "../services/npmService.js";
import { getNpmsScore } from "../services/npmsService.js";
import { getRepoInfo, parseRepoUrl } from "../services/githubService.js";
import { getVulnerabilities } from "../services/securityService.js";
import { computeHealthScore } from "../services/healthService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/:name(*)", async (req, res, next) => {
  try {
    const { name } = req.params;
    const key = `health:${name}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const [meta, npms, security, weeklyDl] = await Promise.allSettled([
      getPackageMeta(name),
      getNpmsScore(name),
      getVulnerabilities(name),
      getDownloadsPoint(name, "last-week"),
    ]);

    const metaVal = meta.status === "fulfilled" ? meta.value : null;
    const npmsVal = npms.status === "fulfilled" ? npms.value : null;
    const secVal = security.status === "fulfilled" ? security.value : { vulnerabilities: [] };
    const dlVal = weeklyDl.status === "fulfilled" ? weeklyDl.value : null;

    let githubVal = null;
    if (metaVal?.repository) {
      const parsed = parseRepoUrl(metaVal.repository);
      if (parsed) {
        try { githubVal = await getRepoInfo(parsed.owner, parsed.repo); } catch {}
      }
    }

    const health = computeHealthScore(npmsVal, githubVal, secVal, dlVal?.downloads || 0);
    cacheSet(key, health, TTL.HEALTH);
    res.json(health);
  } catch (err) { next(err); }
});

export default router;
