/**
 * Types related to financial reports
 */

import { ChartConfig } from './chart';
import { ReconciliationData } from './reconciliation';

/**
 * Financial report configuration
 */
export interface ReportConfig {
  /** Title of the report */
  title: string;
  /** Subtitle of the report */
  subtitle?: string;
  /** Report date range */
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  /** Company information */
  company?: {
    name: string;
    logo?: string;
    address?: string;
  };
  /** Report sections */
  sections: ReportSection[];
  /** Page configuration */
  pageConfig?: PageConfig;
}

/**
 * Financial report section
 */
export interface ReportSection {
  /** Section title */
  title: string;
  /** Section content type */
  type: 'summary' | 'chart' | 'table' | 'reconciliation' | 'text';
  /** Section content */
  content: SummaryContent | ChartConfig | TableContent | ReconciliationData | TextContent;
}

/**
 * Summary content configuration
 */
export interface SummaryContent {
  /** Summary items to display */
  items: {
    label: string;
    value: number | string;
    comparison?: number | string;
    changePercentage?: number;
  }[];
}

/**
 * Table content configuration
 */
export interface TableContent {
  /** Table headers */
  headers: string[];
  /** Table rows */
  rows: (string | number)[][];
  /** Table summary row */
  summary?: (string | number)[];
}

/**
 * Text content configuration
 */
export interface TextContent {
  /** Text content */
  text: string;
  /** Text format (markdown, html, plain) */
  format?: 'markdown' | 'html' | 'plain';
}

/**
 * Page configuration
 */
export interface PageConfig {
  /** Page size */
  size?: 'A4' | 'Letter' | 'Legal';
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Page margins */
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /** Page header */
  header?: {
    enabled: boolean;
    height?: number;
    content?: TextContent;
  };
  /** Page footer */
  footer?: {
    enabled: boolean;
    height?: number;
    content?: TextContent;
    showPageNumber?: boolean;
  };
} 