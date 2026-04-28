import { getCache, setCache, cleanupCache, getCacheSize } from '../utils/cache';

describe('Cache Utility', () => {
  beforeEach(() => {
    // Clear cache state between tests
    cleanupCache();
  });

  it('should store and retrieve a value', () => {
    setCache('test-key', 'test-value');
    expect(getCache('test-key')).toBe('test-value');
  });

  it('should return null for a non-existent key', () => {
    expect(getCache('missing-key')).toBeNull();
  });

  it('should return null for an expired entry', () => {
    setCache('expiring-key', 'data', 1); // 1ms TTL
    // Wait for expiry
    const start = Date.now();
    while (Date.now() - start < 10) { /* busy wait */ }
    expect(getCache('expiring-key')).toBeNull();
  });

  it('should report cache size correctly', () => {
    setCache('key1', 'value1');
    setCache('key2', 'value2');
    expect(getCacheSize()).toBeGreaterThanOrEqual(2);
  });

  it('should handle complex objects', () => {
    const obj = { name: 'election', phases: [1, 2, 3] };
    setCache('complex', obj);
    expect(getCache('complex')).toEqual(obj);
  });
});
