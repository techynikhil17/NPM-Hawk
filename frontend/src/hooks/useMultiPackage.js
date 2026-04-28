import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const MAX_PACKAGES = 5;
const LS_KEY = "npm-hawk-packages";

export function useMultiPackage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [packages, setPackages] = useState(() => {
    const fromUrl = searchParams.get("packages");
    if (fromUrl) return fromUrl.split(",").filter(Boolean).slice(0, MAX_PACKAGES);
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (packages.length > 0) {
      setSearchParams({ packages: packages.join(",") }, { replace: true });
      localStorage.setItem(LS_KEY, JSON.stringify(packages));
    } else {
      setSearchParams({}, { replace: true });
      localStorage.removeItem(LS_KEY);
    }
  }, [packages]);

  const addPackage = useCallback((name) => {
    setPackages((prev) => {
      if (prev.includes(name) || prev.length >= MAX_PACKAGES) return prev;
      return [...prev, name];
    });
  }, []);

  const removePackage = useCallback((name) => {
    setPackages((prev) => prev.filter((p) => p !== name));
  }, []);

  const clearPackages = useCallback(() => setPackages([]), []);

  return { packages, addPackage, removePackage, clearPackages, isComparison: packages.length > 1 };
}
