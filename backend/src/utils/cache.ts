/**
 * In-memory TTL cache for API response caching.
 * Reduces redundant Gemini API calls and improves response times.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/** Default TTL: 5 minutes */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Retrieve a cached value by key.
 * Returns null if the key doesn't exist or has expired.
 */
export function getCache<T = unknown>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Store a value in the cache with a TTL.
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttlMs - Time-to-live in milliseconds (default: 5 minutes)
 */
export function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

/**
 * Remove all expired entries from the cache.
 * Called periodically to prevent memory leaks.
 */
export function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}

/** Returns the current number of cached entries */
export function getCacheSize(): number {
  return cache.size;
}

// Auto-cleanup every 10 minutes (.unref() so it doesn't block Jest/process exit)
const _cleanupTimer = setInterval(cleanupCache, 10 * 60 * 1000);
if (typeof _cleanupTimer.unref === 'function') _cleanupTimer.unref();
