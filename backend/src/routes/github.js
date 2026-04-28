import { Router } from "express";
import { getRepoInfo, getCommitActivity } from "../services/githubService.js";
import { cacheGet, cacheSet } from "../middleware/cache.js";
import { TTL } from "../utils/constants.js";

const router = Router();

router.get("/:owner/:repo/commits", async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const key = `gh:commits:${owner}/${repo}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getCommitActivity(owner, repo);
    cacheSet(key, data, TTL.GITHUB_COMMITS);
    res.json(data);
  } catch (err) { next(err); }
});

router.get("/:owner/:repo", async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const key = `gh:${owner}/${repo}`;
    const cached = cacheGet(key);
    if (cached) return res.json(cached);
    const data = await getRepoInfo(owner, repo);
    if (!data) return res.status(404).json({ error: "Repo not found" });
    cacheSet(key, data, TTL.GITHUB);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
