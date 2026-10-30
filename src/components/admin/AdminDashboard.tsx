import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  Users,
  Ticket,
  Trophy,
  ArrowDownCircle,
  Settings,
  Sparkles,
  CheckCircle2,
  XCircle,
  LogOut,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { formatCurrency } from '../../constants/countries';
import { DocumentStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentAdmin,
    adminLogout,
    setIsAdminMode,
    appSettings,
    refreshAllData,
    declareResult,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'OVERVIEW' | 'DRAWS' | 'WINNERS' | 'WITHDRAWALS' | 'USERS' | 'SETTINGS'
  >('OVERVIEW');

  // Draw declaration form state
  const [winNumInput, setWinNumInput] = useState<string>('777');
  const [declaring, setDeclaring] = useState(false);

  // User management state
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForAdjust, setSelectedUserForAdjust] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('100');
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustReason, setAdjustReason] = useState<string>('Administrative incentive');

  // Withdrawal rejection modal state
  const [rejectingWithdrawalId, setRejectingWithdrawalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('IBAN verification failed with central bank');

  // Settings form state
  const [settingsMultiplier, setSettingsMultiplier] = useState(
    appSettings.winningMultiplier.toString()
  );
  const [settingsActiveDraw, setSettingsActiveDraw] = useState(appSettings.activeDrawId);
  const [settingsDrawDate, setSettingsDrawDate] = useState(appSettings.activeDrawDate);

  const stats = dbService.getSystemStats();
  const allUsers = dbService.getAllUsers();
  const allEntries = dbService.getLotteryEntries();
  const allWithdrawals = dbService.getWithdrawals();
  const allResults = dbService.getDrawResults();

  // Draw declaration handler
  const handleDeclareWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{3}$/.test(winNumInput)) {
      showToast('Winning number must be exactly 3 digits (e.g. 777).', 'error');
      return;
    }

    setDeclaring(true);
    const res = await declareResult(appSettings.activeDrawId, winNumInput);
    setDeclaring(false);

    if (res.success) {
      showToast(`Declared ${winNumInput}! Settled winners & credited wallets.`, 'success');
    }
  };

  // Withdrawal approval handler
  const handleApproveWithdrawal = (withdrawalId: string) => {
    const res = dbService.approveWithdrawal(withdrawalId);
    if (res.success) {
      refreshAllData();
      showToast('Withdrawal marked as COMPLETED & dispatched.', 'success');
    } else {
      showToast(res.error || 'Failed to approve withdrawal', 'error');
    }
  };

  // Withdrawal rejection handler
  const handleRejectWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingWithdrawalId) return;

    const res = dbService.rejectWithdrawal(rejectingWithdrawalId, rejectionReason);
    if (res.success) {
      refreshAllData();
      setRejectingWithdrawalId(null);
      showToast('Withdrawal rejected and funds automatically refunded.', 'success');
    } else {
      showToast(res.error || 'Failed to reject withdrawal', 'error');
    }
  };

  // Balance adjustment handler
  const handleAdjustBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAdjust) return;

    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount.', 'error');
      return;
    }

    const res = dbService.adjustUserBalance({
      userId: selectedUserForAdjust,
      amount: amt,
      type: adjustType === 'CREDIT' ? 'ADD' : 'DEDUCT',
      reason: adjustReason,
      adminId: currentAdmin ? currentAdmin.id : 'adm_master',
    });

    if (res.success) {
      refreshAllData();
      setSelectedUserForAdjust(null);
      showToast(`Wallet adjusted successfully (${adjustType} ${amt}).`, 'success');
    } else {
      showToast(res.error || 'Failed to adjust balance', 'error');
    }
  };

  // KYC verification handler
  const handleVerifyKycDoc = (
    userId: string,
    docType: 'identityProof' | 'bankPassbook' | 'addressProof',
    status: DocumentStatus
  ) => {
    dbService.verifyKYCDocument({
      userId,
      docType,
      status,
      notes: status === 'VERIFIED' ? 'Approved by Admin Compliance' : 'Discrepancy detected in document',
    });
    refreshAllData();
    showToast(`KYC Document updated to ${status}`, 'info');
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const mult = parseInt(settingsMultiplier, 10);
    dbService.updateSettings({
      winningMultiplier: isNaN(mult) ? 400 : mult,
      activeDrawId: settingsActiveDraw,
      activeDrawDate: '',
    });
    refreshAllData();
    showToast('Lottery system configuration saved.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#050E1D] text-white pb-20">
      {/* Admin Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#071833] border-b border-[#1E40AF]/60 px-4 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminMode(false)}
            className="p-1.5 rounded-lg bg-[#0B3B7A] text-blue-200 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">User View</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
              alt="GLO Logo"
              className="w-8 h-8 rounded-full bg-white/10 p-0.5 object-contain"
            />
            <div>
              <h1 className="text-sm sm:text-base font-black text-white font-display flex items-center gap-1.5">
                <span>THAILAND LOTTERY</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1D4ED8] text-white border border-[#38BDF8]/60 font-black">
                  ADMIN
                </span>
              </h1>
              <p className="text-[10px] text-blue-200/70">Central Governance & Audit Console</p>
            </div>
          </div>
        </div>

        <button
          onClick={adminLogout}
          className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="bg-[#07152B] border-b border-[#1E40AF]/40 px-3 py-2 overflow-x-auto flex gap-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'DRAWS', label: 'Manage Draws', icon: <Trophy className="w-3.5 h-3.5" /> },
          { id: 'WINNERS', label: 'Winners & Tickets', icon: <Ticket className="w-3.5 h-3.5" /> },
          { id: 'WITHDRAWALS', label: `Withdrawals (${stats.pendingWithdrawals})`, icon: <ArrowDownCircle className="w-3.5 h-3.5" /> },
          { id: 'USERS', label: 'Users & Wallets', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'SETTINGS', label: 'Game Settings', icon: <Settings className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSelected = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white shadow-md shadow-blue-500/20 font-black'
                  : 'bg-[#071833] text-blue-200/70 hover:text-white border border-[#1E40AF]/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Main View Content Container */}
      <div className="max-w-4xl mx-auto p-4 space-y-5">
        {/* OVERVIEW TAB */}
        {activeAdminTab === 'OVERVIEW' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 shadow-sm">
                <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-wider block">
                  Total Players
                </span>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {stats.totalUsers}
                </div>
                <span className="text-[10px] text-[#38BDF8] font-semibold">Active accounts</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 shadow-sm">
                <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-wider block">
                  Total Tickets
                </span>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {stats.totalTickets}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {stats.pendingTickets} active in draw
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 shadow-sm">
                <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-wider block">
                  Pending Payouts
                </span>
                <div className="text-2xl font-black font-mono text-[#38BDF8] mt-1">
                  {stats.pendingWithdrawals}
                </div>
                <span className="text-[10px] text-blue-300 font-semibold">
                  Requires approval
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 shadow-sm">
                <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-wider block">
                  Total Completed Draws
                </span>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {stats.totalDraws}
                </div>
                <span className="text-[10px] text-blue-300 font-semibold">Certified</span>
              </div>
            </div>

            {/* Quick Draw Declaration Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#071833] to-[#050E1D] border-2 border-[#38BDF8]/60 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#38BDF8]" />
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Declare Official Draw • {appSettings.activeDrawId}
                  </h3>
                </div>
                <span className="text-xs text-[#38BDF8] font-mono font-bold">
                  1 × {appSettings.winningMultiplier} Price Money
                </span>
              </div>

              <p className="text-xs text-blue-200/80 mb-4">
                Entering the 3-digit winning number will evaluate all active tickets, declare winners,
                automatically credit winning wallet balances (1 × 400 Price Money), generate ledger receipts, and schedule
                the next draw cycle.
              </p>

              <form onSubmit={handleDeclareWinner} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={3}
                    required
                    value={winNumInput}
                    onChange={(e) => setWinNumInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 777"
                    className="w-full py-3 px-4 bg-[#050E1D] border-2 border-[#1E40AF] rounded-xl text-[#38BDF8] font-mono text-xl sm:text-2xl font-black text-center tracking-widest focus:outline-none focus:border-[#38BDF8]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-200/60 font-semibold uppercase">
                    3-Digits
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={declaring || winNumInput.length !== 3}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{declaring ? 'Settling Draw...' : 'DECLARE WINNING NUMBER & PAYOUT'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DRAWS MANAGEMENT TAB */}
        {activeAdminTab === 'DRAWS' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-[#071833] border border-[#1E40AF]/60 space-y-3">
              <h3 className="font-bold text-sm text-white">Active Draw Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#050E1D] p-3 rounded-xl border border-[#1E40AF]/60">
                  <span className="text-blue-200/60 block text-[10px]">Active Draw ID</span>
                  <span className="font-mono font-bold text-[#38BDF8] text-sm">
                    {appSettings.activeDrawId}
                  </span>
                </div>
                <div className="bg-[#050E1D] p-3 rounded-xl border border-[#1E40AF]/60">
                  <span className="text-blue-200/60 block text-[10px]">Multiplier</span>
                  <span className="font-mono font-bold text-white text-sm">
                    1 × {appSettings.winningMultiplier} Price Money
                  </span>
                </div>
                <div className="bg-[#050E1D] p-3 rounded-xl border border-[#1E40AF]/60">
                  <span className="text-blue-200/60 block text-[10px]">Pending Tickets</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {stats.pendingTickets} tickets
                  </span>
                </div>
              </div>

              {/* Quick declaration tool */}
              <div className="pt-3 border-t border-[#1E40AF]/40">
                <h4 className="text-xs font-bold text-blue-200 mb-2">
                  Instant Draw Winner Declaration:
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={3}
                    value={winNumInput}
                    onChange={(e) => setWinNumInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="777"
                    className="w-24 py-2 px-3 bg-[#050E1D] border border-[#1E40AF] rounded-xl text-[#38BDF8] font-mono text-center font-bold text-base focus:border-[#38BDF8]"
                  />
                  <button
                    onClick={handleDeclareWinner}
                    disabled={winNumInput.length !== 3}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                  >
                    Declare & Settle Now
                  </button>
                </div>
              </div>
            </div>

            {/* Historical Draws */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 px-1">
                Completed Official Draws
              </h3>
              {allResults.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B3B7A] border border-[#38BDF8]/60 flex items-center justify-center font-mono text-base font-black text-[#38BDF8]">
                      {r.winningNumber}
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-white">
                        {r.drawNumber} • 1 × 400 Price Money
                      </div>
                      <div className="text-[11px] text-blue-200/70">
                        {r.totalWinners} winners • Payout: {r.totalPayout.toLocaleString()} THB eq.
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                    SETTLED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WINNERS & TICKETS TAB */}
        {activeAdminTab === 'WINNERS' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 px-1">
              All System Tickets Audit ({allEntries.length})
            </h3>
            <div className="space-y-2">
              {allEntries.map((ticket) => {
                const user = allUsers.find((u) => u.id === ticket.userId);
                return (
                  <div
                    key={ticket.id}
                    className="p-3.5 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#050E1D] border border-[#1E40AF]/60 flex items-center justify-center font-mono font-black text-[#38BDF8]">
                        {ticket.selectedNumber}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          Ticket #{ticket.ticketNumber} ({user?.fullName || 'User'})
                        </div>
                        <div className="text-[10px] text-blue-200/60 font-mono">
                          Stake: {formatCurrency(ticket.stakeAmount, ticket.currency)} • {ticket.drawId}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ticket.status === 'WINNER'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                            : ticket.status === 'NOT_MATCHED'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-[#1D4ED8]/30 text-[#38BDF8] border border-[#38BDF8]/60'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      {ticket.potentialWinning && ticket.status === 'WINNER' && (
                        <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">
                          Paid: {formatCurrency(ticket.potentialWinning, ticket.currency)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WITHDRAWALS MANAGEMENT TAB */}
        {activeAdminTab === 'WITHDRAWALS' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 px-1">
              Audit Withdrawal Requests ({allWithdrawals.length})
            </h3>

            {/* Rejection Modal Prompt */}
            {rejectingWithdrawalId && (
              <div className="p-4 rounded-2xl bg-red-950/90 border border-red-600 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-red-200 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Reject Withdrawal Request & Auto-Refund User</span>
                </div>
                <form onSubmit={handleRejectWithdrawalSubmit} className="space-y-2">
                  <label className="block text-[11px] text-red-300">
                    Mandatory Compliance Rejection Reason:
                  </label>
                  <input
                    type="text"
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full py-2 px-3 bg-[#050E1D] border border-red-700 rounded-xl text-xs text-white"
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setRejectingWithdrawalId(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#071833] text-xs text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
                    >
                      Confirm Rejection & Refund
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-2.5">
              {allWithdrawals.map((req) => {
                const user = allUsers.find((u) => u.id === req.userId);
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm text-white">
                          {formatCurrency(req.amount, req.currency)}
                        </div>
                        <div className="text-xs text-[#38BDF8] font-semibold mt-0.5">
                          {user?.fullName} ({user?.mobile})
                        </div>
                        <div className="text-[10px] text-blue-200/60 font-mono">
                          {req.requestDate} • ID: {req.id}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                            : req.status === 'REJECTED'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-[#1D4ED8]/30 text-[#38BDF8] border border-[#38BDF8]/60'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Bank metadata */}
                    <div className="p-2.5 rounded-xl bg-[#050E1D] border border-[#1E40AF]/40 text-[11px] text-blue-200/80 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-blue-200/50 block">Bank Name:</span>
                        <span className="font-semibold text-white">{req.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-blue-200/50 block">Account Holder:</span>
                        <span className="font-semibold text-white">
                          {req.bankDetails.accountHolder}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-blue-200/50 block">IBAN / Account Number:</span>
                        <span className="font-mono font-bold text-[#38BDF8]">
                          {req.bankDetails.accountNumberOrIban}
                        </span>
                      </div>
                    </div>

                    {/* Actions if Pending */}
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleApproveWithdrawal(req.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Dispatch</span>
                        </button>
                        <button
                          onClick={() => setRejectingWithdrawalId(req.id)}
                          className="flex-1 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject & Refund</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* USERS & WALLETS TAB */}
        {activeAdminTab === 'USERS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                User Accounts & KYC Audits ({allUsers.length})
              </h3>
              <div className="relative w-48">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user..."
                  className="w-full py-1.5 pl-3 pr-2 bg-[#050E1D] border border-[#1E40AF] rounded-xl text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>

            {/* Adjust balance modal dialog if open */}
            {selectedUserForAdjust && (
              <div className="p-4 rounded-2xl bg-[#0B3B7A] border-2 border-[#38BDF8] space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Adjust User Wallet Balance</span>
                  <button
                    onClick={() => setSelectedUserForAdjust(null)}
                    className="text-blue-200 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleAdjustBalanceSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-blue-200">Type</label>
                      <select
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as any)}
                        className="w-full py-1.5 px-2 bg-[#050E1D] border border-[#1E40AF] rounded-lg text-xs text-white"
                      >
                        <option value="CREDIT">CREDIT (+)</option>
                        <option value="DEBIT">DEBIT (-)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-blue-200">Amount</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        className="w-full py-1.5 px-2 bg-[#050E1D] border border-[#1E40AF] rounded-lg text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-blue-200">Admin Audit Note</label>
                    <input
                      type="text"
                      required
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full py-1.5 px-2 bg-[#050E1D] border border-[#1E40AF] rounded-lg text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Commit Balance Adjustment
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {allUsers
                .filter(
                  (u) =>
                    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.mobile.includes(userSearch)
                )
                .map((u) => {
                  const w = dbService.getWallet(u.id);
                  return (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl bg-[#071833] border border-[#1E40AF]/60 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm text-white">{u.fullName}</div>
                          <div className="text-xs text-blue-200/70 font-mono">{u.mobile}</div>
                          <div className="text-[10px] text-[#38BDF8] mt-0.5">
                            {u.country} • Currency: {u.currency}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-base font-bold text-[#38BDF8]">
                            {w ? formatCurrency(w.balance, w.currency) : '0'}
                          </div>
                          <button
                            onClick={() => setSelectedUserForAdjust(u.id)}
                            className="mt-1 px-2.5 py-1 rounded-lg bg-[#0B3B7A] hover:bg-[#1D4ED8] border border-[#38BDF8]/40 text-[10px] font-bold text-blue-100 cursor-pointer"
                          >
                            ± Adjust Balance
                          </button>
                        </div>
                      </div>

                      {/* KYC Documents verification list for this user */}
                      <div className="pt-2 border-t border-[#1E40AF]/40">
                        <span className="text-[10px] font-bold uppercase text-blue-200/60 block mb-1">
                          KYC Document Status & Approval:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {(['identityProof', 'bankPassbook', 'addressProof'] as const).map(
                            (docType) => {
                              const doc = u.kycDocuments?.[docType];
                              const status = doc?.status || 'NOT_UPDATED';
                              return (
                                <div
                                  key={docType}
                                  className="p-2 rounded-xl bg-[#050E1D] border border-[#1E40AF]/40 text-[10px]"
                                >
                                  <div className="font-bold text-white capitalize">
                                    {docType.replace(/([A-Z])/g, ' $1')}
                                  </div>
                                  <div className="text-blue-200/60 truncate">
                                    {doc?.fileName || 'No file'}
                                  </div>
                                  <div className="flex items-center justify-between mt-1.5">
                                    <span
                                      className={`font-bold ${
                                        status === 'VERIFIED'
                                          ? 'text-emerald-400'
                                          : status === 'PENDING_REVIEW'
                                          ? 'text-[#38BDF8]'
                                          : 'text-blue-200/50'
                                      }`}
                                    >
                                      {status}
                                    </span>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() =>
                                          handleVerifyKycDoc(u.id, docType, 'VERIFIED')
                                        }
                                        title="Verify Document"
                                        className="p-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 cursor-pointer"
                                      >
                                        ✓
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleVerifyKycDoc(u.id, docType, 'REJECTED')
                                        }
                                        title="Reject Document"
                                        className="p-1 rounded bg-red-950 text-red-300 border border-red-700 cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeAdminTab === 'SETTINGS' && (
          <form
            onSubmit={handleSaveSettings}
            className="p-5 rounded-3xl bg-[#071833] border border-[#1E40AF]/60 space-y-4"
          >
            <h3 className="font-bold text-sm text-white">Global Game Configuration</h3>

            <div>
              <label className="block text-xs font-bold text-blue-200 mb-1">
                Winning Multiplier (Stake × Multiplier)
              </label>
              <input
                type="number"
                min="10"
                value={settingsMultiplier}
                onChange={(e) => setSettingsMultiplier(e.target.value)}
                className="w-full py-2 px-3 bg-[#050E1D] border border-[#1E40AF] rounded-xl text-white font-mono text-sm focus:border-[#38BDF8]"
              />
              <span className="text-[10px] text-blue-200/60">
                1 × 400 Price Money (Stake 10 THB pays 4,000 THB)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-200 mb-1">
                Active Draw ID Identifier
              </label>
              <input
                type="text"
                value={settingsActiveDraw}
                onChange={(e) => setSettingsActiveDraw(e.target.value)}
                className="w-full py-2 px-3 bg-[#050E1D] border border-[#1E40AF] rounded-xl text-white font-mono text-sm focus:border-[#38BDF8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              SAVE CONFIGURATION
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
