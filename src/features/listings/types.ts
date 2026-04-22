export type ListingKind = 'FIXED_PRICE' | 'AUCTION';

export type BaseListing = {
  id: string;
  itemName: string;
  subject: string | null;
  brand: string | null;
  year: number | null;
  category: string;
  grade: string | null;
  gradingCompany: string | null;
  imageUrl: string | null;
  altValue: number | null;
  badges: string[];
  createdAt: number;
};

export type FixedPriceListing = BaseListing & {
  kind: 'FIXED_PRICE';
  price: number;
};

export type AuctionListing = BaseListing & {
  kind: 'AUCTION';
  currentBid: number;
  expiresAtEpoch: number;
  bidCount: number | null;
};

export type Listing = FixedPriceListing | AuctionListing;

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'altValue-desc';

export type FilterKind = 'any' | ListingKind;

export type Filters = {
  q: string;
  category: string | null;
  kind: FilterKind;
  minPrice: number | null;
  maxPrice: number | null;
  gradingCompany: string | null;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  q: '',
  category: null,
  kind: 'any',
  minPrice: null,
  maxPrice: null,
  gradingCompany: null,
  sort: 'newest',
};

export function listingPrice(l: Listing): number {
  return l.kind === 'FIXED_PRICE' ? l.price : l.currentBid;
}
