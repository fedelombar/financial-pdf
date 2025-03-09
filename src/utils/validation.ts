/**
 * Validation utilities for financial reports
 */

/**
 * Check if a value is a number
 * @param value Value to check
 * @returns True if value is a number
 */
export function isNumber(value: any): boolean {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value));
  return false;
}

/**
 * Check if a value is a valid date
 * @param value Value to check
 * @returns True if value is a valid date
 */
export function isValidDate(value: any): boolean {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return false;
}

/**
 * Check if a value is a string
 * @param value Value to check
 * @returns True if value is a string
 */
export function isString(value: any): boolean {
  return typeof value === 'string';
}

/**
 * Check if a value is an array
 * @param value Value to check
 * @returns True if value is an array
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Check if a value is an object
 * @param value Value to check
 * @returns True if value is an object
 */
export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value Value to check
 * @returns True if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if a value is a valid currency code (ISO 4217)
 * @param code Currency code to check
 * @returns True if code is a valid currency code
 */
export function isValidCurrencyCode(code: string): boolean {
  // Simple validation for common currency codes (not exhaustive)
  const validCodes = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD',
    'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'BRL', 'ZAR', 'RUB'
  ];
  
  return validCodes.includes(code.toUpperCase());
}

/**
 * Check if a string is a valid email
 * @param email Email to check
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate number is within a range
 * @param value Number to check
 * @param min Minimum value
 * @param max Maximum value
 * @returns True if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate a string matches a regex pattern
 * @param value String to check
 * @param pattern Regex pattern
 * @returns True if string matches pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validate an object has all required properties
 * @param obj Object to check
 * @param requiredProps Array of required property names
 * @returns True if object has all required properties
 */
export function hasRequiredProperties(obj: Record<string, any>, requiredProps: string[]): boolean {
  if (!isObject(obj)) return false;
  
  for (const prop of requiredProps) {
    if (!(prop in obj) || obj[prop] === undefined) {
      return false;
    }
  }
  
  return true;
} 