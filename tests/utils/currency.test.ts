import { formatCurrency, formatNumber } from '../../src/utils/currency';

describe('Currency utilities', () => {
  test('formatCurrency formats a number as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000, 'EUR', 'de-DE')).toMatch(/1.000,00/);
  });
  
  test('formatNumber formats a number with separators', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
    expect(formatNumber(1234.56, 1, ',', '.')).toBe('1.234,6');
  });
});