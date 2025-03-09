"use strict";
/**
 * Date utilities for financial reports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.startOfMonth = startOfMonth;
exports.endOfMonth = endOfMonth;
exports.daysDifference = daysDifference;
exports.isDateInRange = isDateInRange;
exports.createDateRange = createDateRange;
exports.getQuarterDates = getQuarterDates;
var dayjs_1 = require("dayjs");
/**
 * Format a date according to the specified format
 * @param date Date to format
 * @param format Format string (dayjs format)
 * @returns Formatted date string
 */
function formatDate(date, format) {
    if (format === void 0) { format = 'YYYY-MM-DD'; }
    return (0, dayjs_1.default)(date).format(format);
}
/**
 * Get the start of a month
 * @param date Date within the month
 * @returns Date object for the first day of the month
 */
function startOfMonth(date) {
    return (0, dayjs_1.default)(date).startOf('month').toDate();
}
/**
 * Get the end of a month
 * @param date Date within the month
 * @returns Date object for the last day of the month
 */
function endOfMonth(date) {
    return (0, dayjs_1.default)(date).endOf('month').toDate();
}
/**
 * Calculate the difference in days between two dates
 * @param dateA First date
 * @param dateB Second date
 * @returns Number of days difference
 */
function daysDifference(dateA, dateB) {
    var a = (0, dayjs_1.default)(dateA);
    var b = (0, dayjs_1.default)(dateB);
    return Math.abs(a.diff(b, 'day'));
}
/**
 * Check if a date is within a range
 * @param date Date to check
 * @param startDate Range start date
 * @param endDate Range end date
 * @returns True if date is within range
 */
function isDateInRange(date, startDate, endDate) {
    var d = (0, dayjs_1.default)(date);
    var start = (0, dayjs_1.default)(startDate);
    var end = (0, dayjs_1.default)(endDate);
    return d.isAfter(start) && d.isBefore(end) || d.isSame(start) || d.isSame(end);
}
/**
 * Create a date range array
 * @param startDate Range start date
 * @param endDate Range end date
 * @param interval Interval ('day', 'week', 'month', etc.)
 * @returns Array of dates in the range
 */
function createDateRange(startDate, endDate, interval) {
    if (interval === void 0) { interval = 'day'; }
    var start = (0, dayjs_1.default)(startDate);
    var end = (0, dayjs_1.default)(endDate);
    var dates = [];
    var current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
        dates.push(current.toDate());
        current = current.add(1, interval);
    }
    return dates;
}
/**
 * Get the current financial quarter dates
 * @param date Date within the quarter
 * @param fiscalYearStart Month when fiscal year starts (1-12)
 * @returns Object with start and end dates of the quarter
 */
function getQuarterDates(date, fiscalYearStart) {
    if (fiscalYearStart === void 0) { fiscalYearStart = 1; }
    var d = (0, dayjs_1.default)(date);
    var month = d.month() + 1; // 1-12
    // Adjust for fiscal year if needed
    var adjustedMonth = ((month - fiscalYearStart + 12) % 12) + 1;
    // Calculate quarter (1-4)
    var quarter = Math.ceil(adjustedMonth / 3);
    // Calculate start month of the quarter in fiscal year
    var startMonth = ((quarter - 1) * 3 + fiscalYearStart - 1) % 12;
    // Adjust year if needed
    var year = d.year();
    var fiscalYear = month < fiscalYearStart ? year - 1 : year;
    // Create start and end dates
    var startDate = (0, dayjs_1.default)().year(fiscalYear).month(startMonth).date(1).startOf('day');
    var endDate = startDate.add(3, 'month').subtract(1, 'day').endOf('day');
    return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
    };
}
