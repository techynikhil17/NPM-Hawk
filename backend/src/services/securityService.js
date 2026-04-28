import fetch from "node-fetch";
import { OSV_API } from "../utils/constants.js";

export async function getVulnerabilities(name) {
  try {
    const res = await fetch(`${OSV_API}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package: { name, ecosystem: "npm" } }),
    });
    if (!res.ok) return { vulnerabilities: [], count: 0 };
    const data = await res.json();
    const vulns = (data.vulns || []).map((v) => ({
      id: v.id,
      summary: v.summary || "No summary",
      severity: v.database_specific?.severity || v.severity?.[0]?.score || "UNKNOWN",
      published: v.published,
      aliases: v.aliases || [],
      references: (v.references || []).slice(0, 2).map((r) => r.url),
    }));
    return { vulnerabilities: vulns, count: vulns.length };
  } catch {
    return { vulnerabilities: [], count: 0 };
  }
}
