import type { Listing } from './types';

type RawImage = { position?: string; url?: string };

type RawListing = {
  id: string;
  listingId?: string;
  itemName?: string;
  name?: string;
  subject?: string | null;
  brand?: string | null;
  year?: number | null;
  category?: string;
  grade?: string | null;
  gradingCompany?: string | null;
  altValue?: number | null;
  price?: number | null;
  expiresAtEpoch?: number | null;
  bidCount?: number | null;
  createdAt?: number | null;
  badges?: string[] | null;
  images?: RawImage[] | null;
  listingType?: string;
};

export type RawListingsPayload = {
  fixedPriceListings?: RawListing[];
  auctionListings?: RawListing[];
};

function pickFrontImage(images: RawImage[] | null | undefined): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const front = images.find(i => i?.position === 'FRONT');
  return front?.url ?? images[0]?.url ?? null;
}

function normalizeOne(raw: RawListing, kind: 'FIXED_PRICE' | 'AUCTION'): Listing | null {
  const id = raw.id ?? raw.listingId;
  if (!id) return null;

  const base = {
    id,
    itemName: raw.itemName ?? raw.name ?? 'Untitled listing',
    subject: raw.subject ?? null,
    brand: raw.brand ?? null,
    year: raw.year ?? null,
    category: raw.category ?? 'UNKNOWN',
    grade: raw.grade ?? null,
    gradingCompany: raw.gradingCompany ?? null,
    imageUrl: pickFrontImage(raw.images),
    altValue: raw.altValue ?? null,
    badges: Array.isArray(raw.badges) ? raw.badges : [],
    createdAt: raw.createdAt ?? 0,
  };

  if (kind === 'AUCTION') {
    return {
      ...base,
      kind: 'AUCTION',
      currentBid: Number(raw.price ?? 0),
      expiresAtEpoch: Number(raw.expiresAtEpoch ?? 0),
      bidCount: raw.bidCount ?? null,
    };
  }
  return {
    ...base,
    kind: 'FIXED_PRICE',
    price: Number(raw.price ?? 0),
  };
}

export function normalizeListings(payload: RawListingsPayload | undefined | null): Listing[] {
  if (!payload) return [];
  const fixed = (payload.fixedPriceListings ?? [])
    .map(r => normalizeOne(r, 'FIXED_PRICE'))
    .filter((x): x is Listing => x != null);
  const auctions = (payload.auctionListings ?? [])
    .map(r => normalizeOne(r, 'AUCTION'))
    .filter((x): x is Listing => x != null);
  return [...fixed, ...auctions];
}
