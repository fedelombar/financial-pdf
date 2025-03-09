/**
 * Date utilities for financial reports
 */

// Import dayjs with proper CommonJS syntax
import * as dayjs from 'dayjs';

// Create a helper function to format dates
function formatWithDayjs(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  return dayjs.default(date).format(format);
}

/**
 * Format a date according to the specified format
 * @param date Date to format
 * @param format Format string (dayjs format)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  // Simple built-in formatting to avoid dayjs issues
  if (date instanceof Date) {
    const d = date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    } else if (format === 'YYYY-MM-DD HH:mm') {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
  
  // For anything not handled by simple formatting, convert to string
  return String(date);
}

/**
 * Get the start of a month
 * @param date Date within the month
 * @returns Date object for the first day of the month
 */
export function startOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of a month
 * @param date Date within the month
 * @returns Date object for the last day of the month
 */
export function endOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Calculate the difference in days between two dates
 * @param dateA First date
 * @param dateB Second date
 * @returns Number of days difference
 */
export function daysDifference(dateA: Date | string | number, dateB: Date | string | number): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffTime = Math.abs(b.getTime() - a.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is within a range
 * @param date Date to check
 * @param startDate Range start date
 * @param endDate Range end date
 * @returns True if date is within range
 */
export function isDateInRange(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

/**
 * Create a date range array
 * @param startDate Range start date
 * @param endDate Range end date
 * @param interval Interval ('day' | 'week' | 'month')
 * @returns Array of dates in the range
 */
export function createDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  interval: 'day' | 'week' | 'month' = 'day'
): Date[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];
  
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    
    if (interval === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (interval === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (interval === 'month') {
      current.setMonth(current.getMonth() + 1);
    }
  }
  
  return dates;
}

/**
 * Get the current financial quarter dates
 * @param date Date within the quarter
 * @param fiscalYearStart Month when fiscal year starts (1-12)
 * @returns Object with start and end dates of the quarter
 */
export function getQuarterDates(
  date: Date | string | number,
  fiscalYearStart: number = 1
): { startDate: Date; endDate: Date } {
  const d = new Date(date);
  const month = d.getMonth() + 1; // 1-12
  
  // Adjust for fiscal year if needed
  const adjustedMonth = ((month - fiscalYearStart + 12) % 12) + 1;
  
  // Calculate quarter (1-4)
  const quarter = Math.ceil(adjustedMonth / 3);
  
  // Calculate start month of the quarter in fiscal year
  const startMonth = ((quarter - 1) * 3 + fiscalYearStart - 1) % 12;
  
  // Adjust year if needed
  const year = d.getFullYear();
  const fiscalYear = month < fiscalYearStart ? year - 1 : year;
  
  // Create start date
  const startDate = new Date(fiscalYear, startMonth, 1);
  startDate.setHours(0, 0, 0, 0);
  
  // Create end date (start date + 3 months - 1 day)
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);
  endDate.setDate(0); // Last day of previous month
  endDate.setHours(23, 59, 59, 999);
  
  return {
    startDate,
    endDate
  };
} 