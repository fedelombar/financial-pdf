/**
 * Currency utilities for financial reports
 */

import { Decimal } from 'decimal.js';

/**
 * Format a number as currency
 * @param amount Amount to format
 * @param currency Currency code (ISO 4217) or symbol
 * @param locale Locale for formatting
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  // Use Intl.NumberFormat for localized currency formatting
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.length === 3 ? currency : 'USD',
    currencyDisplay: currency.length === 3 ? 'symbol' : 'code',
  }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
}

/**
 * Format a number with decimal places and thousands separators
 * @param number Number to format
 * @param decimalPlaces Number of decimal places
 * @param decimalSeparator Decimal separator
 * @param thousandsSeparator Thousands separator
 * @returns Formatted number string
 */
export function formatNumber(
  number: number | string,
  decimalPlaces: number = 2,
  decimalSeparator: string = '.',
  thousandsSeparator: string = ','
): string {
  // Convert to number if string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Use Decimal.js for precise decimal arithmetic
  const decimal = new Decimal(num);
  
  // Format with specified decimal places
  const parts = decimal.toFixed(decimalPlaces).split('.');
  
  // Format integer part with thousands separator
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  // Combine with decimal part
  return parts.length > 1 
    ? `${integerPart}${decimalSeparator}${parts[1]}` 
    : integerPart;
}

/**
 * Calculate percentage change between two values
 * @param oldValue Old value
 * @param newValue New value
 * @returns Percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Format a percentage value
 * @param percentage Percentage value
 * @param decimalPlaces Number of decimal places
 * @param includeSymbol Whether to include the % symbol
 * @returns Formatted percentage string
 */
export function formatPercentage(
  percentage: number,
  decimalPlaces: number = 2,
  includeSymbol: boolean = true
): string {
  const formatted = percentage.toFixed(decimalPlaces);
  return includeSymbol ? `${formatted}%` : formatted;
}

/**
 * Sum an array of numbers
 * @param values Array of numbers to sum
 * @returns Sum of values
 */
export function sum(values: number[]): number {
  return values.reduce((total, value) => {
    // Use Decimal.js for precise arithmetic
    return new Decimal(total).plus(new Decimal(value)).toNumber();
  }, 0);
}

/**
 * Calculate average of an array of numbers
 * @param values Array of numbers
 * @returns Average value
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

/**
 * Round a number to a specified precision
 * @param value Value to round
 * @param precision Decimal precision
 * @returns Rounded value
 */
export function round(value: number, precision: number = 2): number {
  return new Decimal(value).toDecimalPlaces(precision).toNumber();
}

/**
 * Convert currency value from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @param exchangeRate Exchange rate (from currency to target currency)
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): number {
  if (fromCurrency === toCurrency) return amount;
  
  return new Decimal(amount).times(new Decimal(exchangeRate)).toNumber();
} 