import fetch from "node-fetch";
import { NPMS_API } from "../utils/constants.js";

export async function getNpmsScore(name) {
  const encoded = encodeURIComponent(name);
  const res = await fetch(`${NPMS_API}/package/${encoded}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    score: data.score || {},
    evaluation: data.evaluation || {},
    collected: {
      github: data.collected?.github || null,
      npm: data.collected?.npm || null,
      metadata: data.collected?.metadata || null,
    },
  };
}
