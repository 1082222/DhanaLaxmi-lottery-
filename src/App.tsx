/**
 * THAILAND LOTTERY RESULT - Official Mobile-First Web Application
 * Complete lottery system with 3-digit draw, multi-currency wallet management,
 * live results declaration, digital receipts, and governance portal.
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { NotificationModal } from './components/common/NotificationModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { WinnerCelebration } from './components/common/WinnerCelebration';
import { AddBalanceModal } from './components/common/AddBalanceModal';
import { AuthModal } from './components/auth/AuthModal';

import { UserDashboard } from './components/user/UserDashboard';
import { PlayLottery } from './components/user/PlayLottery';
import { MyTickets } from './components/user/MyTickets';
import { ResultsView } from './components/user/ResultsView';
import { ProfileView } from './components/user/ProfileView';
import { WalletView } from './components/user/WalletView';
import { WithdrawView } from './components/user/WithdrawView';
import { BankKycView } from './components/user/BankKycView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { isAdminMode, activeTab, userSubView } = useApp();

  // If in Admin Mode, show full-featured Admin Dashboard
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#050E1D] text-[#F0F7FF] selection:bg-[#2563EB] selection:text-white">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  // Render appropriate user screen or sub-view
  const renderCurrentView = () => {
    // Check specific sub-views first
    if (userSubView === 'WALLET') return <WalletView />;
    if (userSubView === 'WITHDRAW') return <WithdrawView />;
    if (userSubView === 'BANK_KYC') return <BankKycView />;

    // Main Tab Routing
    switch (activeTab) {
      case 'HOME':
        return <UserDashboard />;
      case 'PLAY':
        return <PlayLottery />;
      case 'TICKETS':
        return <MyTickets />;
      case 'RESULTS':
        return <ResultsView />;
      case 'PROFILE':
        return <ProfileView />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030A16] text-[#F0F7FF] flex flex-col items-center selection:bg-[#2563EB] selection:text-white">
      {/* Mobile-first centered frame container */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-[#07152B] border-x border-[#1E3A8A]/40 shadow-2xl relative">
        <Header />

        <main className="flex-1 px-4 pt-3 overflow-y-auto">
          {renderCurrentView()}
        </main>

        <BottomNav />
      </div>

      {/* Global Application Modals */}
      <AuthModal />
      <AddBalanceModal />
      <NotificationModal />
      <ReceiptModal />
      <WinnerCelebration />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
