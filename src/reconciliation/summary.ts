/**
 * Summary generation for bank reconciliation
 */

import { AccountInfo, MatchedTransaction, ReconciliationSummary, Transaction } from '../types';

/**
 * Generate reconciliation summary
 * @param account Account information
 * @param matched Matched transactions
 * @param unmatchedBank Unmatched bank transactions
 * @param unmatchedBook Unmatched book transactions
 * @returns Reconciliation summary
 */
export function generateReconciliationSummary(
  account: AccountInfo,
  matched: MatchedTransaction[],
  unmatchedBank: Transaction[],
  unmatchedBook: Transaction[]
): ReconciliationSummary {
  // Calculate totals
  const matchedAmount = matched.reduce((sum, match) => sum + match.bankTransaction.amount, 0);
  const unmatchedBankAmount = unmatchedBank.reduce((sum, tx) => sum + tx.amount, 0);
  const unmatchedBookAmount = unmatchedBook.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate discrepancy
  const discrepancy = unmatchedBankAmount - unmatchedBookAmount;
  
  // Calculate match percentage
  const totalTransactions = matched.length + unmatchedBank.length + unmatchedBook.length;
  const matchPercentage = totalTransactions > 0 
    ? (matched.length / totalTransactions) * 100
    : 100;
  
  return {
    matchedAmount,
    unmatchedBankAmount,
    unmatchedBookAmount,
    discrepancy,
    status: Math.abs(discrepancy) < 0.01 ? 'balanced' : 'unbalanced',
    matchPercentage
  };
}

/**
 * Generate a detailed reconciliation report
 * @param account Account information
 * @param matched Matched transactions
 * @param unmatchedBank Unmatched bank transactions
 * @param unmatchedBook Unmatched book transactions
 * @returns Detailed reconciliation report
 */
export function generateDetailedReconciliationReport(
  account: AccountInfo,
  matched: MatchedTransaction[],
  unmatchedBank: Transaction[],
  unmatchedBook: Transaction[]
): {
  summary: ReconciliationSummary;
  accountInfo: AccountInfo;
  matchedCategories: Record<string, number>;
  unmatchedCategories: Record<string, number>;
} {
  // Generate basic summary
  const summary = generateReconciliationSummary(account, matched, unmatchedBank, unmatchedBook);
  
  // Calculate matched transactions by category
  const matchedCategories: Record<string, number> = {};
  matched.forEach(match => {
    const category = match.bankTransaction.category || 'Uncategorized';
    matchedCategories[category] = (matchedCategories[category] || 0) + 1;
  });
  
  // Calculate unmatched transactions by category
  const unmatchedCategories: Record<string, number> = {};
  
  // Bank transactions
  unmatchedBank.forEach(tx => {
    const category = tx.category || 'Uncategorized';
    unmatchedCategories[category] = (unmatchedCategories[category] || 0) + 1;
  });
  
  // Book transactions
  unmatchedBook.forEach(tx => {
    const category = tx.category || 'Uncategorized';
    unmatchedCategories[category] = (unmatchedCategories[category] || 0) + 1;
  });
  
  return {
    summary,
    accountInfo: account,
    matchedCategories,
    unmatchedCategories
  };
}
