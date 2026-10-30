/**
 * Types & Interfaces for Thailand Lottery Result
 */

export type SupportedCountryCode = 'TH' | 'IN' | 'SA' | 'KW' | 'OM' | 'BH' | 'AE';

export type CurrencyCode = 'THB' | 'INR' | 'SAR' | 'KWD' | 'OMR' | 'BHD' | 'AED';

export interface CountryConfig {
  code: SupportedCountryCode;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  phonePrefix: string;
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumberOrIban: string;
  ifscOrSwift: string;
}

export type DocumentStatus = 'NOT_UPDATED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface DocumentMeta {
  fileName: string;
  uploadedAt: string;
  status: DocumentStatus;
  notes?: string;
  fileDataUrl?: string;
}

export interface KYCDocuments {
  identityProof?: DocumentMeta;
  bankPassbook?: DocumentMeta;
  addressProof?: DocumentMeta;
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  password?: string;
  country: SupportedCountryCode;
  currency: CurrencyCode;
  bankDetails: BankDetails;
  kycDocuments: KYCDocuments;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'ADMIN';
}

export interface Wallet {
  userId: string;
  balance: number;
  lockedBalance: number;
  currency: CurrencyCode;
}

export type TransactionType = 'CREDIT' | 'DEBIT';

export type TransactionCategory =
  | 'WINNING_CREDIT'
  | 'ADMIN_ADJUSTMENT'
  | 'WITHDRAWAL_REFUND'
  | 'LOTTERY_ENTRY'
  | 'WITHDRAWAL_REQUEST'
  | 'USER_DEPOSIT';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: CurrencyCode;
  description: string;
  timestamp: string;
  balanceAfter: number;
  referenceId?: string;
  adminId?: string;
  adminReason?: string;
}

export type TicketStatus = 'PENDING' | 'WINNER' | 'NOT_MATCHED';

export interface LotteryEntry {
  id: string;
  ticketNumber: string; // e.g., "TL-829145"
  entryId: string;
  userId: string;
  userName: string;
  userMobile: string;
  country: SupportedCountryCode;
  currency: CurrencyCode;
  selectedNumber: string; // "000" to "999"
  stakeAmount: number;
  potentialWinning: number;
  multiplier: number;
  drawId: string;
  drawDate: string;
  createdAt: string;
  status: TicketStatus;
  winningAmount?: number;
  settledAt?: string;
}

export interface DrawResult {
  id: string;
  drawNumber: string; // e.g., "Draw #TL-104"
  drawDate: string;
  winningNumber: string; // "777"
  totalEntries: number;
  totalWinners: number;
  totalPayout: number;
  status: 'DECLARED';
  declaredAt: string;
  declaredByAdminId?: string;
}

export type WithdrawalStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  country: SupportedCountryCode;
  currency: CurrencyCode;
  amount: number;
  bankDetails: BankDetails;
  requestDate: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  processedAt?: string;
  processedByAdminId?: string;
}

export type NotificationType =
  | 'ENTRY'
  | 'RESULT'
  | 'WINNER'
  | 'WITHDRAWAL'
  | 'WALLET';

export interface AppNotification {
  id: string;
  userId: string; // or 'ALL'
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  metadata?: {
    ticketId?: string;
    amount?: number;
    currency?: CurrencyCode;
    winningNumber?: string;
  };
}

export interface AppSettings {
  lotteryName: string;
  winningMultiplier: number;
  drawSchedule: string;
  activeDrawId: string;
  activeDrawDate: string;
  supportedCurrencies: CurrencyCode[];
  minStake: number;
  maxStake: number;
  version: string;
}

export type ActiveTab = 'HOME' | 'PLAY' | 'TICKETS' | 'RESULTS' | 'PROFILE';
export type UserSubView = 'DASHBOARD' | 'WALLET' | 'WITHDRAW' | 'BANK_KYC';
export type AdminTab = 'DASHBOARD' | 'DECLARE' | 'ENTRIES' | 'USERS' | 'WITHDRAWALS' | 'SETTINGS';
