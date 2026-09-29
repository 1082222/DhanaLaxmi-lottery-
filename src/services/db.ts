/**
 * Resilient Offline-First Local Data Architecture
 * Database Schema: "dhanalaxmi_lottery_v1"
 */

import {
  User,
  Admin,
  Wallet,
  Transaction,
  LotteryEntry,
  DrawResult,
  WithdrawalRequest,
  AppNotification,
  AppSettings,
  SupportedCountryCode,
  CurrencyCode,
  BankDetails,
  DocumentStatus,
} from '../types';
import { SUPPORTED_COUNTRIES } from '../constants/countries';

const DB_KEY = 'dhanalaxmi_lottery_v1';

interface DBSchema {
  version: string;
  users: User[];
  admins: Admin[];
  wallets: Record<string, Wallet>; // keyed by userId
  transactions: Transaction[];
  lotteryEntries: LotteryEntry[];
  drawResults: DrawResult[];
  withdrawals: WithdrawalRequest[];
  notifications: AppNotification[];
  settings: AppSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
  lotteryName: 'Dhanalaxmi Lottery',
  winningMultiplier: 500, // 1 currency stake gives 500 currency on winning
  drawSchedule: 'Daily Draw at 08:00 PM GST',
  activeDrawId: 'DL-DRAW-104',
  activeDrawDate: '2026-09-25 20:00 GST',
  supportedCurrencies: ['INR', 'SAR', 'KWD', 'OMR', 'BHD', 'AED'],
  minStake: 1,
  maxStake: 10000,
  version: '1.0.0',
};

// Official Initial Database
function createInitialDatabase(): DBSchema {
  const users: User[] = [];

  const admins: Admin[] = [
    {
      id: 'adm_master',
      username: '8519991082',
      password: 'Pranay@1234',
      name: 'Dhanalaxmi Administrator',
      role: 'ADMIN',
    },
  ];

  const wallets: Record<string, Wallet> = {};

  const drawResults: DrawResult[] = [
    {
      id: 'res_101',
      drawNumber: 'Draw #DL-101',
      drawDate: '2026-09-04 20:00 GST',
      winningNumber: '389',
      totalEntries: 420,
      totalWinners: 3,
      totalPayout: 24000,
      status: 'DECLARED',
      declaredAt: '2026-09-04 20:05 GST',
    },
    {
      id: 'res_102',
      drawNumber: 'Draw #DL-102',
      drawDate: '2026-09-11 20:00 GST',
      winningNumber: '777',
      totalEntries: 580,
      totalWinners: 5,
      totalPayout: 40000,
      status: 'DECLARED',
      declaredAt: '2026-09-11 20:05 GST',
    },
    {
      id: 'res_103',
      drawNumber: 'Draw #DL-103',
      drawDate: '2026-09-18 20:00 GST',
      winningNumber: '512',
      totalEntries: 640,
      totalWinners: 4,
      totalPayout: 32000,
      status: 'DECLARED',
      declaredAt: '2026-09-18 20:05 GST',
    },
  ];

  const lotteryEntries: LotteryEntry[] = [];
  const transactions: Transaction[] = [];
  const withdrawals: WithdrawalRequest[] = [];
  const notifications: AppNotification[] = [];

  return {
    version: '1.0.0',
    users,
    admins,
    wallets,
    transactions,
    lotteryEntries,
    drawResults,
    withdrawals,
    notifications,
    settings: DEFAULT_SETTINGS,
  };
}

class LocalStorageDB {
  private getDB(): DBSchema {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) {
        const initial = createInitialDatabase();
        this.saveDB(initial);
        return initial;
      }
      const parsed = JSON.parse(raw) as DBSchema;

      let changed = false;

      // Purge legacy demo users and tickets from localStorage
      const demoUserIds = ['usr_tariq_kw', 'usr_fahad_sa', 'usr_priya_ae'];
      if (parsed.users && parsed.users.some((u) => demoUserIds.includes(u.id))) {
        parsed.users = parsed.users.filter((u) => !demoUserIds.includes(u.id));
        if (parsed.wallets) {
          demoUserIds.forEach((id) => delete parsed.wallets[id]);
        }
        parsed.lotteryEntries = (parsed.lotteryEntries || []).filter((e) => !demoUserIds.includes(e.userId));
        parsed.transactions = (parsed.transactions || []).filter((t) => !demoUserIds.includes(t.userId));
        parsed.withdrawals = (parsed.withdrawals || []).filter((w) => !demoUserIds.includes(w.userId));
        parsed.notifications = (parsed.notifications || []).filter((n) => !demoUserIds.includes(n.userId));
        changed = true;
      }

      // Auto-update winning multiplier to 500 as requested
      if (!parsed.settings || parsed.settings.winningMultiplier !== 500) {
        parsed.settings = { ...(parsed.settings || DEFAULT_SETTINGS), winningMultiplier: 500 };
        changed = true;
      }

      // Ensure admin with 8519991082 exists with password Pranay@1234
      if (!parsed.admins) parsed.admins = [];
      const adminIdx = parsed.admins.findIndex((a) => a.username === '8519991082');
      if (adminIdx === -1) {
        parsed.admins.unshift({
          id: 'adm_master',
          username: '8519991082',
          password: 'Pranay@1234',
          name: 'Dhanalaxmi Administrator',
          role: 'ADMIN',
        });
        changed = true;
      } else if (parsed.admins[adminIdx].password !== 'Pranay@1234') {
        parsed.admins[adminIdx].password = 'Pranay@1234';
        changed = true;
      }

      if (changed) {
        this.saveDB(parsed);
      }

      return parsed;
    } catch (e) {
      console.error('Error reading localStorage DB, resetting to safe defaults', e);
      const initial = createInitialDatabase();
      this.saveDB(initial);
      return initial;
    }
  }

  private saveDB(db: DBSchema): void {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Error saving to localStorage DB', e);
    }
  }

  // --- Auth Methods ---
  public registerUser(params: {
    fullName: string;
    mobile: string;
    password?: string;
    country: SupportedCountryCode;
    currency: CurrencyCode;
    bankDetails: BankDetails;
  }): { success: boolean; user?: User; error?: string } {
    const db = this.getDB();
    const cleanMobile = params.mobile.trim();

    // Check duplicate mobile
    const existing = db.users.find((u) => u.mobile.replace(/\s+/g, '') === cleanMobile.replace(/\s+/g, ''));
    if (existing) {
      return { success: false, error: 'An account with this mobile number already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fullName: params.fullName.trim(),
      mobile: cleanMobile,
      password: params.password || 'password123',
      country: params.country,
      currency: params.currency,
      bankDetails: params.bankDetails,
      kycDocuments: {},
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    // Initialize wallet with 0 balance (Starting after creating the account the wallet should be zero)
    const initialWallet: Wallet = {
      userId: newUser.id,
      balance: 0,
      lockedBalance: 0,
      currency: params.currency,
    };

    const welcomeNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to Dhanalaxmi Lottery',
      message: `Account created successfully! Your starting balance is 0.00 ${params.currency}. Add funds to start playing and win 500x!`,
      type: 'WALLET',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    db.users.push(newUser);
    db.wallets[newUser.id] = initialWallet;
    db.notifications.unshift(welcomeNotif);

    this.saveDB(db);
    return { success: true, user: newUser };
  }

  public loginUser(mobile: string, password?: string): { success: boolean; user?: User; error?: string } {
    const db = this.getDB();
    const cleanMobile = mobile.trim().replace(/\s+/g, '').replace(/^\+91/, '');

    const user = db.users.find((u) => {
      const uMobile = u.mobile.replace(/\s+/g, '').replace(/^\+91/, '');
      return uMobile === cleanMobile || uMobile.endsWith(cleanMobile) || cleanMobile.endsWith(uMobile);
    });

    if (!user) {
      return { success: false, error: 'Mobile number not found. Please check or register.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    return { success: true, user };
  }

  public loginAdmin(identifier: string, password?: string): { success: boolean; admin?: Admin; error?: string } {
    const db = this.getDB();
    const clean = identifier.trim().replace(/\s+/g, '').replace(/^\+91/, '');

    const admin = db.admins.find((a) => {
      const aUser = a.username.toLowerCase().replace(/\s+/g, '').replace(/^\+91/, '');
      return (
        aUser === clean.toLowerCase() ||
        (clean === '8519991082' && (a.username === '8519991082' || a.username === 'admin'))
      );
    });

    if (!admin) {
      // Fallback check if user entered 8519991082 and Pranay@1234
      if (clean === '8519991082' && password === 'Pranay@1234') {
        const seededAdmin: Admin = {
          id: 'adm_master',
          username: '8519991082',
          password: 'Pranay@1234',
          name: 'Dhanalaxmi Administrator',
          role: 'ADMIN',
        };
        db.admins.unshift(seededAdmin);
        this.saveDB(db);
        return { success: true, admin: seededAdmin };
      }
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    if (password && admin.password && admin.password !== password) {
      return { success: false, error: 'Incorrect administrator password.' };
    }

    return { success: true, admin };
  }

  // --- Wallet & Balance ---
  public getWallet(userId: string): Wallet {
    const db = this.getDB();
    if (!db.wallets[userId]) {
      const user = db.users.find((u) => u.id === userId);
      const currency = user ? user.currency : 'INR';
      db.wallets[userId] = {
        userId,
        balance: 0,
        lockedBalance: 0,
        currency,
      };
      this.saveDB(db);
    }
    return db.wallets[userId];
  }

  public addBalance(userId: string, amount: number, note = 'Online Card Top-up'): { success: boolean; wallet?: Wallet; error?: string } {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than zero.' };
    }
    const db = this.getDB();
    const wallet = db.wallets[userId] || this.getWallet(userId);
    wallet.balance = Number((wallet.balance + amount).toFixed(3));

    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      type: 'CREDIT',
      category: 'USER_DEPOSIT',
      amount,
      currency: wallet.currency,
      description: note,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      balanceAfter: wallet.balance,
    };

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId,
      title: 'Wallet Updated',
      message: `Deposit of ${amount} ${wallet.currency} completed successfully. New balance: ${wallet.balance} ${wallet.currency}`,
      type: 'WALLET',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    db.wallets[userId] = wallet;
    db.transactions.unshift(tx);
    db.notifications.unshift(notif);
    this.saveDB(db);

    return { success: true, wallet };
  }

  // Admin Balance Adjustment
  public adjustUserBalance(params: {
    userId: string;
    amount: number;
    type: 'ADD' | 'DEDUCT';
    reason: string;
    adminId: string;
  }): { success: boolean; wallet?: Wallet; error?: string } {
    const db = this.getDB();
    const wallet = db.wallets[params.userId];
    if (!wallet) return { success: false, error: 'User wallet not found.' };

    const amt = Math.abs(params.amount);
    if (amt <= 0) return { success: false, error: 'Adjustment amount must be positive.' };

    if (params.type === 'DEDUCT' && wallet.balance < amt) {
      return { success: false, error: `Insufficient wallet balance (${wallet.balance} ${wallet.currency}). Cannot deduct ${amt}.` };
    }

    const prevBalance = wallet.balance;
    if (params.type === 'ADD') {
      wallet.balance = Number((wallet.balance + amt).toFixed(3));
    } else {
      wallet.balance = Number((wallet.balance - amt).toFixed(3));
    }

    const tx: Transaction = {
      id: `tx_adj_${Date.now()}`,
      userId: params.userId,
      type: params.type === 'ADD' ? 'CREDIT' : 'DEBIT',
      category: 'ADMIN_ADJUSTMENT',
      amount: amt,
      currency: wallet.currency,
      description: `Admin ${params.type === 'ADD' ? 'Credit' : 'Debit'}: ${params.reason}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      balanceAfter: wallet.balance,
      adminId: params.adminId,
      adminReason: params.reason,
    };

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: params.userId,
      title: 'Wallet Adjustment Notice',
      message: `Administration ${params.type === 'ADD' ? 'credited' : 'deducted'} ${amt} ${wallet.currency}. Reason: ${params.reason}`,
      type: 'WALLET',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    db.wallets[params.userId] = wallet;
    db.transactions.unshift(tx);
    db.notifications.unshift(notif);
    this.saveDB(db);

    return { success: true, wallet };
  }

  // --- Lottery Game & Ticket Entry ---
  public placeLotteryEntry(params: {
    userId: string;
    selectedNumber: string; // 3 digits
    stakeAmount: number;
  }): { success: boolean; entry?: LotteryEntry; error?: string } {
    // 1. Validate number: exactly 3 digits
    const cleanedNumber = params.selectedNumber.trim();
    if (!/^\d{3}$/.test(cleanedNumber)) {
      return { success: false, error: 'Lottery number must be exactly 3 digits (000 to 999).' };
    }

    // 2. Validate stake
    if (params.stakeAmount <= 0) {
      return { success: false, error: 'Stake amount must be greater than zero.' };
    }

    const db = this.getDB();
    const user = db.users.find((u) => u.id === params.userId);
    if (!user) {
      return { success: false, error: 'User not found. Please log in.' };
    }

    const wallet = db.wallets[params.userId] || this.getWallet(params.userId);
    if (wallet.balance < params.stakeAmount) {
      return {
        success: false,
        error: `Insufficient balance! You have ${wallet.balance} ${wallet.currency}, but stake is ${params.stakeAmount} ${wallet.currency}. Please add balance first.`,
      };
    }

    // 3. Deduct stake from wallet
    wallet.balance = Number((wallet.balance - params.stakeAmount).toFixed(3));

    // 4. Generate unique Ticket ID & Entry ID
    const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
    const ticketNumber = `DL-${randomTicketNumber}`;
    const entryId = `EN-${Math.floor(1000 + Math.random() * 9000)}`;

    const multiplier = db.settings.winningMultiplier || 500;
    const potentialWinning = Number((params.stakeAmount * multiplier).toFixed(2));
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newEntry: LotteryEntry = {
      id: `ticket_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ticketNumber,
      entryId,
      userId: user.id,
      userName: user.fullName,
      userMobile: user.mobile,
      country: user.country,
      currency: user.currency,
      selectedNumber: cleanedNumber,
      stakeAmount: params.stakeAmount,
      potentialWinning,
      multiplier,
      drawId: db.settings.activeDrawId,
      drawDate: db.settings.activeDrawDate,
      createdAt: nowTimestamp,
      status: 'PENDING',
    };

    // 5. Create ledger transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      type: 'DEBIT',
      category: 'LOTTERY_ENTRY',
      amount: params.stakeAmount,
      currency: user.currency,
      description: `Lottery Entry Stake - Ticket #${ticketNumber} (No. ${cleanedNumber})`,
      timestamp: nowTimestamp,
      balanceAfter: wallet.balance,
      referenceId: ticketNumber,
    };

    // 6. Create notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: 'Lottery Entry Confirmed',
      message: `Your entry with Lucky Number ${cleanedNumber} for ${db.settings.activeDrawId} is confirmed (Ticket #${ticketNumber}). Potential Winning: ${potentialWinning} ${user.currency}.`,
      type: 'ENTRY',
      timestamp: nowTimestamp,
      read: false,
      metadata: {
        ticketId: ticketNumber,
      },
    };

    db.lotteryEntries.unshift(newEntry);
    db.transactions.unshift(tx);
    db.notifications.unshift(notif);
    db.wallets[params.userId] = wallet;

    this.saveDB(db);

    return { success: true, entry: newEntry };
  }

  // --- Admin Result Declaration & Atomic Settlement ---
  public previewWinningDeclaration(winningNumber: string): {
    success: boolean;
    winningNumber: string;
    matchingTickets: LotteryEntry[];
    totalWinners: number;
    totalPayoutLiability: number;
    totalPendingEntries: number;
    error?: string;
  } {
    const cleaned = winningNumber.trim();
    if (!/^\d{3}$/.test(cleaned)) {
      return {
        success: false,
        winningNumber: cleaned,
        matchingTickets: [],
        totalWinners: 0,
        totalPayoutLiability: 0,
        totalPendingEntries: 0,
        error: 'Winning number must be exactly 3 digits (000-999).',
      };
    }

    const db = this.getDB();
    const pendingTickets = db.lotteryEntries.filter(
      (e) => e.status === 'PENDING' && e.drawId === db.settings.activeDrawId
    );

    const matching = pendingTickets.filter((e) => e.selectedNumber === cleaned);
    const totalPayoutLiability = matching.reduce((sum, item) => sum + item.potentialWinning, 0);

    return {
      success: true,
      winningNumber: cleaned,
      matchingTickets: matching,
      totalWinners: matching.length,
      totalPayoutLiability,
      totalPendingEntries: pendingTickets.length,
    };
  }

  public declareWinningNumber(params: {
    winningNumber: string;
    adminId: string;
    drawDate?: string;
  }): {
    success: boolean;
    result?: DrawResult;
    winnersCount?: number;
    totalPayout?: number;
    error?: string;
  } {
    const cleaned = params.winningNumber.trim();
    if (!/^\d{3}$/.test(cleaned)) {
      return { success: false, error: 'Winning number must be exactly 3 digits (000-999).' };
    }

    const db = this.getDB();
    const currentDrawId = db.settings.activeDrawId;

    // Check if this draw has already been declared to prevent duplicate settlement
    const alreadyDeclared = db.drawResults.find((r) => r.id === currentDrawId);
    if (alreadyDeclared) {
      return {
        success: false,
        error: `Draw ${currentDrawId} has already been declared with winning number ${alreadyDeclared.winningNumber}.`,
      };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const drawDateStr = params.drawDate || db.settings.activeDrawDate;

    // Process all pending entries for this draw
    const pendingTickets = db.lotteryEntries.filter(
      (e) => e.status === 'PENDING' && e.drawId === currentDrawId
    );

    let winnersCount = 0;
    let totalPayout = 0;

    pendingTickets.forEach((entry) => {
      if (entry.selectedNumber === cleaned) {
        // WINNER!
        entry.status = 'WINNER';
        entry.winningAmount = entry.potentialWinning;
        entry.settledAt = now;
        winnersCount++;
        totalPayout += entry.potentialWinning;

        // Credit wallet
        const userWallet = db.wallets[entry.userId];
        if (userWallet) {
          userWallet.balance = Number((userWallet.balance + entry.potentialWinning).toFixed(3));

          // Transaction
          const tx: Transaction = {
            id: `tx_win_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            userId: entry.userId,
            type: 'CREDIT',
            category: 'WINNING_CREDIT',
            amount: entry.potentialWinning,
            currency: entry.currency,
            description: `Winner Payout - ${currentDrawId} (Ticket #${entry.ticketNumber})`,
            timestamp: now,
            balanceAfter: userWallet.balance,
            referenceId: entry.ticketNumber,
          };
          db.transactions.unshift(tx);
        }

        // Winner Notification
        const notif: AppNotification = {
          id: `notif_win_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId: entry.userId,
          title: '🎉 Congratulations — Winning Ticket!',
          message: `Your ticket #${entry.ticketNumber} matched Winning Number ${cleaned}! Winnings of ${entry.potentialWinning} ${entry.currency} have been credited to your wallet.`,
          type: 'WINNER',
          timestamp: now,
          read: false,
          metadata: {
            ticketId: entry.ticketNumber,
            amount: entry.potentialWinning,
            currency: entry.currency,
            winningNumber: cleaned,
          },
        };
        db.notifications.unshift(notif);
      } else {
        // NOT MATCHED
        entry.status = 'NOT_MATCHED';
        entry.settledAt = now;
      }
    });

    // Save Draw Result
    const newDrawResult: DrawResult = {
      id: currentDrawId,
      drawNumber: currentDrawId.replace('DL-DRAW-', 'Draw #DL-'),
      drawDate: drawDateStr,
      winningNumber: cleaned,
      totalEntries: pendingTickets.length,
      totalWinners: winnersCount,
      totalPayout,
      status: 'DECLARED',
      declaredAt: now,
      declaredByAdminId: params.adminId,
    };

    db.drawResults.unshift(newDrawResult);

    // Roll active draw to next sequence
    const currentNumMatch = currentDrawId.match(/\d+$/);
    const nextNum = currentNumMatch ? parseInt(currentNumMatch[0], 10) + 1 : 105;
    db.settings.activeDrawId = `DL-DRAW-${nextNum}`;
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + 7);
    db.settings.activeDrawDate = `${nextFriday.toISOString().split('T')[0]} 20:00 GST`;

    // Global Notification for all users
    const globalResultNotif: AppNotification = {
      id: `notif_draw_${Date.now()}`,
      userId: 'ALL',
      title: 'New Result Declared',
      message: `Draw ${newDrawResult.drawNumber} declared! Winning Number: ${cleaned}. Total Winners: ${winnersCount}.`,
      type: 'RESULT',
      timestamp: now,
      read: false,
      metadata: {
        winningNumber: cleaned,
      },
    };
    db.notifications.unshift(globalResultNotif);

    this.saveDB(db);

    return {
      success: true,
      result: newDrawResult,
      winnersCount,
      totalPayout,
    };
  }

  // --- Withdrawals & Status ---
  public requestWithdrawal(params: {
    userId: string;
    amount: number;
    bankDetails: BankDetails;
  }): { success: boolean; request?: WithdrawalRequest; error?: string } {
    if (params.amount <= 0) {
      return { success: false, error: 'Withdrawal amount must be greater than zero.' };
    }

    const db = this.getDB();
    const user = db.users.find((u) => u.id === params.userId);
    if (!user) return { success: false, error: 'User not found.' };

    const wallet = db.wallets[params.userId] || this.getWallet(params.userId);
    if (wallet.balance < params.amount) {
      return {
        success: false,
        error: `Insufficient available balance! Your current balance is ${wallet.balance} ${wallet.currency}.`,
      };
    }

    // Reserve / Lock the requested amount
    wallet.balance = Number((wallet.balance - params.amount).toFixed(3));
    wallet.lockedBalance = Number(((wallet.lockedBalance || 0) + params.amount).toFixed(3));

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRequest: WithdrawalRequest = {
      id: `wd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.fullName,
      userMobile: user.mobile,
      country: user.country,
      currency: user.currency,
      amount: params.amount,
      bankDetails: params.bankDetails,
      requestDate: now,
      status: 'PENDING',
    };

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'DEBIT',
      category: 'WITHDRAWAL_REQUEST',
      amount: params.amount,
      currency: user.currency,
      description: `Withdrawal Request to ${params.bankDetails.bankName}`,
      timestamp: now,
      balanceAfter: wallet.balance,
      referenceId: newRequest.id,
    };

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: 'Withdrawal Submitted',
      message: `Your withdrawal request for ${params.amount} ${user.currency} has been received and is currently PENDING review.`,
      type: 'WITHDRAWAL',
      timestamp: now,
      read: false,
    };

    db.withdrawals.unshift(newRequest);
    db.wallets[params.userId] = wallet;
    db.transactions.unshift(tx);
    db.notifications.unshift(notif);

    this.saveDB(db);

    return { success: true, request: newRequest };
  }

  public updateWithdrawalStatus(params: {
    withdrawalId: string;
    status: 'COMPLETED' | 'REJECTED';
    rejectionReason?: string;
    adminId: string;
  }): { success: boolean; request?: WithdrawalRequest; error?: string } {
    const db = this.getDB();
    const req = db.withdrawals.find((w) => w.id === params.withdrawalId);
    if (!req) return { success: false, error: 'Withdrawal request not found.' };

    if (req.status !== 'PENDING') {
      return { success: false, error: `Request already settled with status: ${req.status}` };
    }

    const wallet = db.wallets[req.userId];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    req.status = params.status;
    req.processedAt = now;
    req.processedByAdminId = params.adminId;

    if (params.status === 'COMPLETED') {
      // Amount was already deducted from balance at request time; just release lockedBalance
      if (wallet) {
        wallet.lockedBalance = Math.max(0, Number(((wallet.lockedBalance || 0) - req.amount).toFixed(3)));
      }

      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: req.userId,
        title: 'Withdrawal Completed',
        message: `Your withdrawal of ${req.amount} ${req.currency} has been approved and transferred to your bank account.`,
        type: 'WITHDRAWAL',
        timestamp: now,
        read: false,
      };
      db.notifications.unshift(notif);
    } else if (params.status === 'REJECTED') {
      req.rejectionReason = params.rejectionReason || 'Details could not be verified by compliance.';

      // Automatic wallet refund
      if (wallet) {
        wallet.balance = Number((wallet.balance + req.amount).toFixed(3));
        wallet.lockedBalance = Math.max(0, Number(((wallet.lockedBalance || 0) - req.amount).toFixed(3)));

        const refundTx: Transaction = {
          id: `tx_ref_${Date.now()}`,
          userId: req.userId,
          type: 'CREDIT',
          category: 'WITHDRAWAL_REFUND',
          amount: req.amount,
          currency: req.currency,
          description: `Withdrawal Refund: ${req.rejectionReason}`,
          timestamp: now,
          balanceAfter: wallet.balance,
          referenceId: req.id,
          adminId: params.adminId,
          adminReason: req.rejectionReason,
        };
        db.transactions.unshift(refundTx);
      }

      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: req.userId,
        title: 'Withdrawal Rejected (Refunded)',
        message: `Your withdrawal of ${req.amount} ${req.currency} was rejected. Reason: ${req.rejectionReason}. The amount has been refunded to your available balance.`,
        type: 'WITHDRAWAL',
        timestamp: now,
        read: false,
      };
      db.notifications.unshift(notif);
    }

    this.saveDB(db);
    return { success: true, request: req };
  }

  // --- Bank Account & KYC Updates ---
  public updateBankAccount(userId: string, _bankDetails: BankDetails): { success: boolean; user?: User; error?: string } {
    return { success: false, error: 'Bank details cannot be modified after account creation for anti-fraud security.' };
  }

  public uploadKYCMetadata(params: {
    userId: string;
    docType: 'identityProof' | 'bankPassbook' | 'addressProof';
    fileName: string;
    fileDataUrl?: string;
  }): { success: boolean; user?: User; error?: string } {
    const db = this.getDB();
    const user = db.users.find((u) => u.id === params.userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (!user.kycDocuments) {
      user.kycDocuments = {};
    }

    user.kycDocuments[params.docType] = {
      fileName: params.fileName,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_REVIEW',
      fileDataUrl: params.fileDataUrl,
    };

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: 'KYC Document Uploaded',
      message: `Your document (${params.fileName}) has been submitted and is pending verification.`,
      type: 'WALLET',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };
    db.notifications.unshift(notif);

    this.saveDB(db);
    return { success: true, user };
  }

  public updateKYCStatus(params: {
    userId: string;
    docType: 'identityProof' | 'bankPassbook' | 'addressProof';
    status: DocumentStatus;
    notes?: string;
  }): { success: boolean; user?: User; error?: string } {
    const db = this.getDB();
    const user = db.users.find((u) => u.id === params.userId);
    if (!user || !user.kycDocuments || !user.kycDocuments[params.docType]) {
      return { success: false, error: 'Document not found.' };
    }

    user.kycDocuments[params.docType]!.status = params.status;
    if (params.notes) {
      user.kycDocuments[params.docType]!.notes = params.notes;
    }

    this.saveDB(db);
    return { success: true, user };
  }

  // --- Settings & Admin Profile ---
  public updateSettings(newSettings: Partial<AppSettings>): { success: boolean; settings?: AppSettings } {
    const db = this.getDB();
    db.settings = { ...db.settings, ...newSettings };
    this.saveDB(db);
    return { success: true, settings: db.settings };
  }

  public updateAdminCredentials(params: {
    adminId: string;
    newPassword?: string;
    name?: string;
  }): { success: boolean; error?: string } {
    const db = this.getDB();
    const admin = db.admins.find((a) => a.id === params.adminId);
    if (!admin) return { success: false, error: 'Admin not found.' };

    if (params.newPassword) admin.password = params.newPassword;
    if (params.name) admin.name = params.name;

    this.saveDB(db);
    return { success: true };
  }

  // --- Queries ---
  public getAllUsers(): User[] {
    return this.getDB().users;
  }

  public getUser(userId: string): User | undefined {
    return this.getDB().users.find((u) => u.id === userId);
  }

  public getLotteryEntries(userId?: string): LotteryEntry[] {
    const entries = this.getDB().lotteryEntries;
    if (!userId) return entries;
    return entries.filter((e) => e.userId === userId);
  }

  public getDrawResults(): DrawResult[] {
    return this.getDB().drawResults;
  }

  public getTransactions(userId?: string): Transaction[] {
    const txs = this.getDB().transactions;
    if (!userId) return txs;
    return txs.filter((t) => t.userId === userId);
  }

  public getWithdrawals(userId?: string): WithdrawalRequest[] {
    const wds = this.getDB().withdrawals;
    if (!userId) return wds;
    return wds.filter((w) => w.userId === userId);
  }

  public getNotifications(userId?: string): AppNotification[] {
    const notifs = this.getDB().notifications;
    if (!userId) return notifs;
    return notifs.filter((n) => n.userId === userId || n.userId === 'ALL');
  }

  public markNotificationAsRead(notifId: string): void {
    const db = this.getDB();
    const target = db.notifications.find((n) => n.id === notifId);
    if (target) {
      target.read = true;
      this.saveDB(db);
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const db = this.getDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId || n.userId === 'ALL') {
        n.read = true;
      }
    });
    this.saveDB(db);
  }

  public getSettings(): AppSettings {
    return this.getDB().settings;
  }

  public getAdmins(): Admin[] {
    return this.getDB().admins;
  }

  public getSystemStats(): {
    totalUsers: number;
    totalTickets: number;
    pendingTickets: number;
    pendingWithdrawals: number;
    totalDraws: number;
  } {
    const db = this.getDB();
    return {
      totalUsers: db.users.length,
      totalTickets: db.lotteryEntries.length,
      pendingTickets: db.lotteryEntries.filter((e) => e.status === 'PENDING').length,
      pendingWithdrawals: db.withdrawals.filter((w) => w.status === 'PENDING').length,
      totalDraws: db.drawResults.length,
    };
  }

  public approveWithdrawal(withdrawalId: string, adminId: string = 'adm_master') {
    return this.updateWithdrawalStatus({
      withdrawalId,
      status: 'COMPLETED',
      adminId,
    });
  }

  public rejectWithdrawal(withdrawalId: string, rejectionReason: string, adminId: string = 'adm_master') {
    return this.updateWithdrawalStatus({
      withdrawalId,
      status: 'REJECTED',
      rejectionReason,
      adminId,
    });
  }

  public verifyKYCDocument(params: {
    userId: string;
    docType: 'identityProof' | 'bankPassbook' | 'addressProof';
    status: DocumentStatus;
    notes?: string;
  }) {
    return this.updateKYCStatus(params);
  }
}

export const dbService = new LocalStorageDB();
