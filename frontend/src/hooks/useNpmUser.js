import { useState, useEffect } from "react";

export function useNpmUser(username) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!username) { setData(null); return; }
    setLoading(true);
    setError(null);
    fetch(`/api/v1/npm-user/${encodeURIComponent(username)}`)
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.error)))
      .then(setData)
      .catch(e => setError(typeof e === "string" ? e : "Failed to fetch npm user"))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading, error };
}
