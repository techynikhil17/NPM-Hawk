import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api.js";

const BATCH_SIZE = 20; // fetch 20 packages at a time from backend

// Fetch ALL packages in batches, merge results incrementally
export function usePackageData(names) {
  const [data, setData]         = useState({});
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 }); // for progress UI
  const [error, setError]       = useState(null);
  const abortRef = useRef(null);

  const key = (names || []).slice().sort().join(",");

  useEffect(() => {
    if (!names || names.length === 0) {
      setData({}); setLoading(false); setProgress({ done:0, total:0 }); return;
    }

    // abort previous run
    if (abortRef.current) abortRef.current = true;
    const cancelled = { value: false };
    abortRef.current = cancelled;

    setLoading(true);
    setError(null);
    setProgress({ done: 0, total: names.length });

    // kick off batch-fetching, merging results as they arrive
    (async () => {
      let merged = {};
      for (let i = 0; i < names.length; i += BATCH_SIZE) {
        if (cancelled.value) return;
        const batch = names.slice(i, i + BATCH_SIZE);
        try {
          const results = await api.compare(batch);
          if (cancelled.value) return;
          results.forEach(r => { merged = { ...merged, [r.name]: r }; });
          setData(prev => ({ ...prev, ...merged }));
          setProgress({ done: Math.min(i + BATCH_SIZE, names.length), total: names.length });
        } catch (err) {
          if (!cancelled.value) setError(err.message);
        }
      }
      if (!cancelled.value) setLoading(false);
    })();

    return () => { cancelled.value = true; };
  }, [key]);

  return { data, loading, progress, error };
}

export function useDownloadHistory(names, period = "last-month") {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);

  const chartNames = (names || []).slice(0, 5);
  const key = chartNames.join(",");

  useEffect(() => {
    if (!chartNames.length) { setData([]); return; }
    setLoading(true);
    api.compareDownloads(chartNames, period)
      .then(results => {
        // Filter out packages that returned errors or empty arrays
        const valid = results.filter(r => r && Array.isArray(r.downloads) && r.downloads.length > 0);
        setData(valid);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [key, period]);

  return { data, loading };
}
