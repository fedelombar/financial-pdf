/**
 * Pie chart component for financial reports
 */

import { ChartConfig, ChartOptions } from '../types/chart';

/**
 * Generate a pie chart configuration
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Pie chart configuration
 */
export function createPieChart(
  labels: string[],
  data: number[],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Generate colors for the pie slices
  const backgroundColors = getDefaultColors(data.length);
  const borderColors = getDefaultBorderColors(data.length);
  
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: options.title?.text || 'Data',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...options
    }
  };
}

/**
 * Generate a doughnut chart configuration
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Doughnut chart configuration
 */
export function createDoughnutChart(
  labels: string[],
  data: number[],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Create basic pie chart
  const config = createPieChart(labels, data, options);
  
  // Change type to doughnut
  config.type = 'doughnut';
  
  return config;
}

/**
 * Create a polar area chart
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Polar area chart configuration
 */
export function createPolarAreaChart(
  labels: string[],
  data: number[],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Create basic pie chart
  const config = createPieChart(labels, data, options);
  
  // Change type to polarArea
  config.type = 'polarArea';
  
  return config;
}

/**
 * Get default colors for chart datasets
 * @param count Number of colors needed
 * @returns Array of colors
 */
function getDefaultColors(count: number): string[] {
  const baseColors = [
    'rgba(255, 99, 132, 0.6)',   // Red
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(255, 205, 86, 0.6)',   // Yellow
    'rgba(75, 192, 192, 0.6)',   // Teal
    'rgba(153, 102, 255, 0.6)',  // Purple
    'rgba(255, 159, 64, 0.6)',   // Orange
    'rgba(201, 203, 207, 0.6)',  // Grey
    'rgba(94, 232, 129, 0.6)',   // Green
  ];
  
  // If we need more colors than are available, cycle through them
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}

/**
 * Get default border colors for chart datasets
 * @param count Number of colors needed
 * @returns Array of border colors
 */
function getDefaultBorderColors(count: number): string[] {
  const baseBorderColors = [
    'rgb(255, 99, 132)',   // Red
    'rgb(54, 162, 235)',   // Blue
    'rgb(255, 205, 86)',   // Yellow
    'rgb(75, 192, 192)',   // Teal
    'rgb(153, 102, 255)',  // Purple
    'rgb(255, 159, 64)',   // Orange
    'rgb(201, 203, 207)',  // Grey
    'rgb(94, 232, 129)',   // Green
  ];
  
  // If we need more colors than are available, cycle through them
  const borderColors: string[] = [];
  for (let i = 0; i < count; i++) {
    borderColors.push(baseBorderColors[i % baseBorderColors.length]);
  }
  
  return borderColors;
}
