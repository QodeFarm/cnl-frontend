import { formatMoney } from '../utility';
import { MoneyPipe } from './money.pipe';

describe('formatMoney', () => {
  it('groups Indian-style with 2 decimals', () => {
    expect(formatMoney(4842000)).toBe('48,42,000.00');
    expect(formatMoney(205788)).toBe('2,05,788.00');
    expect(formatMoney(1234.5)).toBe('1,234.50');
  });

  it('caps at 2 decimals', () => {
    expect(formatMoney(1234.567)).toBe('1,234.57');
  });

  it('accepts numeric strings from the API', () => {
    expect(formatMoney('36060.00')).toBe('36,060.00');
  });

  it('keeps the sign on negatives', () => {
    expect(formatMoney(-500)).toBe('-500.00');
  });

  it('shows an em dash for empty / non-numeric', () => {
    expect(formatMoney(null)).toBe('—');
    expect(formatMoney(undefined)).toBe('—');
    expect(formatMoney('')).toBe('—');
    expect(formatMoney('abc')).toBe('—');
  });

  it('prefixes ₹ only when asked', () => {
    expect(formatMoney(1000, { symbol: true })).toBe('₹1,000.00');
    expect(formatMoney(1000)).toBe('1,000.00');
  });
});

describe('MoneyPipe', () => {
  const pipe = new MoneyPipe();
  it('delegates to formatMoney', () => {
    expect(pipe.transform(4842000)).toBe('48,42,000.00');
    expect(pipe.transform(4842000, true)).toBe('₹48,42,000.00');
  });
});
