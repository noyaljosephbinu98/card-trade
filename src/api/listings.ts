import type { RawListingsPayload } from '@/features/listings/normalize';

import { fetchJson } from './client';

export const LISTINGS_URL =
  'https://public-mocked-bucket.s3.us-east-2.amazonaws.com/listings.json';

export function fetchListings(): Promise<RawListingsPayload> {
  return fetchJson<RawListingsPayload>(LISTINGS_URL);
}
