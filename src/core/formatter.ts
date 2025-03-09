/**
 * Formatting utilities for financial reports
 */

import { formatCurrency, formatNumber, formatPercentage } from '../utils/currency';
import { formatDate } from '../utils/date';

/**
 * Format a data row for display
 * @param row Data row
 * @param formatters Formatters for each column
 * @returns Formatted row
 */
export function formatDataRow(
  row: (number | string | Date)[],
  formatters: Array<(value: any) => string | number>
): (string | number)[] {
  // Convert all Date objects to formatted strings first
  const processedRow = row.map(value => {
    if (value instanceof Date) {
      return formatDate(value);
    }
    return value;
  });
  
  // Then apply the formatters
  return processedRow.map((value, index) => {
    const formatter = formatters[index];
    return formatter ? formatter(value) : value;
  });
}

/**
 * Create currency formatter
 * @param currency Currency code
 * @param locale Locale
 * @returns Currency formatter function
 */
export function createCurrencyFormatter(
  currency: string = 'USD',
  locale: string = 'en-US'
): (value: number | string) => string {
  return (value: number | string) => formatCurrency(value, currency, locale);
}

/**
 * Create number formatter
 * @param decimalPlaces Decimal places
 * @param decimalSeparator Decimal separator
 * @param thousandsSeparator Thousands separator
 * @returns Number formatter function
 */
export function createNumberFormatter(
  decimalPlaces: number = 2,
  decimalSeparator: string = '.',
  thousandsSeparator: string = ','
): (value: number | string) => string {
  return (value: number | string) => formatNumber(value, decimalPlaces, decimalSeparator, thousandsSeparator);
}

/**
 * Create percentage formatter
 * @param decimalPlaces Decimal places
 * @param includeSymbol Whether to include the % symbol
 * @returns Percentage formatter function
 */
export function createPercentageFormatter(
  decimalPlaces: number = 2,
  includeSymbol: boolean = true
): (value: number) => string {
  return (value: number) => formatPercentage(value, decimalPlaces, includeSymbol);
}

/**
 * Create date formatter
 * @param format Date format
 * @returns Date formatter function
 */
export function createDateFormatter(
  format: string = 'YYYY-MM-DD'
): (value: Date | string | number) => string {
  return (value: Date | string | number) => formatDate(value, format);
}

/**
 * Format a financial metrics table
 * @param labels Row labels
 * @param metrics Financial metrics
 * @param includeGrowth Whether to include growth columns
 * @returns Formatted table data
 */
export function formatFinancialMetricsTable(
  labels: string[],
  metrics: {
    revenue: number[];
    expenses: number[];
    grossProfit: number[];
    profitMargin: number[];
    revenueGrowth?: number[];
    expenseGrowth?: number[];
  },
  includeGrowth: boolean = true
): {
  headers: string[];
  rows: (string | number)[][];
} {
  // Create formatters
  const currencyFormatter = createCurrencyFormatter();
  const percentFormatter = createPercentageFormatter();
  
  // Create headers
  const headers = ['Period', 'Revenue', 'Expenses', 'Gross Profit', 'Profit Margin'];
  
  if (includeGrowth && metrics.revenueGrowth && metrics.expenseGrowth) {
    headers.push('Revenue Growth', 'Expense Growth');
  }
  
  // Create rows
  const rows = labels.map((label, index) => {
    const row: (string | number)[] = [
      label,
      currencyFormatter(metrics.revenue[index]),
      currencyFormatter(metrics.expenses[index]),
      currencyFormatter(metrics.grossProfit[index]),
      percentFormatter(metrics.profitMargin[index])
    ];
    
    if (includeGrowth && metrics.revenueGrowth && metrics.expenseGrowth) {
      if (index > 0) {
        row.push(
          percentFormatter(metrics.revenueGrowth[index - 1]),
          percentFormatter(metrics.expenseGrowth[index - 1])
        );
      } else {
        row.push('', ''); // No growth for first period
      }
    }
    
    return row;
  });
  
  return { headers, rows };
}
