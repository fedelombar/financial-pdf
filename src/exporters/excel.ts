/**
 * Excel export functionality for financial reports
 */

import * as XLSX from 'xlsx';
import { ReportConfig, TableContent, SummaryContent } from '../types/report';
import { ReconciliationData, Transaction } from '../types/reconciliation';
import { formatDate } from '../utils/date';

/**
 * Export a financial report to Excel
 * @param report Report configuration
 * @param options Excel export options
 * @returns Excel workbook
 */
export function exportReportToExcel(
  report: ReportConfig,
  options: ExcelExportOptions = {}
): XLSX.WorkBook {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Set properties
  workbook.Props = {
    Title: report.title,
    Subject: report.subtitle || 'Financial Report',
    Author: options.author || 'Financial Reports Package',
    CreatedDate: new Date()
  };
  
  // Create overview sheet
  addOverviewSheet(workbook, report);
  
  // Process each section
  report.sections.forEach((section, index) => {
    const sheetName = createSheetName(section.title, index + 1);
    
    switch (section.type) {
      case 'table':
        addTableSheet(workbook, section.title, section.content as TableContent, options);
        break;
      case 'summary':
        addSummarySheet(workbook, section.title, section.content as SummaryContent, options);
        break;
      case 'reconciliation':
        addReconciliationSheets(workbook, section.title, section.content as ReconciliationData, options);
        break;
      // Chart and text sections are handled differently
      case 'chart':
        addPlaceholderSheet(workbook, sheetName, 'Chart visualization not available in Excel export');
        break;
      case 'text':
        addPlaceholderSheet(workbook, sheetName, 'Text content not formatted for Excel');
        break;
    }
  });
  
  return workbook;
}

/**
 * Add overview sheet to workbook
 * @param workbook Excel workbook
 * @param report Report configuration
 */
function addOverviewSheet(workbook: XLSX.WorkBook, report: ReportConfig): void {
  // Create header data
  const headerData = [
    ['Report Title', report.title],
    report.subtitle ? ['Subtitle', report.subtitle] : null,
    report.dateRange ? ['Period', `${formatDate(report.dateRange.startDate)} - ${formatDate(report.dateRange.endDate)}`] : null,
    report.company ? ['Company', report.company.name] : null,
    ['Generated', formatDate(new Date(), 'YYYY-MM-DD HH:mm')],
    ['Sections', `${report.sections.length} sections`],
    [],
    ['#', 'Section Title', 'Type']
  ].filter(row => row !== null) as (string | number)[][];
  
  // Add section list
  report.sections.forEach((section, index) => {
    headerData.push([index + 1, section.title, section.type]);
  });
  
  // Create sheet
  const worksheet = XLSX.utils.aoa_to_sheet(headerData);
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Overview');
  
  // Set column widths
  const colWidths = [{ wch: 10 }, { wch: 40 }, { wch: 15 }];
  worksheet['!cols'] = colWidths;
}

/**
 * Add table data to a new sheet
 * @param workbook Excel workbook
 * @param title Sheet title
 * @param tableContent Table content
 * @param options Excel export options
 */
function addTableSheet(
  workbook: XLSX.WorkBook,
  title: string,
  tableContent: TableContent,
  options: ExcelExportOptions
): void {
  // Create sheet name
  const sheetName = createSheetName(title);
  
  // Create data array
  const data = [
    tableContent.headers,
    ...tableContent.rows
  ];
  
  // Add summary row if present
  if (tableContent.summary) {
    // Add empty row before summary
    data.push([]);
    data.push(tableContent.summary);
  }
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Style header row
  if (worksheet['!ref']) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }
  }
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Set column widths based on content
  const colWidths = tableContent.headers.map(header => ({
    wch: Math.max(header.length, 10) + 2
  }));
  worksheet['!cols'] = colWidths;
}

/**
 * Add summary data to a new sheet
 * @param workbook Excel workbook
 * @param title Sheet title
 * @param summaryContent Summary content
 * @param options Excel export options
 */
function addSummarySheet(
  workbook: XLSX.WorkBook,
  title: string,
  summaryContent: SummaryContent,
  options: ExcelExportOptions
): void {
  // Create sheet name
  const sheetName = createSheetName(title);
  
  // Create headers
  const headers = ['Label', 'Value'];
  
  // Add comparison column if any item has comparison value
  const hasComparison = summaryContent.items.some(item => item.comparison !== undefined);
  if (hasComparison) {
    headers.push('Comparison');
  }
  
  // Add change percentage column if any item has change percentage
  const hasChangePercentage = summaryContent.items.some(item => item.changePercentage !== undefined);
  if (hasChangePercentage) {
    headers.push('Change %');
  }
  
  // Create rows
  const rows = summaryContent.items.map(item => {
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
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Style header row
  if (worksheet['!ref']) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }
  }
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Set column widths
  const colWidths = [{ wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }].slice(0, headers.length);
  worksheet['!cols'] = colWidths;
}

/**
 * Add reconciliation data to multiple sheets
 * @param workbook Excel workbook
 * @param title Base sheet title
 * @param reconciliationData Reconciliation data
 * @param options Excel export options
 */
function addReconciliationSheets(
  workbook: XLSX.WorkBook,
  title: string,
  reconciliationData: ReconciliationData,
  options: ExcelExportOptions
): void {
  // Process only if match results are available
  if (!reconciliationData.matchResults) {
    addPlaceholderSheet(workbook, createSheetName(title), 'Reconciliation data not processed');
    return;
  }
  
  // Add summary sheet
  addReconciliationSummarySheet(workbook, title, reconciliationData);
  
  // Add matched transactions sheet
  addMatchedTransactionsSheet(workbook, title, reconciliationData.matchResults.matched);
  
  // Add unmatched bank transactions sheet
  addTransactionsSheet(
    workbook,
    `${title} - Unmatched Bank`,
    reconciliationData.matchResults.unmatchedBank,
    'UnmatchedBank'
  );
  
  // Add unmatched book transactions sheet
  addTransactionsSheet(
    workbook,
    `${title} - Unmatched Book`,
    reconciliationData.matchResults.unmatchedBook,
    'UnmatchedBook'
  );
}

/**
 * Add reconciliation summary to a new sheet
 * @param workbook Excel workbook
 * @param title Sheet title
 * @param reconciliationData Reconciliation data
 */
function addReconciliationSummarySheet(
  workbook: XLSX.WorkBook,
  title: string,
  reconciliationData: ReconciliationData
): void {
  // Create sheet name
  const sheetName = createSheetName(`${title} - Summary`);
  
  // Get summary data
  const summary = reconciliationData.matchResults?.summary;
  
  if (!summary) {
    addPlaceholderSheet(workbook, sheetName, 'Reconciliation summary not available');
    return;
  }
  
  // Create data
  const data = [
    ['Reconciliation Summary'],
    [],
    ['Account Information'],
    ['Account Name', reconciliationData.account.name],
    ['Account Number', reconciliationData.account.number],
    ['Currency', reconciliationData.account.currency],
    ['Opening Balance', reconciliationData.account.openingBalance],
    ['Closing Balance', reconciliationData.account.closingBalance],
    [],
    ['Reconciliation Results'],
    ['Status', summary.status],
    ['Matched Amount', summary.matchedAmount],
    ['Unmatched Bank Amount', summary.unmatchedBankAmount],
    ['Unmatched Book Amount', summary.unmatchedBookAmount],
    ['Discrepancy', summary.discrepancy],
    ['Match Percentage', `${summary.matchPercentage.toFixed(2)}%`]
  ];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Set column widths
  const colWidths = [{ wch: 25 }, { wch: 25 }];
  worksheet['!cols'] = colWidths;
}

/**
 * Add matched transactions to a new sheet
 * @param workbook Excel workbook
 * @param title Base sheet title
 * @param matchedTransactions Matched transactions
 */
function addMatchedTransactionsSheet(
  workbook: XLSX.WorkBook,
  title: string,
  matchedTransactions: any[]
): void {
  // Create sheet name
  const sheetName = createSheetName(`${title} - Matched`);
  
  // Create headers
  const headers = [
    'Bank Transaction ID', 'Bank Date', 'Bank Description', 'Bank Amount', 
    'Book Transaction ID', 'Book Date', 'Book Description', 'Book Amount',
    'Confidence', 'Match Method'
  ];
  
  // Create rows
  const rows = matchedTransactions.map(match => [
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
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Style header row
  if (worksheet['!ref']) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }
  }
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Set column widths
  const colWidths = headers.map(header => ({
    wch: Math.max(header.length, 10) + 2
  }));
  worksheet['!cols'] = colWidths;
}

/**
 * Add transactions to a new sheet
 * @param workbook Excel workbook
 * @param title Sheet title
 * @param transactions Transactions
 * @param suffix Sheet name suffix
 */
function addTransactionsSheet(
  workbook: XLSX.WorkBook,
  title: string,
  transactions: Transaction[],
  suffix: string
): void {
  // Create sheet name
  const sheetName = createSheetName(`${title} - ${suffix}`);
  
  // Create headers
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
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Style header row
  if (worksheet['!ref']) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }
  }
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Set column widths
  const colWidths = headers.map(header => ({
    wch: Math.max(header.length, 10) + 2
  }));
  worksheet['!cols'] = colWidths;
}

/**
 * Add a placeholder sheet
 * @param workbook Excel workbook
 * @param title Sheet title
 * @param message Placeholder message
 */
function addPlaceholderSheet(workbook: XLSX.WorkBook, title: string, message: string): void {
  // Create sheet name
  const sheetName = createSheetName(title);
  
  // Create data
  const data = [[message]];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}

/**
 * Create a valid Excel sheet name
 * @param title Base title
 * @param index Optional index
 * @returns Valid sheet name
 */
function createSheetName(title: string, index?: number): string {
  // Replace invalid characters
  let sheetName = title.replace(/[\\/?*[\]]/g, ' ');
  
  // Add index if provided
  if (index !== undefined) {
    sheetName = `${index}_${sheetName}`;
  }
  
  // Excel sheet names are limited to 31 characters
  if (sheetName.length > 31) {
    sheetName = sheetName.substring(0, 31);
  }
  
  return sheetName;
}

/**
 * Generate Excel file from workbook
 * @param workbook Excel workbook
 * @returns Excel file as array buffer
 */
export function generateExcelFile(workbook: XLSX.WorkBook): ArrayBuffer {
  // Generate Excel file
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Excel export options
 */
export interface ExcelExportOptions {
  /** Sheet name */
  sheetName?: string;
  /** Include column widths */
  includeColumnWidths?: boolean;
  /** Generate formulas */
  generateFormulas?: boolean;
  /** Format dates */
  formatDates?: boolean;
  /** Author name */
  author?: string;
} 