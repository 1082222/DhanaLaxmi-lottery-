import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowDownCircle,
  Ticket,
  Trophy,
  Landmark,
  FileText,
  User,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, SUPPORTED_COUNTRIES } from '../../constants/countries';
import { dbService } from '../../services/db';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    wallet,
    selectedCountry,
    setActiveTab,
    setUserSubView,
    setIsAddBalanceModalOpen,
    setActiveReceipt,
    setActiveWinnerCelebration,
    setIsAuthModalOpen,
    setAuthMode,
    appSettings,
  } = useApp();

  const drawResults = dbService.getDrawResults();
  const latestResult = drawResults.length > 0 ? drawResults[0] : null;

  if (!currentUser || !wallet) {
    const activeCountry = SUPPORTED_COUNTRIES[selectedCountry] || SUPPORTED_COUNTRIES['IN'];
    return (
      <div className="space-y-4 pb-20 pt-1">
        {/* Guest Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#6B1524] to-[#320912] border-2 border-[#D4A017] p-6 shadow-2xl shadow-[#D4A017]/20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171114]/80 border border-[#D4A017]/50 text-xs text-[#F5C542] mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide uppercase">Active Daily Draw • {appSettings.activeDrawId}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            DHANALAXMI LOTTERY
          </h1>
          <p className="text-xs sm:text-sm text-[#F8E7B0]/80 mt-1 max-w-md mx-auto">
            Pick 3 lucky digits from <strong className="text-[#F5C542]">000 to 999</strong> and win a guaranteed{' '}
            <strong className="text-[#F5C542] font-mono">{appSettings.winningMultiplier}x</strong> payout!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#D4A017]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              <span>Login to Play</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#171114] border border-[#D4A017]/60 text-[#F8E7B0] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#320912] cursor-pointer"
            >
              <span>Register Account</span>
            </button>
          </div>
        </div>

        {/* Latest Winning Results */}
        <div className="rounded-3xl bg-[#320912]/80 border border-[#D4A017]/40 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#F5C542]" />
              <h3 className="text-sm font-bold text-[#FFF8E7] uppercase tracking-wider">
                Official Draw Results
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('RESULTS')}
              className="text-xs text-[#F5C542] hover:underline flex items-center gap-0.5 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {drawResults.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-2xl bg-[#171114]/70 border border-[#7F1D2D]/60 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-[#FFF8E7]">{res.drawNumber}</div>
                  <div className="text-[10px] text-[#F8E7B0]/60 mt-0.5">{res.drawDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#F8E7B0]/70 uppercase font-semibold">Winning:</span>
                  <div className="flex gap-1">
                    {res.winningNumber.split('').map((d, i) => (
                      <span
                        key={i}
                        className="w-6 h-7 rounded-md bg-[#4A0E18] border border-[#D4A017] text-[#F5C542] font-mono font-black text-xs flex items-center justify-center"
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
        <div className="rounded-3xl bg-[#320912]/80 border border-[#D4A017]/40 p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-[#FFF8E7] uppercase tracking-wider">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#171114]/70 border border-[#7F1D2D]/50 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#D4A017] text-[#320912] font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-[#FFF8E7]">Pick 3 Digits</h4>
              <p className="text-[11px] text-[#F8E7B0]/70">Choose any number from 000 to 999 or tap Quick Pick for lucky random digits.</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#171114]/70 border border-[#7F1D2D]/50 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#D4A017] text-[#320912] font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-[#FFF8E7]">Set Your Stake</h4>
              <p className="text-[11px] text-[#F8E7B0]/70">Bet in your local regional currency with instant digital ticket issuance.</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#171114]/70 border border-[#7F1D2D]/50 space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#D4A017] text-[#320912] font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-[#FFF8E7]">Win 500x Instantly</h4>
              <p className="text-[11px] text-[#F8E7B0]/70">Match all 3 numbers to win 500x and withdraw directly to your bank account.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const countryInfo = SUPPORTED_COUNTRIES[currentUser.country];
  const userEntries = dbService.getLotteryEntries(currentUser.id);
  const recentEntries = userEntries.slice(0, 3);

  // Quick Action items from section 12
  const quickActions = [
    {
      label: 'Play Lottery',
      icon: <Sparkles className="w-5 h-5 text-[#F5C542]" />,
      badge: '3-Digit',
      action: () => setActiveTab('PLAY'),
    },
    {
      label: 'My Tickets',
      icon: <Ticket className="w-5 h-5 text-[#D4A017]" />,
      badge: `${userEntries.length}`,
      action: () => setActiveTab('TICKETS'),
    },
    {
      label: 'Results',
      icon: <Trophy className="w-5 h-5 text-[#F5C542]" />,
      action: () => setActiveTab('RESULTS'),
    },
    {
      label: 'Wallet',
      icon: <WalletIcon className="w-5 h-5 text-[#F8E7B0]" />,
      action: () => setUserSubView('WALLET'),
    },
    {
      label: 'Bank Account',
      icon: <Landmark className="w-5 h-5 text-[#D4A017]" />,
      action: () => setUserSubView('BANK_KYC'),
    },
    {
      label: 'KYC Docs',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
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
      icon: <User className="w-5 h-5 text-[#F8E7B0]" />,
      action: () => setActiveTab('PROFILE'),
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#FFF8E7] font-display flex items-center gap-1.5">
            <span>Hello, {currentUser.fullName.split(' ')[0]}</span>
            <span className="text-base">👋</span>
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 flex items-center gap-1">
            <span>{countryInfo?.flag}</span>
            <span>{countryInfo?.name}</span>
            <span>•</span>
            <span className="text-[#F5C542] font-semibold">{currentUser.currency} Account</span>
          </p>
        </div>

        {/* Live Draw Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0E18] border border-[#D4A017]/40 text-xs text-[#F8E7B0]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold font-mono">{appSettings.activeDrawId}</span>
        </div>
      </div>

      {/* 11. WALLET CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#6B1524] to-[#320912] border-2 border-[#D4A017] p-5 shadow-2xl shadow-[#D4A017]/15">
        {/* Background Subtle Accent Pattern */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#D4A017]/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-28 h-28 text-[#F5C542]" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8E7B0]/80 block">
                AVAILABLE BALANCE
              </span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-mono tracking-tight mt-1">
                {formatCurrency(wallet.balance, wallet.currency)}
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-[#320912]/80 border border-[#D4A017]/50 flex items-center justify-center text-[#F5C542]">
              <WalletIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Locked balance info if user has pending withdrawal */}
          {wallet.lockedBalance > 0 && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-[#F8E7B0]/80 bg-[#171114]/50 py-1 px-2.5 rounded-lg border border-[#7F1D2D]/60 w-fit">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Locked in Pending Withdrawal:{' '}
                <strong className="text-[#FFF8E7]">
                  {formatCurrency(wallet.lockedBalance, wallet.currency)}
                </strong>
              </span>
            </div>
          )}

          {/* Wallet Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#D4A017]/20">
            <button
              onClick={() => setIsAddBalanceModalOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-extrabold text-xs tracking-wider uppercase shadow-md shadow-[#D4A017]/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ADD BALANCE</span>
            </button>

            <button
              onClick={() => setUserSubView('WITHDRAW')}
              className="py-2.5 px-3 rounded-2xl bg-[#320912]/90 hover:bg-[#4A0E18] border border-[#D4A017]/50 text-[#F8E7B0] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95"
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
        className="p-4 rounded-2xl bg-gradient-to-r from-[#320912] via-[#4A0E18] to-[#171114] border border-[#D4A017]/50 cursor-pointer hover:border-[#F5C542] transition-all group shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#6B1524] border border-[#D4A017]/40 flex items-center justify-center text-[#F5C542] group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#F5C542] tracking-wider">
                  Dhanalaxmi Lottery Result • {appSettings.activeDrawId}
                </span>
              </div>
              <p className="text-xs text-[#F8E7B0]/80 mt-0.5">
                Win up to <span className="text-[#F5C542] font-bold">{appSettings.winningMultiplier}x</span> your stake with a 3-digit match!
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#D4A017] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 12. QUICK ACTIONS (Icon Grid) */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#F8E7B0]/80 mb-2.5 px-1">
          Quick Services
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              className="p-3 rounded-2xl bg-[#320912]/80 hover:bg-[#4A0E18] border border-[#7F1D2D]/60 hover:border-[#D4A017]/60 flex flex-col items-center justify-center text-center transition-all group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#171114] border border-[#D4A017]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-[11px] font-semibold text-[#FFF8E7] mt-1.5 leading-tight">
                {action.label}
              </span>
              {action.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#D4A017]/20 text-[#F5C542] border border-[#D4A017]/40 mt-1">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Latest Draw Winning Result Highlight */}
      {latestResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#24060c] via-[#320912] to-[#24060c] border border-[#D4A017]/40 shadow-md">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#F5C542]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F8E7B0]">
                Latest Declared Result • {latestResult.drawNumber}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('RESULTS')}
              className="text-[11px] font-bold text-[#F5C542] hover:underline"
            >
              All Draws →
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#171114] p-3 rounded-xl border border-[#7F1D2D]/50">
            <div>
              <span className="text-[10px] text-[#F8E7B0]/60 uppercase font-bold tracking-widest block">
                WINNING NUMBER
              </span>
              <div className="flex gap-1.5 mt-1">
                {latestResult.winningNumber.split('').map((d, i) => (
                  <span
                    key={i}
                    className="w-8 h-9 rounded-lg bg-[#4A0E18] border border-[#D4A017] flex items-center justify-center font-mono text-xl font-black text-[#F5C542]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-[#FFF8E7]">
                {latestResult.totalWinners} Lucky Winners
              </div>
              <div className="text-[11px] text-[#F8E7B0]/70 font-mono">
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
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#F8E7B0]/80">
            Recent Tickets
          </h3>
          <button
            onClick={() => setActiveTab('TICKETS')}
            className="text-xs font-bold text-[#F5C542] hover:underline"
          >
            View All ({userEntries.length}) →
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#320912]/60 border border-[#7F1D2D]/50 text-center">
            <Ticket className="w-10 h-10 text-[#D4A017]/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#FFF8E7]">No lottery entries yet</p>
            <p className="text-[11px] text-[#F8E7B0]/60 mt-0.5">
              Pick your 3 lucky numbers and win 500x your stake!
            </p>
            <button
              onClick={() => setActiveTab('PLAY')}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F5C542] text-[#320912] text-xs font-bold uppercase tracking-wider"
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
                    ? 'bg-gradient-to-r from-[#4A0E18] to-[#320912] border-[#F5C542] shadow-md shadow-[#D4A017]/20'
                    : 'bg-[#320912]/70 hover:bg-[#4A0E18]/60 border-[#7F1D2D]/60 hover:border-[#D4A017]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {entry.selectedNumber.split('').map((digit, i) => (
                      <div
                        key={i}
                        className="w-7 h-8 rounded-lg bg-[#171114] border border-[#D4A017]/50 flex items-center justify-center text-sm font-black font-mono text-[#F5C542]"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold text-[#FFF8E7]">
                      Ticket #{entry.ticketNumber}
                    </div>
                    <div className="text-[10px] text-[#F8E7B0]/70 mt-0.5">
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
                        : 'bg-[#D4A017]/20 text-[#F5C542] border-[#D4A017]'
                    }`}
                  >
                    {entry.status === 'WINNER' ? '🏆 WINNER' : entry.status}
                  </span>
                  <div className="text-[10px] text-[#F8E7B0]/60 mt-1">Tap for receipt</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
