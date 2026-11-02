import type {Money} from '../../src/types';

interface CompareQuote {
  id: string;
  total: Money;
}

function lowestLandedTotal(quotes: CompareQuote[]): Money | null {
  if (quotes.length === 0) {
    return null;
  }
  return quotes.reduce((best, quote) =>
    quote.total.amount < best.total.amount ? quote : best,
  ).total;
}

describe('quotation comparison helpers', () => {
  it('selects the lowest landed total', () => {
    const lowest = lowestLandedTotal([
      {id: 'a', total: {amount: 86460, currency: 'INR'}},
      {id: 'b', total: {amount: 85400, currency: 'INR'}},
    ]);
    expect(lowest?.amount).toBe(85400);
  });

  it('returns null for empty lists', () => {
    expect(lowestLandedTotal([])).toBeNull();
  });
});
