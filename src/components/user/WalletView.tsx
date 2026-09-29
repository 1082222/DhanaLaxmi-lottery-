import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  History,
  Clock,
  ShieldCheck,
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
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            Wallet & Transactions
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
            Balance overview, deposit records and transaction history
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#171114] border border-[#D4A017]/40 mx-auto flex items-center justify-center text-[#F5C542]">
            <WalletIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#FFF8E7]">Login to Access Your Wallet</h3>
            <p className="text-xs text-[#F8E7B0]/70 max-w-xs mx-auto mt-1">
              Sign in or create an account to view your balance, add funds, and manage transaction history.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F5C542] text-[#320912] font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:brightness-110"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#320912] border border-[#D4A017]/60 text-[#F5C542] font-bold text-xs uppercase tracking-wider hover:bg-[#4A0E18] cursor-pointer"
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
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            Wallet & Transactions
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
            Dhanalaxmi ledger statements, winnings & deposits
          </p>
        </div>
      </div>

      {/* Main Balance Display Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#6B1524] to-[#320912] border-2 border-[#D4A017] p-5 shadow-2xl shadow-[#D4A017]/15">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8E7B0]/80 block">
          AVAILABLE BALANCE
        </span>
        <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-mono tracking-tight mt-1">
          {formatCurrency(wallet.balance, wallet.currency)}
        </div>

        {wallet.lockedBalance > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-[#F8E7B0] bg-[#171114]/50 py-1.5 px-3 rounded-xl border border-[#7F1D2D]/60 w-fit">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Locked in Pending Withdrawal:{' '}
              <strong className="text-[#FFF8E7]">
                {formatCurrency(wallet.lockedBalance, wallet.currency)}
              </strong>
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#D4A017]/20">
          <button
            onClick={() => setIsAddBalanceModalOpen(true)}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-extrabold text-xs tracking-wider uppercase shadow-md shadow-[#D4A017]/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ADD BALANCE</span>
          </button>

          <button
            onClick={() => setUserSubView('WITHDRAW')}
            className="py-3 px-3 rounded-2xl bg-[#320912] hover:bg-[#4A0E18] border border-[#D4A017]/50 text-[#F8E7B0] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>REQUEST WITHDRAW</span>
          </button>
        </div>
      </div>

      {/* 20. TRANSACTION HISTORY */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#F5C542]" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#F8E7B0]">
              Ledger Statements
            </h3>
          </div>

          {/* Filter Chips: ALL / CREDIT / DEBIT */}
          <div className="flex gap-1 bg-[#171114] p-1 rounded-xl border border-[#7F1D2D]/60 text-[11px]">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  typeFilter === t
                    ? 'bg-[#6B1524] text-[#F5C542] border border-[#D4A017]/50'
                    : 'text-[#F8E7B0]/60 hover:text-white'
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
            <div className="p-8 rounded-2xl bg-[#320912]/50 border border-[#7F1D2D]/40 text-center">
              <History className="w-8 h-8 text-[#D4A017]/30 mx-auto mb-2" />
              <p className="text-xs text-[#FFF8E7] font-semibold">No transactions found</p>
              <p className="text-[11px] text-[#F8E7B0]/60 mt-0.5">
                Statements will appear here when entries or withdrawals occur
              </p>
            </div>
          ) : (
            filteredTx.map((tx) => {
              const isCredit = tx.type === 'CREDIT';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-[#320912]/80 border border-[#7F1D2D]/60 hover:border-[#D4A017]/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50'
                          : 'bg-[#4A0E18] text-rose-300 border border-[#D4A017]/30'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#FFF8E7] leading-tight">
                        {tx.description}
                      </h4>
                      <div className="text-[10px] text-[#F8E7B0]/60 font-mono mt-0.5">
                        {tx.timestamp} • ID: {tx.id.substring(0, 14)}
                      </div>
                      {tx.adminReason && (
                        <div className="text-[10px] text-amber-300/80 mt-0.5 italic">
                          Note: {tx.adminReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-black font-mono ${
                        isCredit ? 'text-emerald-400' : 'text-[#F8E7B0]'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[10px] text-[#F8E7B0]/60 font-mono mt-0.5">
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
