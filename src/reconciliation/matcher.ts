/**
 * Transaction matching for bank reconciliation
 */

import { ReconciliationData, Transaction, MatchResults, MatchedTransaction, ReconciliationSummary } from '../types/reconciliation';

/**
 * Process reconciliation data and match transactions
 * @param data Reconciliation data
 * @returns Match results
 */
export function processReconciliation(data: ReconciliationData): MatchResults {
  // Apply default settings if not provided
  const settings = {
    fuzzyMatching: true,
    fuzzyThreshold: 0.7,
    matchByAmount: true,
    matchByDescription: true,
    matchByReference: true,
    matchByDate: true,
    dateTolerance: 3,
    autoMatchExact: true,
    ...data.settings
  };

  // Match transactions
  const matchResults = matchTransactions(data.bankTransactions, data.bookTransactions, settings);

  // Calculate reconciliation summary
  const summary = calculateReconciliationSummary(
    data.account,
    matchResults.matched,
    matchResults.unmatchedBank,
    matchResults.unmatchedBook
  );

  return {
    matched: matchResults.matched,
    unmatchedBank: matchResults.unmatchedBank,
    unmatchedBook: matchResults.unmatchedBook,
    summary
  };
}

/**
 * Match bank transactions with book transactions
 * @param bankTransactions Bank transactions
 * @param bookTransactions Book transactions
 * @param settings Reconciliation settings
 * @returns Match results
 */
function matchTransactions(
  bankTransactions: Transaction[],
  bookTransactions: Transaction[],
  settings: any
): { matched: MatchedTransaction[], unmatchedBank: Transaction[], unmatchedBook: Transaction[] } {
  // Clone arrays to avoid modifying originals
  const remainingBankTransactions = [...bankTransactions];
  const remainingBookTransactions = [...bookTransactions];
  const matched: MatchedTransaction[] = [];

  // First pass: Exact matches (if enabled)
  if (settings.autoMatchExact) {
    findExactMatches(remainingBankTransactions, remainingBookTransactions, matched);
  }

  // Second pass: Fuzzy matches (if enabled)
  if (settings.fuzzyMatching) {
    findFuzzyMatches(
      remainingBankTransactions,
      remainingBookTransactions,
      matched,
      settings
    );
  }

  return {
    matched,
    unmatchedBank: remainingBankTransactions,
    unmatchedBook: remainingBookTransactions
  };
}

/**
 * Find exact matches between bank and book transactions
 * @param bankTransactions Bank transactions
 * @param bookTransactions Book transactions
 * @param matched Array to store matches
 */
function findExactMatches(
  bankTransactions: Transaction[],
  bookTransactions: Transaction[],
  matched: MatchedTransaction[]
) {
  // Iterate through bank transactions
  for (let i = bankTransactions.length - 1; i >= 0; i--) {
    const bankTx = bankTransactions[i];
    
    // Look for exact amount, date, and reference match
    const bookIndex = bookTransactions.findIndex(bookTx => 
      bookTx.amount === bankTx.amount &&
      bookTx.date.getTime() === bankTx.date.getTime() &&
      bookTx.reference === bankTx.reference
    );

    // If match found, add to matched array and remove from remaining arrays
    if (bookIndex !== -1) {
      const bookTx = bookTransactions[bookIndex];
      
      matched.push({
        bankTransaction: bankTx,
        bookTransaction: bookTx,
        confidence: 1.0,
        matchMethod: 'exact'
      });
      
      bankTransactions.splice(i, 1);
      bookTransactions.splice(bookIndex, 1);
    }
  }
}

/**
 * Find fuzzy matches between bank and book transactions
 * @param bankTransactions Bank transactions
 * @param bookTransactions Book transactions
 * @param matched Array to store matches
 * @param settings Reconciliation settings
 */
function findFuzzyMatches(
  bankTransactions: Transaction[],
  bookTransactions: Transaction[],
  matched: MatchedTransaction[],
  settings: any
) {
  // Iterate through bank transactions
  for (let i = bankTransactions.length - 1; i >= 0; i--) {
    const bankTx = bankTransactions[i];
    let bestMatch: { index: number, confidence: number } | null = null;
    
    // Compare with each book transaction
    for (let j = 0; j < bookTransactions.length; j++) {
      const bookTx = bookTransactions[j];
      const confidence = calculateMatchConfidence(bankTx, bookTx, settings);
      
      // If confidence is above threshold and better than previous matches
      if (confidence >= settings.fuzzyThreshold && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { index: j, confidence };
      }
    }
    
    // If a match was found
    if (bestMatch) {
      const bookTx = bookTransactions[bestMatch.index];
      
      matched.push({
        bankTransaction: bankTx,
        bookTransaction: bookTx,
        confidence: bestMatch.confidence,
        matchMethod: 'fuzzy'
      });
      
      bankTransactions.splice(i, 1);
      bookTransactions.splice(bestMatch.index, 1);
    }
  }
}

/**
 * Calculate match confidence between two transactions
 * @param bankTx Bank transaction
 * @param bookTx Book transaction
 * @param settings Reconciliation settings
 * @returns Confidence score (0-1)
 */
function calculateMatchConfidence(
  bankTx: Transaction,
  bookTx: Transaction,
  settings: any
): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  // Match by amount (exact)
  if (settings.matchByAmount) {
    const weight = 0.4; // Amount has highest weight
    totalWeight += weight;
    
    if (bankTx.amount === bookTx.amount) {
      totalScore += weight;
    }
  }
  
  // Match by date (with tolerance)
  if (settings.matchByDate) {
    const weight = 0.3;
    totalWeight += weight;
    
    const dateDiff = Math.abs(bankTx.date.getTime() - bookTx.date.getTime());
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= settings.dateTolerance) {
      // Scale score based on how close the dates are
      const dateScore = 1 - (daysDiff / settings.dateTolerance);
      totalScore += weight * dateScore;
    }
  }
  
  // Match by description (fuzzy)
  if (settings.matchByDescription && bankTx.description && bookTx.description) {
    const weight = 0.2;
    totalWeight += weight;
    
    const descriptionSimilarity = calculateStringSimilarity(
      bankTx.description.toLowerCase(),
      bookTx.description.toLowerCase()
    );
    
    totalScore += weight * descriptionSimilarity;
  }
  
  // Match by reference (fuzzy)
  if (settings.matchByReference && bankTx.reference && bookTx.reference) {
    const weight = 0.1;
    totalWeight += weight;
    
    const referenceSimilarity = calculateStringSimilarity(
      bankTx.reference.toLowerCase(),
      bookTx.reference.toLowerCase()
    );
    
    totalScore += weight * referenceSimilarity;
  }
  
  // Normalize score
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Calculate string similarity (simple implementation)
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  // Simple implementation for now
  // In production, you would use a more sophisticated algorithm like Levenshtein distance
  if (str1 === str2) return 1;
  if (str1.includes(str2) || str2.includes(str1)) return 0.8;
  
  // Count matching words
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchCount = 0;
  for (const word1 of words1) {
    if (word1.length > 3 && words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matchCount++;
    }
  }
  
  return Math.min(1, matchCount / Math.max(words1.length, 1));
}

/**
 * Calculate reconciliation summary
 * @param account Account information
 * @param matched Matched transactions
 * @param unmatchedBank Unmatched bank transactions
 * @param unmatchedBook Unmatched book transactions
 * @returns Reconciliation summary
 */
function calculateReconciliationSummary(
  account: any,
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