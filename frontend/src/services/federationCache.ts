import { LRUCache } from 'lru-cache';

/**
 * Universal LRU Cache instance for the Unified API Federation Gateway.
 * 
 * Configured to hold up to 100 API responses in memory, with a Time-To-Live (TTL) 
 * of 15 minutes to prevent rate-limiting against external services like fablabs.io
 * while still pulling semi-live data.
 */
export const federationCache = new LRUCache<string, any>({
    max: 100, // Maximum number of cached items
    ttl: 1000 * 60 * 15, // 15 minutes TTL
});
