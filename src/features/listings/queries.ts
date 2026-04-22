import { useQuery } from '@tanstack/react-query';

import { fetchListings } from '@/api/listings';

import { normalizeListings } from './normalize';
import type { Listing } from './types';

export const listingsQueryKey = ['listings'] as const;

export function useListingsQuery() {
  return useQuery({
    queryKey: listingsQueryKey,
    queryFn: fetchListings,
    // Payload is large (10k scale); don't refetch on every screen focus.
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    // `select` runs per-observer; structuralSharing keeps referential
    // equality across renders so FlatList & memoized rows can bail fast.
    select: normalizeListings,
    structuralSharing: true,
  });
}

export function useListingById(id: string | null | undefined): Listing | undefined {
  const { data } = useListingsQuery();
  if (!id || !data) return undefined;
  return data.find(l => l.id === id);
}
