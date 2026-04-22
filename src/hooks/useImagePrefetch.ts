import { useEffect } from 'react';
import { Image } from 'react-native';

/**
 * Global memo of URIs we've already asked the native image layer to warm up.
 * Shared across every caller so different screens don't redundantly schedule
 * the same download. Failures are removed so a retry is possible on next call.
 */
const prefetched = new Set<string>();

function prefetchOne(uri: string): void {
  if (prefetched.has(uri)) return;
  prefetched.add(uri);
  Image.prefetch(uri).catch(() => {
    prefetched.delete(uri);
  });
}

/**
 * Warm the native image cache for up to `limit` URIs. Designed for long
 * lists: at 10k items we never want to fan out 10k simultaneous downloads,
 * so the default limit is intentionally small.
 */
export function useImagePrefetch(
  uris: readonly (string | null | undefined)[] | undefined,
  limit: number = 24,
): void {
  useEffect(() => {
    if (!uris || uris.length === 0 || limit <= 0) return;
    let queued = 0;
    for (const uri of uris) {
      if (queued >= limit) break;
      if (!uri) continue;
      prefetchOne(uri);
      queued += 1;
    }
  }, [uris, limit]);
}
