import {formatDate, formatMoney, greetingForTime, initialsFromName} from '../../src/utils/format';

describe('formatMoney', () => {
  it('formats INR amounts', () => {
    const result = formatMoney({amount: 1850, currency: 'INR'});
    expect(result).toContain('1');
    expect(result.length).toBeGreaterThan(1);
  });

  it('returns em dash for missing money', () => {
    expect(formatMoney(null)).toBe('—');
    expect(formatMoney(undefined)).toBe('—');
  });
});

describe('formatDate', () => {
  it('formats valid ISO dates', () => {
    expect(formatDate('2026-01-15T00:00:00.000Z')).not.toBe('—');
  });

  it('returns em dash for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('—');
    expect(formatDate(null)).toBe('—');
  });
});

describe('initialsFromName', () => {
  it('builds initials from full names', () => {
    expect(initialsFromName('Priya Sharma')).toBe('PS');
  });

  it('handles single names', () => {
    expect(initialsFromName('KDS')).toBe('KD');
  });
});

describe('greetingForTime', () => {
  it('returns morning greeting before noon', () => {
    expect(greetingForTime(new Date('2026-01-01T09:00:00'))).toBe('Good morning');
  });
});
