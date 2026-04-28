import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function useNpmUser(username) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!username) { setData(null); return; }
    setLoading(true);
    setError(null);
    api.npmUser(username)
      .then(setData)
      .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to fetch npm user"))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading, error };
}
