/**
 * PDF export functionality for financial reports
 */

import { jsPDF } from 'jspdf';
import { ChartConfig } from '../types/chart';
import { ReportConfig, ReportSection, TableContent, SummaryContent, TextContent } from '../types/report';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/currency';
import { formatDate } from '../utils/date';

// Use any type to bypass TypeScript issues with jsPDF
// This is necessary because the jsPDF types don't match the actual API
type PDFDocument = any;

/**
 * Export a financial report to PDF
 * @param report Report configuration
 * @param options PDF export options
 * @returns PDF document as Blob
 */
export async function exportReportToPdf(
  report: ReportConfig,
  options: PdfExportOptions = {}
): Promise<Blob> {
  // Create PDF document
  const doc = createPdfDocument(report, options);
  
  // Add header
  addReportHeader(doc, report);
  
  // Process each section
  for (let i = 0; i < report.sections.length; i++) {
    const section = report.sections[i];
    
    // Add section title
    addSectionTitle(doc, section.title);
    
    // Process section based on type
    switch (section.type) {
      case 'summary':
        addSummarySection(doc, section.content as SummaryContent);
        break;
      case 'chart':
        await addChartSection(doc, section.content as ChartConfig);
        break;
      case 'table':
        addTableSection(doc, section.content as TableContent);
        break;
      case 'text':
        addTextSection(doc, section.content as TextContent);
        break;
      case 'reconciliation':
        // TODO: Add reconciliation section
        addTextSection(doc, { text: 'Reconciliation report will be implemented in a future version' });
        break;
    }
    
    // Add page break if not the last section
    if (i < report.sections.length - 1) {
      doc.addPage();
    }
  }
  
  // Add footer
  addReportFooter(doc, report);
  
  // Return as blob
  return doc.output('blob');
}

/**
 * Create a new PDF document
 * @param report Report configuration
 * @param options PDF export options
 * @returns jsPDF document
 */
function createPdfDocument(report: ReportConfig, options: PdfExportOptions): PDFDocument {
  // Get page orientation
  const orientation = report.pageConfig?.orientation || 'portrait';
  
  // Get page size
  const format = report.pageConfig?.size || 'A4';
  
  // Create PDF document
  return new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: format,
    compress: options.compress ?? true,
  });
}

/**
 * Add report header to PDF
 * @param doc PDF document
 * @param report Report configuration
 */
function addReportHeader(doc: PDFDocument, report: ReportConfig): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(18);
  doc.text(report.title, pageWidth / 2, 15, { align: 'center' });
  
  // Add subtitle if present
  if (report.subtitle) {
    doc.setFontSize(14);
    doc.text(report.subtitle, pageWidth / 2, 25, { align: 'center' });
  }
  
  // Add date range if present
  if (report.dateRange) {
    doc.setFontSize(10);
    const dateText = `Period: ${formatDate(report.dateRange.startDate)} - ${formatDate(report.dateRange.endDate)}`;
    doc.text(dateText, pageWidth / 2, 35, { align: 'center' });
  }
  
  // Add company information if present
  if (report.company) {
    doc.setFontSize(12);
    doc.text(report.company.name, pageWidth / 2, 45, { align: 'center' });
    
    if (report.company.address) {
      doc.setFontSize(10);
      doc.text(report.company.address, pageWidth / 2, 52, { align: 'center' });
    }
    
    // Add company logo if present
    if (report.company.logo) {
      try {
        doc.addImage(report.company.logo, 'PNG', 15, 15, 30, 30);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
  }
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 60, pageWidth - 15, 60);
  
  // Set starting position for content
  doc.setFontSize(12);
  // Position cursor at 70mm from top
  // We're not using setY since it may not be supported in all jsPDF versions
}

/**
 * Add section title to PDF
 * @param doc PDF document
 * @param title Section title
 */
function addSectionTitle(doc: PDFDocument, title: string): void {
  // Get current Y position or use a default value
  let currentY = 70;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 15, currentY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
}

/**
 * Add summary section to PDF
 * @param doc PDF document
 * @param content Summary content
 */
function addSummarySection(doc: PDFDocument, content: SummaryContent): void {
  // Use a default Y position
  const currentY = 90;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const itemWidth = (pageWidth - 30) / 2;
  let x = 15;
  let y = currentY;
  
  // Add each summary item in a grid layout
  content.items.forEach((item, index) => {
    // Start a new row every two items
    if (index > 0 && index % 2 === 0) {
      x = 15;
      y += 30;
    }
    
    // Draw item box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, y, itemWidth, 25, 2, 2, 'F');
    
    // Add label
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(item.label, x + 5, y + 8);
    
    // Add value
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    let valueText = typeof item.value === 'number' 
      ? formatNumber(item.value) 
      : String(item.value);
    doc.text(valueText, x + 5, y + 18);
    
    // Add change percentage if present
    if (item.changePercentage !== undefined) {
      doc.setFontSize(10);
      const changeText = formatPercentage(item.changePercentage);
      const textWidth = doc.getTextWidth(changeText);
      
      // Green for positive, red for negative
      if (item.changePercentage >= 0) {
        doc.setTextColor(0, 150, 0);
        doc.text(`+${changeText}`, x + itemWidth - textWidth - 5, y + 18);
      } else {
        doc.setTextColor(200, 0, 0);
        doc.text(changeText, x + itemWidth - textWidth - 5, y + 18);
      }
    }
    
    // Move to next column
    x += itemWidth + 10;
  });
  
  doc.setTextColor(0, 0, 0);
}

/**
 * Add chart section to PDF
 * @param doc PDF document
 * @param content Chart configuration
 */
async function addChartSection(doc: PDFDocument, content: ChartConfig): Promise<void> {
  // Use a default Y position
  const currentY = 120;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Placeholder for chart
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, currentY, pageWidth - 30, 100, 3, 3, 'FD');
  
  doc.setFontSize(12);
  doc.text('Chart visualization will be rendered here', pageWidth / 2, currentY + 50, { align: 'center' });
}

/**
 * Add table section to PDF
 * @param doc PDF document
 * @param content Table content
 */
function addTableSection(doc: PDFDocument, content: TableContent): void {
  // Use a default Y position
  const currentY = 120;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Calculate column widths
  const numColumns = content.headers.length;
  const colWidth = (pageWidth - 30) / numColumns;
  
  // Draw headers
  doc.setFillColor(230, 230, 230);
  doc.rect(15, currentY, pageWidth - 30, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  content.headers.forEach((header, index) => {
    const x = 15 + index * colWidth;
    doc.text(header, x + 5, currentY + 7);
  });
  
  doc.setFont('helvetica', 'normal');
  
  // Draw rows
  let rowY = currentY + 10;
  
  content.rows.forEach((row, rowIndex) => {
    // Alternate row background
    if (rowIndex % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, rowY, pageWidth - 30, 8, 'F');
    }
    
    row.forEach((cell, colIndex) => {
      const x = 15 + colIndex * colWidth;
      doc.text(String(cell), x + 5, rowY + 6);
    });
    
    rowY += 8;
  });
  
  // Draw summary row if present
  if (content.summary) {
    doc.setDrawColor(150, 150, 150);
    doc.line(15, rowY, pageWidth - 15, rowY);
    
    doc.setFont('helvetica', 'bold');
    
    content.summary.forEach((cell, colIndex) => {
      const x = 15 + colIndex * colWidth;
      doc.text(String(cell), x + 5, rowY + 6);
    });
    
    doc.setFont('helvetica', 'normal');
    rowY += 8;
  }
}

/**
 * Add text section to PDF
 * @param doc PDF document
 * @param content Text content
 */
function addTextSection(doc: PDFDocument, content: TextContent): void {
  // Use a default Y position
  const currentY = 120;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Handle different formats
  if (content.format === 'markdown' || content.format === 'html') {
    // For now, treat as plain text (future: parse markdown/html)
    doc.setFontSize(11);
    doc.text(content.text, 15, currentY, { 
      maxWidth: pageWidth - 30,
      align: 'left' 
    });
  } else {
    // Plain text
    doc.setFontSize(11);
    doc.text(content.text, 15, currentY, { 
      maxWidth: pageWidth - 30,
      align: 'left' 
    });
  }
  
  // Calculate text height (approximate)
  const textLines = doc.splitTextToSize(content.text, pageWidth - 30);
  const textHeight = textLines.length * 5; // 5mm per line (approx)
}

/**
 * Add report footer to PDF
 * @param doc PDF document
 * @param report Report configuration
 */
function addReportFooter(doc: PDFDocument, report: ReportConfig): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
  
  // Add page number
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    
    const pageText = `Page ${i} of ${pageCount}`;
    doc.text(pageText, pageWidth - 20, pageHeight - 10, { align: 'right' });
    
    // Add generation date
    const dateText = `Generated on ${formatDate(new Date(), 'YYYY-MM-DD HH:mm')}`;
    doc.text(dateText, 20, pageHeight - 10);
  }
}

/**
 * PDF export options
 */
export interface PdfExportOptions {
  /** Enable compression */
  compress?: boolean;
  /** PDF quality */
  quality?: 'low' | 'medium' | 'high';
  /** PDF document properties */
  documentProperties?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
  };
  /** Chart rendering mode */
  chartRenderMode?: 'svg' | 'canvas';
} 