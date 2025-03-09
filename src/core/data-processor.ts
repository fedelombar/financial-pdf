/**
 * Data processing utilities for financial reports
 */

import { Decimal } from 'decimal.js';

/**
 * Calculate totals for a dataset
 * @param data Array of numeric data
 * @returns Sum of values
 */
export function calculateTotal(data: number[]): number {
  return data.reduce((sum, value) => sum + value, 0);
}

/**
 * Calculate growth rates between consecutive values
 * @param data Array of numeric data
 * @returns Array of growth rates (percentages)
 */
export function calculateGrowthRates(data: number[]): number[] {
  const growthRates: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const previousValue = data[i - 1];
    const currentValue = data[i];
    
    if (previousValue === 0) {
      growthRates.push(currentValue === 0 ? 0 : 100);
    } else {
      const growthRate = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
      growthRates.push(growthRate);
    }
  }
  
  return growthRates;
}

/**
 * Calculate moving average
 * @param data Array of numeric data
 * @param window Moving average window size
 * @returns Array of moving averages
 */
export function calculateMovingAverage(data: number[], window: number = 3): number[] {
  if (window <= 0 || window > data.length) {
    throw new Error(`Invalid window size: ${window}`);
  }
  
  const movingAverages: number[] = [];
  
  for (let i = 0; i <= data.length - window; i++) {
    const subset = data.slice(i, i + window);
    const average = subset.reduce((sum, value) => sum + value, 0) / window;
    movingAverages.push(average);
  }
  
  return movingAverages;
}

/**
 * Find minimum and maximum values in a dataset
 * @param data Array of numeric data
 * @returns Object with min and max values
 */
export function findMinMax(data: number[]): { min: number; max: number } {
  if (data.length === 0) {
    throw new Error('Cannot find min/max of empty array');
  }
  
  return {
    min: Math.min(...data),
    max: Math.max(...data)
  };
}

/**
 * Calculate financial metrics
 * @param revenue Revenue data
 * @param expenses Expense data
 * @returns Financial metrics
 */
export function calculateFinancialMetrics(
  revenue: number[],
  expenses: number[]
): {
  grossProfit: number[];
  profitMargin: number[];
  revenueGrowth: number[];
  expenseGrowth: number[];
} {
  if (revenue.length !== expenses.length) {
    throw new Error('Revenue and expense arrays must have the same length');
  }
  
  // Calculate gross profit
  const grossProfit = revenue.map((rev, index) => new Decimal(rev).minus(expenses[index]).toNumber());
  
  // Calculate profit margin percentages
  const profitMargin = revenue.map((rev, index) => {
    if (rev === 0) return 0;
    return new Decimal(grossProfit[index]).dividedBy(rev).times(100).toNumber();
  });
  
  // Calculate growth rates
  const revenueGrowth = calculateGrowthRates(revenue);
  const expenseGrowth = calculateGrowthRates(expenses);
  
  return {
    grossProfit,
    profitMargin,
    revenueGrowth,
    expenseGrowth
  };
}

/**
 * Transform data for visualization
 * @param labels Data labels
 * @param datasets Data series to transform
 * @returns Transformed data for charts
 */
export function transformDataForVisualization(
  labels: string[],
  datasets: { label: string; data: number[] }[]
): {
  labels: string[];
  datasets: { label: string; data: number[] }[];
} {
  // Ensure all datasets have the same length
  const datasetLengths = datasets.map(dataset => dataset.data.length);
  const minLength = Math.min(...datasetLengths);
  
  // Truncate datasets and labels to the minimum length
  const truncatedLabels = labels.slice(0, minLength);
  const truncatedDatasets = datasets.map(dataset => ({
    label: dataset.label,
    data: dataset.data.slice(0, minLength)
  }));
  
  return {
    labels: truncatedLabels,
    datasets: truncatedDatasets
  };
}
