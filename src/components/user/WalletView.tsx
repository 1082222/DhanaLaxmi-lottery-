import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '../../constants/countries';
import { TransactionType } from '../../types';

export const WalletView: React.FC = () => {
  const {
    currentUser,
    wallet,
    setIsAddBalanceModalOpen,
    setUserSubView,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');

  if (!currentUser || !wallet) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        <div className="px-1">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            Wallet & Transactions
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            Balance overview, deposit records and transaction history
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#050E1D] border border-[#38BDF8]/40 mx-auto flex items-center justify-center text-[#38BDF8]">
            <WalletIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Login to Access Your Wallet</h3>
            <p className="text-xs text-blue-200/70 max-w-xs mx-auto mt-1">
              Sign in or create an account to view your balance, add funds, and manage transaction history.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:brightness-110"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#071833] border border-[#1E40AF] text-[#38BDF8] font-bold text-xs uppercase tracking-wider hover:bg-[#0A224E] cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allTx = dbService.getTransactions(currentUser.id);

  const filteredTx = allTx.filter((tx) => {
    if (typeFilter === 'ALL') return true;
    return tx.type === typeFilter;
  });

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            Wallet & Transactions
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            Thailand Lottery ledger statements, winnings & deposits
          </p>
        </div>
      </div>

      {/* Main Balance Display Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#1E40AF] to-[#071833] border-2 border-[#38BDF8]/60 p-5 shadow-2xl shadow-blue-500/15">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200 block">
          AVAILABLE BALANCE
        </span>
        <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mt-1">
          {formatCurrency(wallet.balance, wallet.currency)}
        </div>

        {wallet.lockedBalance > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-200 bg-[#050E1D]/60 py-1.5 px-3 rounded-xl border border-[#1E40AF]/60 w-fit">
            <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              Locked in Pending Withdrawal:{' '}
              <strong className="text-white">
                {formatCurrency(wallet.lockedBalance, wallet.currency)}
              </strong>
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-blue-400/20">
          <button
            onClick={() => setIsAddBalanceModalOpen(true)}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#1D4ED8] hover:brightness-110 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ADD BALANCE</span>
          </button>

          <button
            onClick={() => setUserSubView('WITHDRAW')}
            className="py-3 px-3 rounded-2xl bg-[#071833] hover:bg-[#0A224E] border border-[#38BDF8]/50 text-blue-100 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>REQUEST WITHDRAW</span>
          </button>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-200">
              Ledger Statements
            </h3>
          </div>

          {/* Filter Chips: ALL / CREDIT / DEBIT */}
          <div className="flex gap-1 bg-[#050E1D] p-1 rounded-xl border border-[#1E40AF]/60 text-[11px]">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#1D4ED8] text-white border border-[#38BDF8]'
                    : 'text-blue-300/60 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions list */}
        <div className="space-y-2">
          {filteredTx.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#071833]/50 border border-[#1E40AF]/40 text-center">
              <History className="w-8 h-8 text-[#38BDF8]/30 mx-auto mb-2" />
              <p className="text-xs text-white font-semibold">No transactions found</p>
              <p className="text-[11px] text-blue-200/60 mt-0.5">
                Statements will appear here when entries or withdrawals occur
              </p>
            </div>
          ) : (
            filteredTx.map((tx) => {
              const isCredit = tx.type === 'CREDIT';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-[#071833]/90 border border-[#1E40AF]/50 hover:border-[#38BDF8]/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50'
                          : 'bg-[#0B3B7A] text-blue-200 border border-[#1E40AF]'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {tx.description}
                      </h4>
                      <div className="text-[10px] text-blue-200/60 font-mono mt-0.5">
                        Ledger ID: {tx.id.substring(0, 14)}
                      </div>
                      {tx.adminReason && (
                        <div className="text-[10px] text-blue-300/80 mt-0.5 italic">
                          Note: {tx.adminReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-black font-mono ${
                        isCredit ? 'text-emerald-400' : 'text-blue-100'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[10px] text-blue-200/60 font-mono mt-0.5">
                      Bal: {formatCurrency(tx.balanceAfter, tx.currency)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
