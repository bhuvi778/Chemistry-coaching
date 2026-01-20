// In-memory cache with aggressive settings
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour for public data

// Cache middleware - DISABLED for videos to prevent caching issues
const cacheMiddleware = (key, ttl = CACHE_TTL) => {
  return (req, res, next) => {
    // CRITICAL FIX: Only cache GET requests, not POST/PUT/DELETE
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for videos endpoint
    if (key === 'videos') {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return next();
    }

    // Check if client requested no-cache
    const cacheControl = req.headers['cache-control'] || '';
    const pragma = req.headers['pragma'] || '';
    const bypassCache = cacheControl.includes('no-cache') || pragma.includes('no-cache');

    // Strip cache-busting query parameters from URL for cache key
    const url = req.originalUrl || req.url;
    const urlWithoutCacheBuster = url.split('?')[0]; // Remove all query params for cache key
    const cacheKey = `${key}:${urlWithoutCacheBuster}`;

    // Check if URL has cache-busting parameter (_t or t)
    const hasCacheBuster = url.includes('?_t=') || url.includes('&_t=') || url.includes('?t=') || url.includes('&t=');

    // If client requests no-cache or has cache-busting parameter, skip cache lookup
    if (!bypassCache && !hasCacheBuster) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttl) {
        res.set('Cache-Control', 'public, max-age=3600');
        res.set('ETag', `"${cached.timestamp}"`);
        return res.json(cached.data);
      }
    }

    res.sendResponse = res.json;
    res.json = (data) => {
      cache.set(cacheKey, { data, timestamp: Date.now() });
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('ETag', `"${Date.now()}"`);
      res.sendResponse(data);
    };
    next();
  };
};

// Clear cache function
const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
};

module.exports = { cacheMiddleware, clearCache, CACHE_TTL };
