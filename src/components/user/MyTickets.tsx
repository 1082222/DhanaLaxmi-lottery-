import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import { Ticket, Search, Filter, Sparkles, Receipt, Trophy } from 'lucide-react';
import { formatCurrency } from '../../constants/countries';
import { TicketStatus } from '../../types';

export const MyTickets: React.FC = () => {
  const {
    currentUser,
    setActiveReceipt,
    setActiveWinnerCelebration,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WINNERS' | TicketStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        <div className="px-1">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            My Lottery Tickets
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
            View active entries, historical tickets & verified winnings
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#171114] border border-[#D4A017]/40 mx-auto flex items-center justify-center text-[#D4A017]">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#FFF8E7]">Login to View Tickets</h3>
            <p className="text-xs text-[#F8E7B0]/70 max-w-xs mx-auto mt-1">
              Log in to view your purchased tickets, check results, and track winning receipts.
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

  const allTickets = dbService.getLotteryEntries(currentUser.id);

  const filteredTickets = allTickets.filter((ticket) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'WINNERS'
        ? ticket.status === 'WINNER'
        : ticket.status === activeFilter;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.selectedNumber.includes(searchQuery.trim()) ||
          ticket.drawId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'WINNER':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500 animate-pulse flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>WINNER</span>
          </span>
        );
      case 'NOT_MATCHED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-950/70 text-red-300 border border-red-800">
            NOT MATCHED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4A017]/20 text-[#F5C542] border border-[#D4A017]">
            PENDING DRAW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            My Lottery Tickets
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
            View active entries, historical tickets & verified winnings
          </p>
        </div>
        <button
          onClick={() => setActiveTab('PLAY')}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F5C542] text-[#320912] font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 hover:brightness-110"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#D4A017] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket #DL-XXXXXX or Number (e.g. 777)..."
            className="w-full py-2.5 pl-10 pr-4 bg-[#320912] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs focus:outline-none focus:border-[#F5C542]"
          />
        </div>

        {/* 17. Filter Tabs: ALL, PENDING, WINNERS, NOT MATCHED */}
        <div className="flex bg-[#171114] p-1 rounded-xl border border-[#7F1D2D]/60 text-xs">
          {[
            { key: 'ALL', label: 'ALL' },
            { key: 'PENDING', label: 'PENDING' },
            { key: 'WINNERS', label: 'WINNERS' },
            { key: 'NOT_MATCHED', label: 'NOT MATCHED' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#6B1524] to-[#4A0E18] text-[#F5C542] border border-[#D4A017]/50 shadow-sm'
                    : 'text-[#F8E7B0]/60 hover:text-[#FFF8E7]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#320912]/60 border border-[#7F1D2D]/50 text-center">
            <Ticket className="w-12 h-12 text-[#D4A017]/40 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#FFF8E7]">No tickets found</h4>
            <p className="text-xs text-[#F8E7B0]/60 mt-1">
              {searchQuery
                ? 'Try a different search query or filter'
                : 'You have no tickets under this category'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => {
                if (ticket.status === 'WINNER') {
                  setActiveWinnerCelebration(ticket);
                } else {
                  setActiveReceipt(ticket);
                }
              }}
              className={`rounded-2xl border p-4 transition-all cursor-pointer relative overflow-hidden group ${
                ticket.status === 'WINNER'
                  ? 'bg-gradient-to-br from-[#4A0E18] via-[#320912] to-[#24060c] border-[#F5C542] shadow-lg shadow-[#D4A017]/20 hover:scale-[1.01]'
                  : 'bg-[#320912]/80 hover:bg-[#4A0E18]/80 border-[#7F1D2D]/70 hover:border-[#D4A017]/50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F5C542] tracking-wider block">
                    Ticket #{ticket.ticketNumber}
                  </span>
                  <span className="text-[11px] text-[#F8E7B0]/70 font-medium">
                    {ticket.drawId} • {ticket.drawDate}
                  </span>
                </div>
                {getStatusBadge(ticket.status)}
              </div>

              {/* Number and Stake Display */}
              <div className="flex items-center justify-between bg-[#171114] p-3 rounded-xl border border-[#7F1D2D]/40">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F8E7B0]/60 block mb-1">
                    Selected Number
                  </span>
                  <div className="flex gap-1.5">
                    {ticket.selectedNumber.split('').map((digit, i) => (
                      <span
                        key={i}
                        className="w-8 h-9 rounded-lg bg-[#4A0E18] border border-[#D4A017] flex items-center justify-center font-mono text-lg font-black text-[#F5C542]"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F8E7B0]/60 block">
                    Stake Amount
                  </span>
                  <div className="font-mono text-sm font-bold text-[#FFF8E7] mt-0.5">
                    {formatCurrency(ticket.stakeAmount, ticket.currency)}
                  </div>
                  <div className="text-[11px] text-[#D4A017] font-semibold mt-0.5">
                    Potential:{' '}
                    {formatCurrency(ticket.potentialWinning, ticket.currency)}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-[#7F1D2D]/40 flex justify-between items-center text-[11px] text-[#F8E7B0]/70">
                <span>Entry ID: {ticket.entryId}</span>
                <span className="flex items-center gap-1 text-[#F5C542] font-semibold group-hover:underline">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Receipt</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
