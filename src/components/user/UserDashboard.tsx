import React from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  Wallet as WalletIcon,
  Sparkles,
  Trophy,
  Ticket,
  ArrowDownCircle,
  PlusCircle,
  ChevronRight,
  User,
  Landmark,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, SUPPORTED_COUNTRIES } from '../../constants/countries';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    wallet,
    appSettings,
    setActiveTab,
    setIsAddBalanceModalOpen,
    setUserSubView,
    setIsAuthModalOpen,
    setAuthMode,
    setActiveReceipt,
    setActiveWinnerCelebration,
  } = useApp();

  const drawResults = dbService.getDrawResults();
  const latestResult = drawResults[0];

  // Guest view if user is not logged in
  if (!currentUser || !wallet) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        {/* Guest Hero Banner with Official GLO Emblem */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2E68] via-[#0B254E] to-[#071833] border-2 border-[#1E40AF] p-6 shadow-2xl shadow-[#1D4ED8]/30 text-center">
          <div className="w-20 h-20 mx-auto mb-3 p-1 rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#0284C7] to-[#38BDF8] shadow-lg shadow-[#1D4ED8]/40">
            <div className="w-full h-full bg-[#071833] rounded-[14px] p-1.5 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
                alt="Thailand Lottery Emblem"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050E1D]/80 border border-[#1E40AF]/60 text-xs text-[#38BDF8] mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide uppercase">Active Draw • {appSettings.activeDrawId}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8] font-display">
            THAILAND LOTTERY
          </h1>
          <p className="text-xs sm:text-sm text-[#93C5FD] mt-1 max-w-md mx-auto">
            Pick 3 lucky digits from <strong className="text-white">000 to 999</strong> • <strong className="text-[#38BDF8] font-bold">1 × 400 Prize Money</strong>!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#1D4ED8]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform border border-[#38BDF8]/40"
            >
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Login to Play</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 text-[#BAE6FD] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#071833] cursor-pointer"
            >
              <span>Register Account</span>
            </button>
          </div>
        </div>

        {/* Latest Winning Results */}
        <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Official Draw Results
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('RESULTS')}
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {drawResults.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-2xl bg-[#050E1D]/90 border border-[#1E40AF]/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-white">{res.drawNumber}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-200/70 uppercase font-semibold">Winning:</span>
                  <div className="flex gap-1">
                    {res.winningNumber.split('').map((d, i) => (
                      <span
                        key={i}
                        className="w-6 h-7 rounded-md bg-[#0B254E] border border-[#38BDF8] text-white font-mono font-black text-xs flex items-center justify-center shadow-sm"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How To Play */}
        <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#050E1D]/90 border border-[#1E40AF]/40 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-white">Pick 3 Digits</h4>
              <p className="text-[11px] text-blue-200/70">Choose any number from 000 to 999 or tap Quick Pick for lucky random digits.</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#050E1D]/90 border border-[#1E40AF]/40 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-white">Set Your Stake</h4>
              <p className="text-[11px] text-blue-200/70">Bet in your local regional currency with instant digital ticket issuance.</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#050E1D]/90 border border-[#1E40AF]/40 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-white">1 × 400 Prize Money</h4>
              <p className="text-[11px] text-blue-200/70">Match all 3 numbers to win 400x prize money and withdraw directly to your bank account.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const countryInfo = SUPPORTED_COUNTRIES[currentUser.country];
  const userEntries = dbService.getLotteryEntries(currentUser.id);
  const recentEntries = userEntries.slice(0, 3);

  // Quick Action items
  const quickActions = [
    {
      label: 'Play Lottery',
      icon: <Sparkles className="w-5 h-5 text-[#38BDF8]" />,
      badge: '3-Digit',
      action: () => setActiveTab('PLAY'),
    },
    {
      label: 'My Tickets',
      icon: <Ticket className="w-5 h-5 text-[#60A5FA]" />,
      badge: `${userEntries.length}`,
      action: () => setActiveTab('TICKETS'),
    },
    {
      label: 'Results',
      icon: <Trophy className="w-5 h-5 text-[#38BDF8]" />,
      action: () => setActiveTab('RESULTS'),
    },
    {
      label: 'Wallet',
      icon: <WalletIcon className="w-5 h-5 text-blue-200" />,
      action: () => setUserSubView('WALLET'),
    },
    {
      label: 'Bank Account',
      icon: <Landmark className="w-5 h-5 text-[#60A5FA]" />,
      action: () => setUserSubView('BANK_KYC'),
    },
    {
      label: 'KYC Docs',
      icon: <FileText className="w-5 h-5 text-[#93C5FD]" />,
      badge: currentUser.kycDocuments.identityProof?.status === 'VERIFIED' ? 'Verified' : 'Pending',
      action: () => setUserSubView('BANK_KYC'),
    },
    {
      label: 'Withdraw',
      icon: <ArrowDownCircle className="w-5 h-5 text-emerald-400" />,
      action: () => setUserSubView('WITHDRAW'),
    },
    {
      label: 'Profile',
      icon: <User className="w-5 h-5 text-blue-200" />,
      action: () => setActiveTab('PROFILE'),
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white font-display flex items-center gap-1.5">
            <span>Hello, {currentUser.fullName.split(' ')[0]}</span>
            <span className="text-base">👋</span>
          </h2>
          <p className="text-xs text-blue-200/70 flex items-center gap-1">
            <span>{countryInfo?.flag}</span>
            <span>{countryInfo?.name}</span>
            <span>•</span>
            <span className="text-[#38BDF8] font-semibold">{currentUser.currency} Account</span>
          </p>
        </div>

        {/* Live Draw Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B254E] border border-[#1E40AF]/60 text-xs text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold font-mono">{appSettings.activeDrawId}</span>
        </div>
      </div>

      {/* WALLET CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B254E] via-[#0D2E68] to-[#071833] border-2 border-[#1E40AF] p-5 shadow-2xl shadow-blue-500/15">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200/80 block">
                AVAILABLE BALANCE
              </span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-mono tracking-tight mt-1">
                {formatCurrency(wallet.balance, wallet.currency)}
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 flex items-center justify-center text-[#38BDF8]">
              <WalletIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Locked balance info if user has pending withdrawal */}
          {wallet.lockedBalance > 0 && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-blue-200 bg-[#050E1D]/60 py-1 px-2.5 rounded-lg border border-[#1E40AF]/60 w-fit">
              <span>
                Pending Withdrawal:{' '}
                <strong className="text-white">
                  {formatCurrency(wallet.lockedBalance, wallet.currency)}
                </strong>
              </span>
            </div>
          )}

          {/* Wallet Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1E40AF]/40">
            <button
              onClick={() => setIsAddBalanceModalOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ADD BALANCE</span>
            </button>

            <button
              onClick={() => setUserSubView('WITHDRAW')}
              className="py-2.5 px-3 rounded-2xl bg-[#071833] hover:bg-[#0A224E] border border-[#1E40AF] text-blue-100 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>WITHDRAW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Draw Spotlight Banner */}
      <div
        onClick={() => setActiveTab('PLAY')}
        className="p-4 rounded-2xl bg-gradient-to-r from-[#0D2E68] via-[#0B254E] to-[#071833] border border-[#1E40AF]/60 cursor-pointer hover:border-[#38BDF8] transition-all group shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#071833] border border-[#1E40AF] p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
                alt="Thailand Lottery"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#38BDF8] tracking-wider">
                  Thailand Lottery Result • {appSettings.activeDrawId}
                </span>
              </div>
              <p className="text-xs text-[#BAE6FD]/90 mt-0.5">
                <span className="text-white font-black">1 × 400 Prize Money</span> • Win up to 400x your stake!
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* QUICK ACTIONS (Icon Grid) */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-200/80 mb-2.5 px-1">
          Quick Services
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              className="p-3 rounded-2xl bg-[#071833]/90 hover:bg-[#0B254E] border border-[#1E40AF]/50 hover:border-[#38BDF8]/60 flex flex-col items-center justify-center text-center transition-all group active:scale-95 shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#050E1D] border border-[#1E40AF]/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-[11px] font-semibold text-white mt-1.5 leading-tight">
                {action.label}
              </span>
              {action.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#1D4ED8]/30 text-[#38BDF8] border border-[#38BDF8]/40 mt-1">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Latest Draw Winning Result Highlight */}
      {latestResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071833] via-[#0B254E] to-[#071833] border border-[#1E40AF]/60 shadow-md">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Latest Declared Result • {latestResult.drawNumber}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('RESULTS')}
              className="text-[11px] font-bold text-[#38BDF8] hover:underline cursor-pointer"
            >
              All Draws →
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#050E1D] p-3 rounded-xl border border-[#1E40AF]/50">
            <div>
              <span className="text-[10px] text-blue-200/60 uppercase font-bold tracking-widest block">
                WINNING NUMBER
              </span>
              <div className="flex gap-1.5 mt-1">
                {latestResult.winningNumber.split('').map((d, i) => (
                  <span
                    key={i}
                    className="w-8 h-9 rounded-lg bg-[#0B254E] border border-[#38BDF8] flex items-center justify-center font-mono text-xl font-black text-white"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-white">
                {latestResult.totalWinners} Lucky Winners
              </div>
              <div className="text-[11px] text-blue-200/70 font-mono">
                Total Payout: {latestResult.totalPayout.toLocaleString()} {currentUser.currency}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>Settled & Credited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tickets Section */}
      <div>
        <div className="flex justify-between items-center mb-2.5 px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-200/80">
            Recent Tickets
          </h3>
          <button
            onClick={() => setActiveTab('TICKETS')}
            className="text-xs font-bold text-[#38BDF8] hover:underline cursor-pointer"
          >
            View All ({userEntries.length}) →
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#071833]/70 border border-[#1E40AF]/50 text-center">
            <Ticket className="w-10 h-10 text-[#38BDF8]/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">No lottery entries yet</p>
            <p className="text-[11px] text-blue-200/70 mt-0.5">
              Pick your 3 lucky numbers • 1 × 400 Prize Money!
            </p>
            <button
              onClick={() => setActiveTab('PLAY')}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#0284C7] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Play Now
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  if (entry.status === 'WINNER') {
                    setActiveWinnerCelebration(entry);
                  } else {
                    setActiveReceipt(entry);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  entry.status === 'WINNER'
                    ? 'bg-gradient-to-r from-[#0D2E68] to-[#071833] border-[#38BDF8] shadow-md shadow-blue-500/20'
                    : 'bg-[#071833]/90 hover:bg-[#0B254E] border-[#1E40AF]/60 hover:border-[#38BDF8]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {entry.selectedNumber.split('').map((digit, i) => (
                      <div
                        key={i}
                        className="w-7 h-8 rounded-lg bg-[#050E1D] border border-[#38BDF8]/60 flex items-center justify-center text-sm font-black font-mono text-white"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold text-white">
                      Ticket #{entry.ticketNumber}
                    </div>
                    <div className="text-[10px] text-blue-200/70 mt-0.5">
                      Stake: {formatCurrency(entry.stakeAmount, entry.currency)} • {entry.drawId}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                      entry.status === 'WINNER'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 animate-pulse'
                        : entry.status === 'NOT_MATCHED'
                        ? 'bg-red-950/80 text-red-300 border-red-800'
                        : 'bg-[#1D4ED8]/30 text-[#38BDF8] border-[#38BDF8]/60'
                    }`}
                  >
                    {entry.status === 'WINNER' ? '🏆 WINNER' : entry.status}
                  </span>
                  <div className="text-[10px] text-blue-200/60 mt-1">Tap for receipt</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
