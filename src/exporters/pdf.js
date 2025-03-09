"use strict";
/**
 * PDF export functionality for financial reports
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReportToPdf = exportReportToPdf;
var jspdf_1 = require("jspdf");
var currency_1 = require("../utils/currency");
var date_1 = require("../utils/date");
/**
 * Export a financial report to PDF
 * @param report Report configuration
 * @param options PDF export options
 * @returns PDF document as Blob
 */
function exportReportToPdf(report_1) {
    return __awaiter(this, arguments, void 0, function (report, options) {
        var doc, i, section, _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    doc = createPdfDocument(report, options);
                    // Add header
                    addReportHeader(doc, report);
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < report.sections.length)) return [3 /*break*/, 10];
                    section = report.sections[i];
                    // Add section title
                    addSectionTitle(doc, section.title);
                    _a = section.type;
                    switch (_a) {
                        case 'summary': return [3 /*break*/, 2];
                        case 'chart': return [3 /*break*/, 3];
                        case 'table': return [3 /*break*/, 5];
                        case 'text': return [3 /*break*/, 6];
                        case 'reconciliation': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 2:
                    addSummarySection(doc, section.content);
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, addChartSection(doc, section.content)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 5:
                    addTableSection(doc, section.content);
                    return [3 /*break*/, 8];
                case 6:
                    addTextSection(doc, section.content);
                    return [3 /*break*/, 8];
                case 7:
                    // TODO: Add reconciliation section
                    addTextSection(doc, { text: 'Reconciliation report will be implemented in a future version' });
                    return [3 /*break*/, 8];
                case 8:
                    // Add page break if not the last section
                    if (i < report.sections.length - 1) {
                        doc.addPage();
                    }
                    _b.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 1];
                case 10:
                    // Add footer
                    addReportFooter(doc, report);
                    // Return as blob
                    return [2 /*return*/, doc.output('blob')];
            }
        });
    });
}
/**
 * Create a new PDF document
 * @param report Report configuration
 * @param options PDF export options
 * @returns jsPDF document
 */
function createPdfDocument(report, options) {
    var _a, _b, _c;
    // Get page orientation
    var orientation = ((_a = report.pageConfig) === null || _a === void 0 ? void 0 : _a.orientation) || 'portrait';
    // Get page size
    var format = ((_b = report.pageConfig) === null || _b === void 0 ? void 0 : _b.size) || 'A4';
    // Create PDF document
    return new jspdf_1.jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format,
        compress: (_c = options.compress) !== null && _c !== void 0 ? _c : true,
    });
}
/**
 * Add report header to PDF
 * @param doc PDF document
 * @param report Report configuration
 */
function addReportHeader(doc, report) {
    var pageWidth = doc.internal.pageSize.getWidth();
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
        var dateText = "Period: ".concat((0, date_1.formatDate)(report.dateRange.startDate), " - ").concat((0, date_1.formatDate)(report.dateRange.endDate));
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
            }
            catch (error) {
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
function addSectionTitle(doc, title) {
    // Get current Y position or use a default value
    var currentY = 70;
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
function addSummarySection(doc, content) {
    // Use a default Y position
    var currentY = 90;
    var pageWidth = doc.internal.pageSize.getWidth();
    var itemWidth = (pageWidth - 30) / 2;
    var x = 15;
    var y = currentY;
    // Add each summary item in a grid layout
    content.items.forEach(function (item, index) {
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
        var valueText = typeof item.value === 'number'
            ? (0, currency_1.formatNumber)(item.value)
            : String(item.value);
        doc.text(valueText, x + 5, y + 18);
        // Add change percentage if present
        if (item.changePercentage !== undefined) {
            doc.setFontSize(10);
            var changeText = (0, currency_1.formatPercentage)(item.changePercentage);
            var textWidth = doc.getTextWidth(changeText);
            // Green for positive, red for negative
            if (item.changePercentage >= 0) {
                doc.setTextColor(0, 150, 0);
                doc.text("+".concat(changeText), x + itemWidth - textWidth - 5, y + 18);
            }
            else {
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
function addChartSection(doc, content) {
    return __awaiter(this, void 0, void 0, function () {
        var currentY, pageWidth;
        return __generator(this, function (_a) {
            currentY = 120;
            pageWidth = doc.internal.pageSize.getWidth();
            // Placeholder for chart
            doc.setDrawColor(200, 200, 200);
            doc.setFillColor(245, 245, 245);
            doc.roundedRect(15, currentY, pageWidth - 30, 100, 3, 3, 'FD');
            doc.setFontSize(12);
            doc.text('Chart visualization will be rendered here', pageWidth / 2, currentY + 50, { align: 'center' });
            return [2 /*return*/];
        });
    });
}
/**
 * Add table section to PDF
 * @param doc PDF document
 * @param content Table content
 */
function addTableSection(doc, content) {
    // Use a default Y position
    var currentY = 120;
    var pageWidth = doc.internal.pageSize.getWidth();
    // Calculate column widths
    var numColumns = content.headers.length;
    var colWidth = (pageWidth - 30) / numColumns;
    // Draw headers
    doc.setFillColor(230, 230, 230);
    doc.rect(15, currentY, pageWidth - 30, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    content.headers.forEach(function (header, index) {
        var x = 15 + index * colWidth;
        doc.text(header, x + 5, currentY + 7);
    });
    doc.setFont('helvetica', 'normal');
    // Draw rows
    var rowY = currentY + 10;
    content.rows.forEach(function (row, rowIndex) {
        // Alternate row background
        if (rowIndex % 2 === 1) {
            doc.setFillColor(245, 245, 245);
            doc.rect(15, rowY, pageWidth - 30, 8, 'F');
        }
        row.forEach(function (cell, colIndex) {
            var x = 15 + colIndex * colWidth;
            doc.text(String(cell), x + 5, rowY + 6);
        });
        rowY += 8;
    });
    // Draw summary row if present
    if (content.summary) {
        doc.setDrawColor(150, 150, 150);
        doc.line(15, rowY, pageWidth - 15, rowY);
        doc.setFont('helvetica', 'bold');
        content.summary.forEach(function (cell, colIndex) {
            var x = 15 + colIndex * colWidth;
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
function addTextSection(doc, content) {
    // Use a default Y position
    var currentY = 120;
    var pageWidth = doc.internal.pageSize.getWidth();
    // Handle different formats
    if (content.format === 'markdown' || content.format === 'html') {
        // For now, treat as plain text (future: parse markdown/html)
        doc.setFontSize(11);
        doc.text(content.text, 15, currentY, {
            maxWidth: pageWidth - 30,
            align: 'left'
        });
    }
    else {
        // Plain text
        doc.setFontSize(11);
        doc.text(content.text, 15, currentY, {
            maxWidth: pageWidth - 30,
            align: 'left'
        });
    }
    // Calculate text height (approximate)
    var textLines = doc.splitTextToSize(content.text, pageWidth - 30);
    var textHeight = textLines.length * 5; // 5mm per line (approx)
}
/**
 * Add report footer to PDF
 * @param doc PDF document
 * @param report Report configuration
 */
function addReportFooter(doc, report) {
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    // Add page number
    var pageCount = doc.getNumberOfPages();
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        var pageText = "Page ".concat(i, " of ").concat(pageCount);
        doc.text(pageText, pageWidth - 20, pageHeight - 10, { align: 'right' });
        // Add generation date
        var dateText = "Generated on ".concat((0, date_1.formatDate)(new Date(), 'YYYY-MM-DD HH:mm'));
        doc.text(dateText, 20, pageHeight - 10);
    }
}
