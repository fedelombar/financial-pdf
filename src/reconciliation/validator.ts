/**
 * Validator functions for bank reconciliation
 */

import { ReconciliationData, Transaction } from '../types';

/**
 * Validate reconciliation data
 * @param data Reconciliation data to validate
 * @returns Validation result
 */
export function validateReconciliationData(data: ReconciliationData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if account info is present
  if (!data.account) {
    errors.push('Account information is required');
  } else {
    // Validate account fields
    if (!data.account.name) errors.push('Account name is required');
    if (!data.account.number) errors.push('Account number is required');
    if (!data.account.currency) errors.push('Account currency is required');
  }
  
  // Check if period is defined
  if (!data.period) {
    errors.push('Statement period is required');
  } else {
    // Validate period dates
    if (!data.period.startDate) errors.push('Start date is required');
    if (!data.period.endDate) errors.push('End date is required');
    
    // Check if end date is after start date
    if (data.period.startDate && data.period.endDate && 
        data.period.endDate < data.period.startDate) {
      errors.push('End date must be after start date');
    }
  }
  
  // Check transactions
  if (!data.bankTransactions || !Array.isArray(data.bankTransactions)) {
    errors.push('Bank transactions must be an array');
  } else if (data.bankTransactions.length === 0) {
    errors.push('At least one bank transaction is required');
  }
  
  if (!data.bookTransactions || !Array.isArray(data.bookTransactions)) {
    errors.push('Book transactions must be an array');
  } else if (data.bookTransactions.length === 0) {
    errors.push('At least one book transaction is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a transaction
 * @param transaction Transaction to validate
 * @returns Validation result
 */
export function validateTransaction(transaction: Transaction): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!transaction.id) errors.push('Transaction ID is required');
  if (!transaction.date) errors.push('Transaction date is required');
  if (!transaction.description) errors.push('Transaction description is required');
  if (transaction.amount === undefined || transaction.amount === null) {
    errors.push('Transaction amount is required');
  }
  if (!transaction.type) {
    errors.push('Transaction type is required');
  } else if (transaction.type !== 'debit' && transaction.type !== 'credit') {
    errors.push('Transaction type must be either "debit" or "credit"');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
