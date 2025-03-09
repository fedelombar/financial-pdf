/**
 * Types related to chart visualizations
 */

/**
 * Chart configuration
 */
export interface ChartConfig {
  /** Chart type */
  type: ChartType;
  /** Chart data */
  data: ChartData;
  /** Chart options */
  options?: ChartOptions;
  /** Chart dimensions */
  dimensions?: {
    width: number | string;
    height: number | string;
  };
}

/**
 * Chart types
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble';

/**
 * Chart data
 */
export interface ChartData {
  /** Labels for the chart */
  labels: string[];
  /** Datasets for the chart */
  datasets: ChartDataset[];
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  /** Dataset label */
  label: string;
  /** Dataset data */
  data: number[];
  /** Background color */
  backgroundColor?: string | string[];
  /** Border color */
  borderColor?: string | string[];
  /** Border width */
  borderWidth?: number;
  /** Fill option */
  fill?: boolean;
  /** Tension for line charts */
  tension?: number;
  /** Point styles */
  pointStyle?: string | string[];
  /** Dataset type (for mixed charts) */
  type?: ChartType;
}

/**
 * Chart options
 */
export interface ChartOptions {
  /** Chart title */
  title?: {
    display: boolean;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  /** Chart legend */
  legend?: {
    display: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  /** Chart tooltips */
  tooltips?: {
    enabled: boolean;
    mode?: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';
  };
  /** Chart scales */
  scales?: {
    x?: {
      title?: {
        display: boolean;
        text: string;
      };
      grid?: {
        display: boolean;
      };
    };
    y?: {
      title?: {
        display: boolean;
        text: string;
      };
      grid?: {
        display: boolean;
      };
      beginAtZero?: boolean;
    };
  };
  /** Animation configuration */
  animation?: {
    duration?: number;
    easing?: string;
  };
  /** Responsive behavior */
  responsive?: boolean;
  /** Maintain aspect ratio */
  maintainAspectRatio?: boolean;
} 