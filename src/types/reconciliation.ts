/**
 * Types related to bank reconciliation
 */

/**
 * Reconciliation data
 */
export interface ReconciliationData {
  /** Account information */
  account: AccountInfo;
  /** Statement period */
  period: {
    startDate: Date;
    endDate: Date;
  };
  /** Bank transactions */
  bankTransactions: Transaction[];
  /** Book transactions */
  bookTransactions: Transaction[];
  /** Reconciliation settings */
  settings?: ReconciliationSettings;
  /** Match results (if already processed) */
  matchResults?: MatchResults;
}

/**
 * Account information
 */
export interface AccountInfo {
  /** Account name */
  name: string;
  /** Account number */
  number: string;
  /** Bank name */
  bank?: string;
  /** Currency code */
  currency: string;
  /** Opening balance */
  openingBalance: number;
  /** Closing balance */
  closingBalance: number;
}

/**
 * Transaction data
 */
export interface Transaction {
  /** Transaction ID */
  id: string;
  /** Transaction date */
  date: Date;
  /** Transaction description */
  description: string;
  /** Transaction amount */
  amount: number;
  /** Transaction type */
  type: 'debit' | 'credit';
  /** Transaction category */
  category?: string;
  /** Transaction reference */
  reference?: string;
  /** Matched status */
  matched?: boolean;
  /** Match ID (references the matched transaction) */
  matchId?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Reconciliation settings
 */
export interface ReconciliationSettings {
  /** Enable fuzzy matching */
  fuzzyMatching?: boolean;
  /** Fuzzy matching threshold (0-1) */
  fuzzyThreshold?: number;
  /** Match by amount */
  matchByAmount?: boolean;
  /** Match by description */
  matchByDescription?: boolean;
  /** Match by reference */
  matchByReference?: boolean;
  /** Match by date with tolerance */
  matchByDate?: boolean;
  /** Date tolerance in days */
  dateTolerance?: number;
  /** Auto-match exact matches */
  autoMatchExact?: boolean;
}

/**
 * Match results
 */
export interface MatchResults {
  /** Matched transactions */
  matched: MatchedTransaction[];
  /** Unmatched bank transactions */
  unmatchedBank: Transaction[];
  /** Unmatched book transactions */
  unmatchedBook: Transaction[];
  /** Reconciliation summary */
  summary: ReconciliationSummary;
}

/**
 * Matched transaction pair
 */
export interface MatchedTransaction {
  /** Bank transaction */
  bankTransaction: Transaction;
  /** Book transaction */
  bookTransaction: Transaction;
  /** Match confidence (0-1) */
  confidence: number;
  /** Match method used */
  matchMethod: 'exact' | 'fuzzy' | 'manual';
}

/**
 * Reconciliation summary
 */
export interface ReconciliationSummary {
  /** Total matched amount */
  matchedAmount: number;
  /** Total unmatched bank amount */
  unmatchedBankAmount: number;
  /** Total unmatched book amount */
  unmatchedBookAmount: number;
  /** Discrepancy amount */
  discrepancy: number;
  /** Reconciliation status */
  status: 'balanced' | 'unbalanced';
  /** Match percentage */
  matchPercentage: number;
} 