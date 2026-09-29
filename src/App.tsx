/**
 * DHANALAXMI LOTTERY - Premium Mobile-First Web Application
 * Complete offline-first lottery system with 3-digit draw, wallet management,
 * results declaration, winner celebrations, and admin governance portal.
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
      <div className="min-h-screen bg-[#171114] text-[#FFF8E7] selection:bg-[#D4A017] selection:text-[#320912]">
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
    <div className="min-h-screen bg-[#171114] text-[#FFF8E7] flex flex-col items-center selection:bg-[#D4A017] selection:text-[#320912]">
      {/* Mobile-first centered frame container */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-[#1f0a0f] border-x border-[#7F1D2D]/30 shadow-2xl relative">
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
