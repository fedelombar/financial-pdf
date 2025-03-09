/**
 * CSV export functionality for financial reports
 */

import Papa from 'papaparse';
import { ReportConfig, TableContent, SummaryContent } from '../types/report';
import { ReconciliationData, Transaction } from '../types/reconciliation';
import { formatDate } from '../utils/date';

/**
 * Export table data to CSV
 * @param table Table content to export
 * @param options CSV export options
 * @returns CSV content as string
 */
export function exportTableToCsv(
  table: TableContent,
  options: CsvExportOptions = {}
): string {
  // Create data array
  const data = [
    table.headers,
    ...table.rows,
  ];
  
  // Add summary row if present
  if (table.summary) {
    data.push(table.summary);
  }
  
  // Configure options
  const parseOptions = {
    delimiter: options.delimiter || ',',
    newline: options.newline || '\n',
    quotes: options.quoteChar === "'" ? true : false, // Papa Parse only supports true (double quotes) or false
    quoteChar: options.quoteChar || '"',
  };
  
  // Generate CSV
  return Papa.unparse(data, parseOptions);
}

/**
 * Export summary data to CSV
 * @param summary Summary content to export
 * @param options CSV export options
 * @returns CSV content as string
 */
export function exportSummaryToCsv(
  summary: SummaryContent,
  options: CsvExportOptions = {}
): string {
  // Create headers
  const headers = ['Label', 'Value'];
  
  // Add comparison column if any item has comparison value
  const hasComparison = summary.items.some(item => item.comparison !== undefined);
  if (hasComparison) {
    headers.push('Comparison');
  }
  
  // Add change percentage column if any item has change percentage
  const hasChangePercentage = summary.items.some(item => item.changePercentage !== undefined);
  if (hasChangePercentage) {
    headers.push('Change %');
  }
  
  // Create rows
  const rows = summary.items.map(item => {
    const row: (string | number)[] = [item.label, item.value];
    
    if (hasComparison) {
      row.push(item.comparison !== undefined ? item.comparison : '');
    }
    
    if (hasChangePercentage) {
      row.push(item.changePercentage !== undefined ? item.changePercentage : '');
    }
    
    return row;
  });
  
  // Create data array
  const data = [headers, ...rows];
  
  // Configure options
  const parseOptions = {
    delimiter: options.delimiter || ',',
    newline: options.newline || '\n',
    quotes: options.quoteChar === "'" ? true : false,
    quoteChar: options.quoteChar || '"',
  };
  
  // Generate CSV
  return Papa.unparse(data, parseOptions);
}

/**
 * Export reconciliation data to CSV
 * @param reconciliation Reconciliation data to export
 * @param options CSV export options
 * @returns Object containing three CSV strings: matched, unmatchedBank, and unmatchedBook
 */
export function exportReconciliationToCsv(
  reconciliation: ReconciliationData,
  options: CsvExportOptions = {}
): { matched: string; unmatchedBank: string; unmatchedBook: string } {
  // Process only if match results are available
  if (!reconciliation.matchResults) {
    throw new Error('Reconciliation data does not contain match results');
  }
  
  // Configure options
  const parseOptions = {
    delimiter: options.delimiter || ',',
    newline: options.newline || '\n',
    quotes: options.quoteChar === "'" ? true : false,
    quoteChar: options.quoteChar || '"',
  };
  
  // Export matched transactions
  const matchedHeaders = [
    'Bank Transaction ID', 'Bank Date', 'Bank Description', 'Bank Amount', 
    'Book Transaction ID', 'Book Date', 'Book Description', 'Book Amount',
    'Confidence', 'Match Method'
  ];
  
  const matchedRows = reconciliation.matchResults.matched.map(match => [
    match.bankTransaction.id,
    formatDate(match.bankTransaction.date),
    match.bankTransaction.description,
    match.bankTransaction.amount,
    match.bookTransaction.id,
    formatDate(match.bookTransaction.date),
    match.bookTransaction.description,
    match.bookTransaction.amount,
    match.confidence,
    match.matchMethod
  ]);
  
  const matchedCsv = Papa.unparse([matchedHeaders, ...matchedRows], parseOptions);
  
  // Export unmatched bank transactions
  const unmatchedBankCsv = exportTransactionsToCsv(
    reconciliation.matchResults.unmatchedBank,
    options
  );
  
  // Export unmatched book transactions
  const unmatchedBookCsv = exportTransactionsToCsv(
    reconciliation.matchResults.unmatchedBook,
    options
  );
  
  return {
    matched: matchedCsv,
    unmatchedBank: unmatchedBankCsv,
    unmatchedBook: unmatchedBookCsv
  };
}

/**
 * Export transactions to CSV
 * @param transactions Transactions to export
 * @param options CSV export options
 * @returns CSV content as string
 */
function exportTransactionsToCsv(
  transactions: Transaction[],
  options: CsvExportOptions = {}
): string {
  // Define headers
  const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Reference', 'Category'];
  
  // Create rows
  const rows = transactions.map(tx => [
    tx.id,
    formatDate(tx.date),
    tx.description,
    tx.amount,
    tx.type,
    tx.reference || '',
    tx.category || ''
  ]);
  
  // Configure options
  const parseOptions = {
    delimiter: options.delimiter || ',',
    newline: options.newline || '\n',
    quotes: options.quoteChar === "'" ? true : false,
    quoteChar: options.quoteChar || '"',
  };
  
  // Generate CSV
  return Papa.unparse([headers, ...rows], parseOptions);
}

/**
 * Export entire report to CSV (multiple files)
 * @param report Report configuration
 * @param options CSV export options
 * @returns Object containing CSV content for each section
 */
export function exportReportToCsv(
  report: ReportConfig,
  options: CsvExportOptions = {}
): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Process each section
  report.sections.forEach((section, index) => {
    const sectionName = section.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const sectionKey = `section_${index + 1}_${sectionName}`;
    
    switch (section.type) {
      case 'table':
        result[sectionKey] = exportTableToCsv(section.content as TableContent, options);
        break;
      case 'summary':
        result[sectionKey] = exportSummaryToCsv(section.content as SummaryContent, options);
        break;
      case 'reconciliation':
        const reconciliationResults = exportReconciliationToCsv(
          section.content as ReconciliationData,
          options
        );
        result[`${sectionKey}_matched`] = reconciliationResults.matched;
        result[`${sectionKey}_unmatched_bank`] = reconciliationResults.unmatchedBank;
        result[`${sectionKey}_unmatched_book`] = reconciliationResults.unmatchedBook;
        break;
      // Chart and text content types are not suitable for CSV export
    }
  });
  
  return result;
}

/**
 * CSV export options
 */
export interface CsvExportOptions {
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
} 