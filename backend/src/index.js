import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import packageRouter from "./routes/package.js";
import downloadsRouter from "./routes/downloads.js";
import versionsRouter from "./routes/versions.js";
import githubRouter from "./routes/github.js";
import healthRouter from "./routes/health.js";
import securityRouter from "./routes/security.js";
import compareRouter from "./routes/compare.js";
import npmUserRouter from "./routes/npmUser.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use("/api", limiter);

app.use("/api/v1/package", packageRouter);
app.use("/api/v1/downloads", downloadsRouter);
app.use("/api/v1/versions", versionsRouter);
app.use("/api/v1/github", githubRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/security", securityRouter);
app.use("/api/v1/compare", compareRouter);
app.use("/api/v1/npm-user", npmUserRouter);

app.get("/api/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`NPM Hawk backend running on http://localhost:${PORT}`));
