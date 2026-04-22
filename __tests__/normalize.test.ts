import { normalizeListings } from '@/features/listings/normalize';

describe('normalizeListings', () => {
  it('returns an empty array for undefined payloads', () => {
    expect(normalizeListings(undefined)).toEqual([]);
    expect(normalizeListings(null)).toEqual([]);
    expect(normalizeListings({})).toEqual([]);
  });

  it('discriminates FIXED_PRICE and AUCTION', () => {
    const out = normalizeListings({
      fixedPriceListings: [
        {
          id: 'f1',
          itemName: 'Fixed',
          category: 'FOOTBALL_CARDS',
          price: 50,
          images: [{ position: 'FRONT', url: 'https://img/f.jpg' }],
        },
      ],
      auctionListings: [
        {
          id: 'a1',
          itemName: 'Auction',
          category: 'BASKETBALL_CARDS',
          price: 100,
          expiresAtEpoch: 1700000000,
          bidCount: 3,
          images: [{ position: 'BACK', url: 'https://img/a.jpg' }],
        },
      ],
    });
    expect(out).toHaveLength(2);
    const fixed = out.find(l => l.id === 'f1');
    const auction = out.find(l => l.id === 'a1');
    expect(fixed?.kind).toBe('FIXED_PRICE');
    if (fixed?.kind === 'FIXED_PRICE') expect(fixed.price).toBe(50);
    expect(auction?.kind).toBe('AUCTION');
    if (auction?.kind === 'AUCTION') {
      expect(auction.currentBid).toBe(100);
      expect(auction.expiresAtEpoch).toBe(1700000000);
      expect(auction.bidCount).toBe(3);
    }
  });

  it('prefers FRONT image, falls back to first', () => {
    const [l] = normalizeListings({
      fixedPriceListings: [
        {
          id: 'x',
          itemName: 'x',
          category: 'C',
          price: 1,
          images: [
            { position: 'BACK', url: 'https://b' },
            { position: 'FRONT', url: 'https://f' },
          ],
        },
      ],
    });
    expect(l?.imageUrl).toBe('https://f');
  });

  it('drops entries without an id', () => {
    const out = normalizeListings({
      fixedPriceListings: [{ itemName: 'no id', category: 'C', price: 1 } as never],
    });
    expect(out).toEqual([]);
  });
});
