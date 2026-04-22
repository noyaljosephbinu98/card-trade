import { z } from 'zod';

import { DEFAULT_FILTERS, type Filters, type FilterKind, type SortKey } from './types';

const kindSchema = z.enum(['any', 'FIXED_PRICE', 'AUCTION']);
const sortSchema = z.enum(['newest', 'price-asc', 'price-desc', 'altValue-desc']);

export type HomeRouteParams = {
  q?: string;
  category?: string;
  kind?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  gradingCompany?: string;
};

function parseNumber(v: string | undefined): number | null {
  if (v == null || v === '') return null;
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function routeParamsToFilters(params: HomeRouteParams | undefined): Filters {
  if (!params) return DEFAULT_FILTERS;
  const parsedKind = kindSchema.safeParse(params.kind);
  const parsedSort = sortSchema.safeParse(params.sort);
  const kind: FilterKind = parsedKind.success ? parsedKind.data : 'any';
  const sort: SortKey = parsedSort.success ? parsedSort.data : 'newest';
  return {
    q: params.q ?? '',
    category: params.category ?? null,
    kind,
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    gradingCompany: params.gradingCompany ?? null,
    sort,
  };
}

export function countActiveFilters(filters: Filters): number {
  let n = 0;
  if (filters.category) n++;
  if (filters.kind !== 'any') n++;
  if (filters.minPrice != null) n++;
  if (filters.maxPrice != null) n++;
  if (filters.gradingCompany) n++;
  if (filters.sort !== 'newest') n++;
  return n;
}
