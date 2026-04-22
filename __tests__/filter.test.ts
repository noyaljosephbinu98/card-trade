import { applyFilters, uniqueCategories } from '@/features/listings/filter';
import { DEFAULT_FILTERS, type Listing } from '@/features/listings/types';

function makeFixed(over: Partial<Listing> & { id: string; price: number }): Listing {
  return {
    id: over.id,
    itemName: (over as Listing).itemName ?? 'Card',
    subject: null,
    brand: null,
    year: null,
    category: over.category ?? 'FOOTBALL_CARDS',
    grade: null,
    gradingCompany: null,
    imageUrl: null,
    altValue: over.altValue ?? null,
    badges: [],
    createdAt: over.createdAt ?? 0,
    kind: 'FIXED_PRICE',
    price: over.price,
  };
}

const sample: Listing[] = [
  makeFixed({ id: 'a', price: 10, category: 'FOOTBALL_CARDS', altValue: 20, createdAt: 3 }),
  makeFixed({ id: 'b', price: 50, category: 'BASKETBALL_CARDS', altValue: 200, createdAt: 2 }),
  makeFixed({ id: 'c', price: 500, category: 'FOOTBALL_CARDS', altValue: 100, createdAt: 1 }),
  {
    ...makeFixed({ id: 'd', price: 0, category: 'BASEBALL_CARDS' }),
    kind: 'AUCTION',
    currentBid: 75,
    expiresAtEpoch: 1700000000,
    bidCount: null,
  } as Listing,
];

sample[0]!.itemName = 'Mahomes rookie';
sample[1]!.itemName = 'LeBron';
sample[2]!.itemName = 'Mahomes auto';
sample[3]!.itemName = 'Trout';

describe('applyFilters', () => {
  it('returns all with defaults sorted by newest', () => {
    const out = applyFilters(sample, DEFAULT_FILTERS);
    expect(out.map((l) => l.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('filters by free-text query across itemName', () => {
    const out = applyFilters(sample, { ...DEFAULT_FILTERS, q: 'mahomes' });
    expect(out.map((l) => l.id).sort()).toEqual(['a', 'c']);
  });

  it('filters by category', () => {
    const out = applyFilters(sample, { ...DEFAULT_FILTERS, category: 'FOOTBALL_CARDS' });
    expect(out.every((l) => l.category === 'FOOTBALL_CARDS')).toBe(true);
  });

  it('filters by price range using listingPrice', () => {
    const out = applyFilters(sample, { ...DEFAULT_FILTERS, minPrice: 40, maxPrice: 100 });
    expect(out.map((l) => l.id).sort()).toEqual(['b', 'd']);
  });

  it('filters by kind AUCTION', () => {
    const out = applyFilters(sample, { ...DEFAULT_FILTERS, kind: 'AUCTION' });
    expect(out.map((l) => l.id)).toEqual(['d']);
  });

  it('sorts price-asc / price-desc / altValue-desc', () => {
    const asc = applyFilters(sample, { ...DEFAULT_FILTERS, sort: 'price-asc' });
    expect(asc.map((l) => l.id)).toEqual(['a', 'b', 'd', 'c']);

    const desc = applyFilters(sample, { ...DEFAULT_FILTERS, sort: 'price-desc' });
    expect(desc.map((l) => l.id)).toEqual(['c', 'd', 'b', 'a']);

    const alt = applyFilters(sample, { ...DEFAULT_FILTERS, sort: 'altValue-desc' });
    expect(alt.slice(0, 2).map((l) => l.id)).toEqual(['b', 'c']);
  });

  it('uniqueCategories returns sorted distinct values', () => {
    expect(uniqueCategories(sample)).toEqual([
      'BASEBALL_CARDS',
      'BASKETBALL_CARDS',
      'FOOTBALL_CARDS',
    ]);
  });
});
