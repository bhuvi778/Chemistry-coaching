// In-memory cache with aggressive settings
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour for public data

// Cache middleware - DISABLED for videos to prevent caching issues
const cacheMiddleware = (key, ttl = CACHE_TTL) => {
  return (req, res, next) => {
    // Skip caching for videos endpoint
    if (key === 'videos') {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return next();
    }
    
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('ETag', `"${cached.timestamp}"`);
      return res.json(cached.data);
    }
    res.sendResponse = res.json;
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
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
