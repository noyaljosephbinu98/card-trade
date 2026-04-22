import { countActiveFilters, routeParamsToFilters } from '@/features/listings/deepLinkFilters';
import { DEFAULT_FILTERS } from '@/features/listings/types';

describe('routeParamsToFilters', () => {
  it('returns defaults when no params', () => {
    expect(routeParamsToFilters(undefined)).toEqual(DEFAULT_FILTERS);
  });

  it('parses a search URL with category and price range', () => {
    const filters = routeParamsToFilters({
      q: 'mahomes',
      category: 'FOOTBALL_CARDS',
      minPrice: '100',
      maxPrice: '500',
      sort: 'price-asc',
    });
    expect(filters).toEqual({
      ...DEFAULT_FILTERS,
      q: 'mahomes',
      category: 'FOOTBALL_CARDS',
      minPrice: 100,
      maxPrice: 500,
      sort: 'price-asc',
    });
  });

  it('ignores unknown kind / sort values gracefully', () => {
    const filters = routeParamsToFilters({ kind: 'nope', sort: 'bogus' });
    expect(filters.kind).toBe('any');
    expect(filters.sort).toBe('newest');
  });
});

describe('countActiveFilters', () => {
  it('is zero for defaults', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
  });

  it('counts each non-default filter exactly once', () => {
    expect(
      countActiveFilters({
        ...DEFAULT_FILTERS,
        category: 'FOOTBALL_CARDS',
        kind: 'AUCTION',
        minPrice: 10,
        maxPrice: 500,
        gradingCompany: 'PSA',
        sort: 'price-desc',
      }),
    ).toBe(6);
  });
});
