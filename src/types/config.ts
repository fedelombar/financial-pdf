/**
 * Types related to package configuration
 */

import { ChartOptions } from './chart';

/**
 * Main package configuration
 */
export interface FinancialReportsConfig {
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Default chart options */
  defaultChartOptions?: ChartOptions;
  /** Default export options */
  defaultExportOptions?: ExportOptions;
  /** Locale settings */
  locale?: LocaleConfig;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Primary color */
  primaryColor?: string;
  /** Secondary color */
  secondaryColor?: string;
  /** Accent color */
  accentColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Font size base (in pixels) */
  fontSize?: number;
  /** Header styles */
  headerStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  /** Footer styles */
  footerStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  /** Table styles */
  tableStyles?: {
    headerBackgroundColor?: string;
    headerTextColor?: string;
    rowBackgroundColor?: string;
    rowAltBackgroundColor?: string;
    rowTextColor?: string;
    borderColor?: string;
  };
  /** Chart color palette */
  chartColors?: string[];
}

/**
 * Export options
 */
export interface ExportOptions {
  /** PDF export options */
  pdf?: {
    /** PDF quality */
    quality?: 'low' | 'medium' | 'high';
    /** Enable compression */
    compress?: boolean;
    /** PDF document properties */
    documentProperties?: {
      title?: string;
      author?: string;
      subject?: string;
      keywords?: string;
      creator?: string;
    };
  };
  /** CSV export options */
  csv?: {
    /** Field delimiter */
    delimiter?: ',' | ';' | '\t';
    /** Include headers */
    includeHeaders?: boolean;
    /** Newline character */
    newline?: '\n' | '\r\n';
    /** Quote character */
    quoteChar?: '"' | "'";
    /** Encoding */
    encoding?: 'utf8' | 'ascii' | 'utf16le';
  };
  /** Excel export options */
  excel?: {
    /** Sheet name */
    sheetName?: string;
    /** Include column widths */
    includeColumnWidths?: boolean;
    /** Generate formulas */
    generateFormulas?: boolean;
    /** Format dates */
    formatDates?: boolean;
  };
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** Language code */
  language?: string;
  /** Date format */
  dateFormat?: string;
  /** Time format */
  timeFormat?: string;
  /** Currency format */
  currencyFormat?: {
    /** Currency code */
    code?: string;
    /** Currency symbol */
    symbol?: string;
    /** Symbol position */
    symbolPosition?: 'before' | 'after';
    /** Decimal separator */
    decimalSeparator?: '.' | ',';
    /** Thousands separator */
    thousandsSeparator?: ',' | '.' | ' ' | '';
    /** Decimal places */
    decimalPlaces?: number;
  };
  /** Number format */
  numberFormat?: {
    /** Decimal separator */
    decimalSeparator?: '.' | ',';
    /** Thousands separator */
    thousandsSeparator?: ',' | '.' | ' ' | '';
    /** Decimal places */
    decimalPlaces?: number;
  };
} 