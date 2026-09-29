import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Admin,
  Wallet,
  LotteryEntry,
  DrawResult,
  WithdrawalRequest,
  AppNotification,
  AppSettings,
  ActiveTab,
  UserSubView,
  AdminTab,
  BankDetails,
  SupportedCountryCode,
  CurrencyCode,
} from '../types';
import { dbService } from '../services/db';
import { SUPPORTED_COUNTRIES } from '../constants/countries';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  currentAdmin: Admin | null;
  wallet: Wallet | null;
  selectedCountry: SupportedCountryCode;
  setSelectedCountry: (country: SupportedCountryCode) => void;
  activeCurrency: CurrencyCode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userSubView: UserSubView;
  setUserSubView: (view: UserSubView) => void;
  isAdminMode: boolean;
  setIsAdminMode: (adminMode: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  appSettings: AppSettings;
  notifications: AppNotification[];
  unreadCount: number;
  activeReceipt: LotteryEntry | null;
  setActiveReceipt: (entry: LotteryEntry | null) => void;
  activeWinnerCelebration: LotteryEntry | null;
  setActiveWinnerCelebration: (entry: LotteryEntry | null) => void;
  isAddBalanceModalOpen: boolean;
  setIsAddBalanceModalOpen: (open: boolean) => void;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN';
  setAuthMode: (mode: 'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN') => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Actions
  login: (mobile: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: {
    fullName: string;
    mobile: string;
    password?: string;
    country: SupportedCountryCode;
    currency: CurrencyCode;
    bankDetails: BankDetails;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  adminLogin: (username: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  refreshAllData: () => void;
  addBalance: (amount: number, note?: string) => Promise<{ success: boolean; error?: string }>;
  placeEntry: (selectedNumber: string, stake: number) => Promise<{ success: boolean; entry?: LotteryEntry; error?: string }>;
  requestWithdraw: (amount: number, bankDetails: BankDetails) => Promise<{ success: boolean; error?: string }>;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  declareResult: (drawId: string, winningNumber: string) => Promise<{ success: boolean; winnersCount?: number; totalPayout?: number; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [selectedCountry, setSelectedCountryState] = useState<SupportedCountryCode>(() => {
    const saved = localStorage.getItem('dl_selected_country') as SupportedCountryCode;
    return saved && SUPPORTED_COUNTRIES[saved] ? saved : 'IN';
  });

  const setSelectedCountry = (code: SupportedCountryCode) => {
    setSelectedCountryState(code);
    localStorage.setItem('dl_selected_country', code);
  };

  const activeCurrency: CurrencyCode = currentUser
    ? currentUser.currency
    : (SUPPORTED_COUNTRIES[selectedCountry]?.currency || 'INR');

  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');
  const [userSubView, setUserSubView] = useState<UserSubView>('DASHBOARD');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('DASHBOARD');
  const [appSettings, setAppSettings] = useState<AppSettings>(dbService.getSettings());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<LotteryEntry | null>(null);
  const [activeWinnerCelebration, setActiveWinnerCelebration] = useState<LotteryEntry | null>(null);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN'>('LOGIN');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshAllData = useCallback(() => {
    setAppSettings(dbService.getSettings());
    if (currentUser) {
      const refreshedUser = dbService.getUser(currentUser.id);
      if (refreshedUser) setCurrentUser(refreshedUser);
      const w = dbService.getWallet(currentUser.id);
      setWallet(w);
      const notifs = dbService.getNotifications(currentUser.id);
      setNotifications(notifs);

      // Check if user has any winning ticket that hasn't been celebrated yet
      // We can check recent notifs or winners
    } else {
      setWallet(null);
      setNotifications([]);
    }
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    // Restore user session if previously logged in
    const savedUserId = localStorage.getItem('dhanalaxmi_active_user_id');
    if (savedUserId) {
      const user = dbService.getUser(savedUserId);
      if (user) {
        setCurrentUser(user);
        setSelectedCountryState(user.country);
        setWallet(dbService.getWallet(user.id));
        setNotifications(dbService.getNotifications(user.id));
      } else {
        localStorage.removeItem('dhanalaxmi_active_user_id');
      }
    }

    // Restore admin session if previously logged in
    const savedAdminId = localStorage.getItem('dhanalaxmi_active_admin_id');
    if (savedAdminId) {
      const admin = dbService.getAdmins().find((a) => a.id === savedAdminId);
      if (admin) {
        setCurrentAdmin(admin);
      } else {
        localStorage.removeItem('dhanalaxmi_active_admin_id');
      }
    }

    setAppSettings(dbService.getSettings());
  }, []);

  // Sync wallet when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setWallet(dbService.getWallet(currentUser.id));
      setNotifications(dbService.getNotifications(currentUser.id));
    }
  }, [currentUser]);

  const login = async (mobileOrUsername: string, password?: string) => {
    // 1. Check if Admin credentials (8519991082 / Pranay@1234)
    const adminRes = dbService.loginAdmin(mobileOrUsername, password);
    if (adminRes.success && adminRes.admin) {
      setCurrentAdmin(adminRes.admin);
      localStorage.setItem('dhanalaxmi_active_admin_id', adminRes.admin.id);
      setIsAdminMode(true);
      setIsAuthModalOpen(false);
      showToast('Admin Logged In! Welcome to Dhanalaxmi Admin Portal.', 'success');
      return { success: true };
    }

    // 2. Regular User login
    const res = dbService.loginUser(mobileOrUsername, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('dhanalaxmi_active_user_id', res.user.id);
      setSelectedCountry(res.user.country);
      setIsAuthModalOpen(false);
      setIsAdminMode(false);
      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      return { success: true };
    } else {
      showToast(res.error || 'Login failed. Please check mobile number and password.', 'error');
      return { success: false, error: res.error };
    }
  };

  const register = async (params: {
    fullName: string;
    mobile: string;
    password?: string;
    country: SupportedCountryCode;
    currency: CurrencyCode;
    bankDetails: BankDetails;
  }) => {
    const res = dbService.registerUser(params);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('dhanalaxmi_active_user_id', res.user.id);
      setSelectedCountry(res.user.country);
      setIsAuthModalOpen(false);
      setIsAdminMode(false);
      setActiveTab('HOME');
      setUserSubView('DASHBOARD');
      showToast('Account Created! Your initial wallet balance is 0.00 ' + res.user.currency, 'success');
      return { success: true };
    } else {
      showToast(res.error || 'Registration failed', 'error');
      return { success: false, error: res.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('dhanalaxmi_active_user_id');
    setCurrentUser(null);
    setWallet(null);
    setNotifications([]);
    setIsAuthModalOpen(false);
    showToast('You have been logged out.', 'info');
  };

  const adminLogin = async (username: string, password?: string) => {
    const res = dbService.loginAdmin(username, password);
    if (res.success && res.admin) {
      setCurrentAdmin(res.admin);
      localStorage.setItem('dhanalaxmi_active_admin_id', res.admin.id);
      setIsAdminMode(true);
      setIsAuthModalOpen(false);
      showToast('Admin logged in successfully.', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'Admin login failed', 'error');
      return { success: false, error: res.error };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('dhanalaxmi_active_admin_id');
    setCurrentAdmin(null);
    setIsAdminMode(false);
    showToast('Exited Admin Control Center.', 'info');
  };

  const addBalance = async (amount: number, note?: string) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const res = dbService.addBalance(currentUser.id, amount, note);
    if (res.success && res.wallet) {
      setWallet({ ...res.wallet });
      refreshAllData();
      showToast(`Added ${amount} ${res.wallet.currency} to your wallet!`, 'success');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const placeEntry = async (selectedNumber: string, stake: number) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setAuthMode('LOGIN');
      return { success: false, error: 'Please log in to place an entry.' };
    }

    const res = dbService.placeLotteryEntry({
      userId: currentUser.id,
      selectedNumber,
      stakeAmount: stake,
    });

    if (res.success && res.entry) {
      refreshAllData();
      setActiveReceipt(res.entry);
      showToast('Lottery Entry Successful! Good luck!', 'success');
      return { success: true, entry: res.entry };
    } else {
      showToast(res.error || 'Failed to place entry', 'error');
      return { success: false, error: res.error };
    }
  };

  const requestWithdraw = async (amount: number, bankDetails: BankDetails) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const res = dbService.requestWithdrawal({
      userId: currentUser.id,
      amount,
      bankDetails,
    });

    if (res.success) {
      refreshAllData();
      showToast('Withdrawal request submitted! Status: PENDING', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'Withdrawal failed', 'error');
      return { success: false, error: res.error };
    }
  };

  const markNotifAsRead = (id: string) => {
    dbService.markNotificationAsRead(id);
    if (currentUser) {
      setNotifications(dbService.getNotifications(currentUser.id));
    }
  };

  const markAllNotifsAsRead = () => {
    if (currentUser) {
      dbService.markAllNotificationsAsRead(currentUser.id);
      setNotifications(dbService.getNotifications(currentUser.id));
      showToast('All notifications marked as read.', 'info');
    }
  };

  const declareResult = async (drawId: string, winningNumber: string) => {
    const adminId = currentAdmin ? currentAdmin.id : 'adm_master';
    const res = dbService.declareWinningNumber({
      winningNumber,
      adminId,
    });

    if (res.success) {
      refreshAllData();
      showToast(`Result declared: ${winningNumber} (${res.winnersCount} winners).`, 'success');
      return {
        success: true,
        winnersCount: res.winnersCount,
        totalPayout: res.totalPayout,
      };
    } else {
      showToast(res.error || 'Failed to declare winning number.', 'error');
      return {
        success: false,
        error: res.error,
      };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentAdmin,
        wallet,
        selectedCountry,
        setSelectedCountry,
        activeCurrency,
        activeTab,
        setActiveTab,
        userSubView,
        setUserSubView,
        isAdminMode,
        setIsAdminMode,
        adminTab,
        setAdminTab,
        appSettings,
        notifications,
        unreadCount,
        activeReceipt,
        setActiveReceipt,
        activeWinnerCelebration,
        setActiveWinnerCelebration,
        isAddBalanceModalOpen,
        setIsAddBalanceModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        toasts,
        showToast,
        dismissToast,
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
        refreshAllData,
        addBalance,
        placeEntry,
        requestWithdraw,
        markNotifAsRead,
        markAllNotifsAsRead,
        declareResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
