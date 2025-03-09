"use strict";
/**
 * Currency utilities for financial reports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatNumber = formatNumber;
exports.calculatePercentageChange = calculatePercentageChange;
exports.formatPercentage = formatPercentage;
exports.sum = sum;
exports.average = average;
exports.round = round;
exports.convertCurrency = convertCurrency;
var decimal_js_1 = require("decimal.js");
/**
 * Format a number as currency
 * @param amount Amount to format
 * @param currency Currency code (ISO 4217) or symbol
 * @param locale Locale for formatting
 * @returns Formatted currency string
 */
function formatCurrency(amount, currency, locale) {
    if (currency === void 0) { currency = 'USD'; }
    if (locale === void 0) { locale = 'en-US'; }
    // Use Intl.NumberFormat for localized currency formatting
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.length === 3 ? currency : 'USD',
        currencyDisplay: currency.length === 3 ? 'symbol' : 'code',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
}
/**
 * Format a number with decimal places and thousands separators
 * @param number Number to format
 * @param decimalPlaces Number of decimal places
 * @param decimalSeparator Decimal separator
 * @param thousandsSeparator Thousands separator
 * @returns Formatted number string
 */
function formatNumber(number, decimalPlaces, decimalSeparator, thousandsSeparator) {
    if (decimalPlaces === void 0) { decimalPlaces = 2; }
    if (decimalSeparator === void 0) { decimalSeparator = '.'; }
    if (thousandsSeparator === void 0) { thousandsSeparator = ','; }
    // Convert to number if string
    var num = typeof number === 'string' ? parseFloat(number) : number;
    // Use Decimal.js for precise decimal arithmetic
    var decimal = new decimal_js_1.Decimal(num);
    // Format with specified decimal places
    var parts = decimal.toFixed(decimalPlaces).split('.');
    // Format integer part with thousands separator
    var integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    // Combine with decimal part
    return parts.length > 1
        ? "".concat(integerPart).concat(decimalSeparator).concat(parts[1])
        : integerPart;
}
/**
 * Calculate percentage change between two values
 * @param oldValue Old value
 * @param newValue New value
 * @returns Percentage change
 */
function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0)
        return newValue === 0 ? 0 : 100;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}
/**
 * Format a percentage value
 * @param percentage Percentage value
 * @param decimalPlaces Number of decimal places
 * @param includeSymbol Whether to include the % symbol
 * @returns Formatted percentage string
 */
function formatPercentage(percentage, decimalPlaces, includeSymbol) {
    if (decimalPlaces === void 0) { decimalPlaces = 2; }
    if (includeSymbol === void 0) { includeSymbol = true; }
    var formatted = percentage.toFixed(decimalPlaces);
    return includeSymbol ? "".concat(formatted, "%") : formatted;
}
/**
 * Sum an array of numbers
 * @param values Array of numbers to sum
 * @returns Sum of values
 */
function sum(values) {
    return values.reduce(function (total, value) {
        // Use Decimal.js for precise arithmetic
        return new decimal_js_1.Decimal(total).plus(new decimal_js_1.Decimal(value)).toNumber();
    }, 0);
}
/**
 * Calculate average of an array of numbers
 * @param values Array of numbers
 * @returns Average value
 */
function average(values) {
    if (values.length === 0)
        return 0;
    return sum(values) / values.length;
}
/**
 * Round a number to a specified precision
 * @param value Value to round
 * @param precision Decimal precision
 * @returns Rounded value
 */
function round(value, precision) {
    if (precision === void 0) { precision = 2; }
    return new decimal_js_1.Decimal(value).toDecimalPlaces(precision).toNumber();
}
/**
 * Convert currency value from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @param exchangeRate Exchange rate (from currency to target currency)
 * @returns Converted amount
 */
function convertCurrency(amount, fromCurrency, toCurrency, exchangeRate) {
    if (fromCurrency === toCurrency)
        return amount;
    return new decimal_js_1.Decimal(amount).times(new decimal_js_1.Decimal(exchangeRate)).toNumber();
}
