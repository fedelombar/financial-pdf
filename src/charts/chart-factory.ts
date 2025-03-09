/**
 * Chart factory for generating different types of charts
 */

import { ChartConfig, ChartType } from '../types/chart';

/**
 * Generate charts based on configuration
 * @param config Chart configuration
 * @returns Generated chart data
 */
export function generateCharts(config: ChartConfig) {
  // Switch based on chart type
  switch (config.type) {
    case 'bar':
      return generateBarChart(config);
    case 'line':
      return generateLineChart(config);
    case 'pie':
      return generatePieChart(config);
    case 'doughnut':
      return generateDoughnutChart(config);
    case 'radar':
      return generateRadarChart(config);
    case 'polarArea':
      return generatePolarAreaChart(config);
    case 'scatter':
      return generateScatterChart(config);
    case 'bubble':
      return generateBubbleChart(config);
    default:
      throw new Error(`Unsupported chart type: ${config.type}`);
  }
}

/**
 * Generate a bar chart
 * @param config Chart configuration
 * @returns Bar chart data
 */
function generateBarChart(config: ChartConfig) {
  return {
    type: 'bar',
    data: config.data,
    options: {
      ...defaultBarChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a line chart
 * @param config Chart configuration
 * @returns Line chart data
 */
function generateLineChart(config: ChartConfig) {
  return {
    type: 'line',
    data: config.data,
    options: {
      ...defaultLineChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a pie chart
 * @param config Chart configuration
 * @returns Pie chart data
 */
function generatePieChart(config: ChartConfig) {
  return {
    type: 'pie',
    data: config.data,
    options: {
      ...defaultPieChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a doughnut chart
 * @param config Chart configuration
 * @returns Doughnut chart data
 */
function generateDoughnutChart(config: ChartConfig) {
  return {
    type: 'doughnut',
    data: config.data,
    options: {
      ...defaultPieChartOptions, // Reuse pie chart options
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a radar chart
 * @param config Chart configuration
 * @returns Radar chart data
 */
function generateRadarChart(config: ChartConfig) {
  return {
    type: 'radar',
    data: config.data,
    options: {
      ...defaultRadarChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a polar area chart
 * @param config Chart configuration
 * @returns Polar area chart data
 */
function generatePolarAreaChart(config: ChartConfig) {
  return {
    type: 'polarArea',
    data: config.data,
    options: {
      ...defaultPolarAreaChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a scatter chart
 * @param config Chart configuration
 * @returns Scatter chart data
 */
function generateScatterChart(config: ChartConfig) {
  return {
    type: 'scatter',
    data: config.data,
    options: {
      ...defaultScatterChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

/**
 * Generate a bubble chart
 * @param config Chart configuration
 * @returns Bubble chart data
 */
function generateBubbleChart(config: ChartConfig) {
  return {
    type: 'bubble',
    data: config.data,
    options: {
      ...defaultBubbleChartOptions,
      ...config.options,
    },
    dimensions: config.dimensions || { width: '100%', height: '400px' },
  };
}

// Default chart options

const defaultBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const defaultLineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const defaultPieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const defaultRadarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const defaultPolarAreaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const defaultScatterChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
    },
  },
};

const defaultBubbleChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
    },
  },
}; 