import { type Filters, type Listing, listingPrice } from './types';

function matchesQueryLowered(l: Listing, needle: string): boolean {
  if (!needle) return true;
  if (l.itemName.toLowerCase().includes(needle)) return true;
  if (l.subject && l.subject.toLowerCase().includes(needle)) return true;
  if (l.brand && l.brand.toLowerCase().includes(needle)) return true;
  return false;
}

export function applyFilters(listings: readonly Listing[], filters: Filters): Listing[] {
  const { q, category, kind, minPrice, maxPrice, gradingCompany, sort } = filters;

  const needle = q ? q.toLowerCase() : '';
  const hasCategory = category != null;
  const hasKind = kind !== 'any';
  const hasMin = minPrice != null;
  const hasMax = maxPrice != null;
  const hasGrading = gradingCompany != null;

  // Single-pass filter; short-circuits cheapest checks first.
  const filtered: Listing[] = [];
  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    if (!l) continue;
    if (hasCategory && l.category !== category) continue;
    if (hasKind && l.kind !== kind) continue;
    if (hasGrading && l.gradingCompany !== gradingCompany) continue;
    if (hasMin || hasMax) {
      const price = listingPrice(l);
      if (hasMin && price < minPrice!) continue;
      if (hasMax && price > maxPrice!) continue;
    }
    if (needle && !matchesQueryLowered(l, needle)) continue;
    filtered.push(l);
  }

  // Sort uses the Schwartzian transform for price-based sorts so listingPrice()
  // is invoked O(n) instead of O(n log n) times.
  switch (sort) {
    case 'newest':
      return filtered.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    case 'altValue-desc':
      return filtered.sort((a, b) => (b.altValue ?? 0) - (a.altValue ?? 0));
    case 'price-asc':
    case 'price-desc': {
      const decorated = filtered.map<[Listing, number]>(l => [l, listingPrice(l)]);
      const dir = sort === 'price-asc' ? 1 : -1;
      decorated.sort((a, b) => (a[1] - b[1]) * dir);
      for (let i = 0; i < decorated.length; i++) {
        const pair = decorated[i];
        if (pair) filtered[i] = pair[0];
      }
      return filtered;
    }
    default:
      return filtered;
  }
}

export function uniqueCategories(listings: readonly Listing[]): string[] {
  return Array.from(new Set(listings.map(l => l.category))).sort();
}

export function uniqueGradingCompanies(listings: readonly Listing[]): string[] {
  return Array.from(
    new Set(listings.map(l => l.gradingCompany).filter((x): x is string => !!x)),
  ).sort();
}
