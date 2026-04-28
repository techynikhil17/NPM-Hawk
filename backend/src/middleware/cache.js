const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) { store.delete(key); return null; }
  return entry.data;
}

export function cacheSet(key, data, ttlSeconds) {
  store.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

export function cacheMiddleware(keyFn, ttl) {
  return (req, res, next) => {
    const key = keyFn(req);
    const cached = cacheGet(key);
    if (cached) return res.json({ ...cached, _cached: true });
    res.sendCached = (data) => { cacheSet(key, data, ttl); res.json(data); };
    next();
  };
}
