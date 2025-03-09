/**
 * Line chart component for financial reports
 */

import { ChartConfig, ChartOptions } from '../types/chart';

/**
 * Generate a line chart configuration
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Line chart configuration
 */
export function createLineChart(
  labels: string[],
  data: number[] | number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Handle single dataset
  if (!Array.isArray(data[0])) {
    return createSingleDatasetLineChart(labels, data as number[], options);
  }
  
  // Handle multiple datasets
  return createMultiDatasetLineChart(labels, data as number[][], options);
}

/**
 * Generate a line chart with a single dataset
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Line chart configuration
 */
function createSingleDatasetLineChart(
  labels: string[],
  data: number[],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: options.title?.text || 'Data',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: ''
          }
        },
        x: {
          title: {
            display: true,
            text: ''
          }
        }
      },
      ...options
    }
  };
}

/**
 * Generate a line chart with multiple datasets
 * @param labels Chart labels
 * @param data Chart data (array of datasets)
 * @param options Chart options
 * @returns Line chart configuration
 */
function createMultiDatasetLineChart(
  labels: string[],
  data: number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Generate colors for datasets
  const colors = getDefaultColors(data.length);
  const borderColors = getDefaultBorderColors(data.length);
  
  // Create datasets
  const datasets = data.map((dataSet, index) => ({
    label: `Dataset ${index + 1}`,
    data: dataSet,
    backgroundColor: colors[index],
    borderColor: borderColors[index],
    borderWidth: 2,
    fill: false,
    tension: 0.4
  }));
  
  return {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: ''
          }
        },
        x: {
          title: {
            display: true,
            text: ''
          }
        }
      },
      ...options
    }
  };
}

/**
 * Create an area chart (filled line chart)
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Area chart configuration
 */
export function createAreaChart(
  labels: string[],
  data: number[] | number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Create regular line chart first
  const config = createLineChart(labels, data, options);
  
  // Modify datasets to fill area
  config.data.datasets = config.data.datasets.map(dataset => ({
    ...dataset,
    fill: true
  }));
  
  return config;
}

/**
 * Create a stepped line chart
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Stepped line chart configuration
 */
export function createSteppedLineChart(
  labels: string[],
  data: number[] | number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Create regular line chart first
  const config = createLineChart(labels, data, options);
  
  // Modify datasets to use stepped lines
  config.data.datasets = config.data.datasets.map(dataset => ({
    ...dataset,
    stepped: true
  }));
  
  return config;
}

/**
 * Get default colors for chart datasets (transparent for area charts)
 * @param count Number of colors needed
 * @returns Array of colors
 */
function getDefaultColors(count: number): string[] {
  const baseColors = [
    'rgba(75, 192, 192, 0.2)',   // Teal
    'rgba(54, 162, 235, 0.2)',   // Blue
    'rgba(153, 102, 255, 0.2)',  // Purple
    'rgba(255, 159, 64, 0.2)',   // Orange
    'rgba(255, 99, 132, 0.2)',   // Red
    'rgba(255, 205, 86, 0.2)',   // Yellow
    'rgba(201, 203, 207, 0.2)',  // Grey
    'rgba(94, 232, 129, 0.2)',   // Green
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
    'rgb(75, 192, 192)',   // Teal
    'rgb(54, 162, 235)',   // Blue
    'rgb(153, 102, 255)',  // Purple
    'rgb(255, 159, 64)',   // Orange
    'rgb(255, 99, 132)',   // Red
    'rgb(255, 205, 86)',   // Yellow
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