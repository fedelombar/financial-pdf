/**
 * Core report generation functionality
 */

import { ReportConfig, ReportSection } from '../types/report';
import { generateCharts } from '../charts/chart-factory';
import { processReconciliation } from '../reconciliation/matcher';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';

/**
 * Generate a financial report based on configuration
 * @param config Report configuration
 * @returns Generated report data
 */
export function generateReport(config: ReportConfig) {
  // Validate the report configuration
  validateReportConfig(config);

  // Process each section of the report
  const processedSections = config.sections.map(section => processSection(section));

  // Return the processed report
  return {
    title: config.title,
    subtitle: config.subtitle,
    dateRange: config.dateRange,
    company: config.company,
    sections: processedSections,
    pageConfig: config.pageConfig,
    metadata: {
      generatedAt: new Date(),
      version: '0.1.0',
    }
  };
}

/**
 * Validate the report configuration
 * @param config Report configuration to validate
 */
function validateReportConfig(config: ReportConfig) {
  if (!config) {
    throw new Error('Report configuration is required');
  }

  if (!config.title) {
    throw new Error('Report title is required');
  }

  if (!config.sections || !Array.isArray(config.sections) || config.sections.length === 0) {
    throw new Error('Report must have at least one section');
  }

  // Validate each section
  config.sections.forEach((section, index) => {
    if (!section.title) {
      throw new Error(`Section ${index + 1} must have a title`);
    }

    if (!section.type) {
      throw new Error(`Section ${index + 1} must have a type`);
    }

    if (!section.content) {
      throw new Error(`Section ${index + 1} must have content`);
    }
  });
}

/**
 * Process a report section
 * @param section Report section to process
 * @returns Processed section
 */
function processSection(section: ReportSection) {
  // Process section based on type
  switch (section.type) {
    case 'chart':
      return processChartSection(section);
    case 'reconciliation':
      return processReconciliationSection(section);
    case 'table':
      return processTableSection(section);
    case 'summary':
      return processSummarySection(section);
    case 'text':
      return section; // No processing needed for text sections
    default:
      return section;
  }
}

/**
 * Process a chart section
 * @param section Chart section to process
 * @returns Processed chart section
 */
function processChartSection(section: ReportSection) {
  // Generate chart data
  const chartConfig = section.content as any; // Type assertion for now
  const chartData = generateCharts(chartConfig);

  return {
    ...section,
    processedContent: chartData
  };
}

/**
 * Process a reconciliation section
 * @param section Reconciliation section to process
 * @returns Processed reconciliation section
 */
function processReconciliationSection(section: ReportSection) {
  // Process reconciliation data
  const reconciliationData = section.content as any; // Type assertion for now
  const processedData = processReconciliation(reconciliationData);

  return {
    ...section,
    processedContent: processedData
  };
}

/**
 * Process a table section
 * @param section Table section to process
 * @returns Processed table section
 */
function processTableSection(section: ReportSection) {
  // No additional processing needed for now
  return section;
}

/**
 * Process a summary section
 * @param section Summary section to process
 * @returns Processed summary section
 */
function processSummarySection(section: ReportSection) {
  // No additional processing needed for now
  return section;
}

/**
 * Generate a financial report with default configuration
 * @param title Report title
 * @param sections Report sections
 * @returns Generated report
 */
export function createSimpleReport(title: string, sections: ReportSection[]) {
  return generateReport({
    title,
    sections,
    dateRange: {
      startDate: new Date(),
      endDate: new Date()
    },
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  });
} 