import { useState, useCallback, useEffect } from "react";

const LS_ACCOUNTS  = "npm-hawk:accounts";   // [{ username, addedAt }]
const LS_WATCHLIST = "npm-hawk:watchlist";   // [{ name, pinnedAt, source }]  source = "account"|"manual"

function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function writeLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function useWatchlist() {
  const [accounts, setAccounts]   = useState(() => readLS(LS_ACCOUNTS, []));
  const [watchlist, setWatchlist] = useState(() => readLS(LS_WATCHLIST, []));

  useEffect(() => writeLS(LS_ACCOUNTS,  accounts),  [accounts]);
  useEffect(() => writeLS(LS_WATCHLIST, watchlist), [watchlist]);

  /* ── accounts ── */
  const linkAccount = useCallback((username) => {
    setAccounts(prev =>
      prev.find(a => a.username === username)
        ? prev
        : [...prev, { username, addedAt: new Date().toISOString() }]
    );
  }, []);

  const unlinkAccount = useCallback((username) => {
    setAccounts(prev => prev.filter(a => a.username !== username));
    // remove packages that came from that account
    setWatchlist(prev => prev.filter(p => p.source !== username));
  }, []);

  /* ── watchlist ── */
  const addPackages = useCallback((names, source = "manual") => {
    setWatchlist(prev => {
      const existing = new Set(prev.map(p => p.name));
      const fresh = names
        .filter(n => !existing.has(n))
        .map(n => ({ name: n, pinnedAt: new Date().toISOString(), source }));
      return [...prev, ...fresh];
    });
  }, []);

  const removePackage = useCallback((name) => {
    setWatchlist(prev => prev.filter(p => p.name !== name));
  }, []);

  const isWatched  = useCallback((name) => watchlist.some(p => p.name === name), [watchlist]);
  const hasAccount = accounts.length > 0;
  const packageNames = watchlist.map(p => p.name);

  return { accounts, watchlist, packageNames, hasAccount, linkAccount, unlinkAccount, addPackages, removePackage, isWatched };
}
