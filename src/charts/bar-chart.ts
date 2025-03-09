/**
 * Bar chart component for financial reports
 */

import { ChartConfig, ChartOptions } from '../types/chart';

/**
 * Generate a bar chart configuration
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Bar chart configuration
 */
export function createBarChart(
  labels: string[],
  data: number[] | number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Handle single dataset
  if (!Array.isArray(data[0])) {
    return createSingleDatasetBarChart(labels, data as number[], options);
  }
  
  // Handle multiple datasets
  return createMultiDatasetBarChart(labels, data as number[][], options);
}

/**
 * Generate a bar chart with a single dataset
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Bar chart configuration
 */
function createSingleDatasetBarChart(
  labels: string[],
  data: number[],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: options.title?.text || 'Data',
          data,
          backgroundColor: getDefaultColors(1)[0],
          borderColor: getDefaultBorderColors(1)[0],
          borderWidth: 1
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
 * Generate a bar chart with multiple datasets
 * @param labels Chart labels
 * @param data Chart data (array of datasets)
 * @param options Chart options
 * @returns Bar chart configuration
 */
function createMultiDatasetBarChart(
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
    borderWidth: 1
  }));
  
  return {
    type: 'bar',
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
 * Create a stacked bar chart
 * @param labels Chart labels
 * @param data Chart data (array of datasets)
 * @param datasetLabels Labels for datasets
 * @param options Chart options
 * @returns Stacked bar chart configuration
 */
export function createStackedBarChart(
  labels: string[],
  data: number[][],
  datasetLabels: string[] = [],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Generate colors for datasets
  const colors = getDefaultColors(data.length);
  const borderColors = getDefaultBorderColors(data.length);
  
  // Create datasets
  const datasets = data.map((dataSet, index) => ({
    label: datasetLabels[index] || `Dataset ${index + 1}`,
    data: dataSet,
    backgroundColor: colors[index],
    borderColor: borderColors[index],
    borderWidth: 1
  }));
  
  // Create custom options with stacking
  const customOptions = {
    ...options,
    scales: {
      ...options.scales,
      x: {
        ...options.scales?.x,
        // Use any to bypass strict typing
        // In Chart.js, stacked is a valid property but not included in our type definitions
        ...(options.scales?.x as any),
        title: {
          display: true,
          text: ''
        }
      },
      y: {
        ...options.scales?.y,
        // Use any to bypass strict typing
        // In Chart.js, stacked is a valid property but not included in our type definitions
        ...(options.scales?.y as any),
        beginAtZero: true,
        title: {
          display: true,
          text: ''
        }
      }
    }
  };
  
  // Add stacked property using custom properties
  const xScale = customOptions.scales?.x as any;
  if (xScale) xScale.stacked = true;
  
  const yScale = customOptions.scales?.y as any;
  if (yScale) yScale.stacked = true;
  
  return {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: customOptions
  };
}

/**
 * Create a horizontal bar chart
 * @param labels Chart labels
 * @param data Chart data
 * @param options Chart options
 * @returns Horizontal bar chart configuration
 */
export function createHorizontalBarChart(
  labels: string[],
  data: number[] | number[][],
  options: Partial<ChartOptions> = {}
): ChartConfig {
  // Create regular bar chart first
  const config = createBarChart(labels, data, options);
  
  // Modify for horizontal orientation
  if (config.options && config.options.scales) {
    // Swap x and y axis settings
    const temp = config.options.scales.x;
    config.options.scales.x = config.options.scales.y;
    config.options.scales.y = temp;
    
    // Set horizontal indexAxis using type assertion
    (config.options as any).indexAxis = 'y';
  }
  
  return config;
}

/**
 * Get default colors for chart datasets
 * @param count Number of colors needed
 * @returns Array of colors
 */
function getDefaultColors(count: number): string[] {
  const baseColors = [
    'rgba(75, 192, 192, 0.6)',   // Teal
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(153, 102, 255, 0.6)',  // Purple
    'rgba(255, 159, 64, 0.6)',   // Orange
    'rgba(255, 99, 132, 0.6)',   // Red
    'rgba(255, 205, 86, 0.6)',   // Yellow
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