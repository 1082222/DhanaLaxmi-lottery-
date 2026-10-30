import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import { Ticket, Search, Sparkles, Receipt, Trophy } from 'lucide-react';
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
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            My Lottery Tickets
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            View active entries, historical tickets & verified winnings
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#0B254E] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#050E1D] border border-[#38BDF8]/40 mx-auto flex items-center justify-center text-[#38BDF8]">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Login to View Tickets</h3>
            <p className="text-xs text-blue-200/70 max-w-xs mx-auto mt-1">
              Log in to view your purchased tickets, check results, and track winning receipts.
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1D4ED8]/30 text-[#38BDF8] border border-[#38BDF8]/60">
            ACTIVE DRAW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            My Lottery Tickets
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            View active entries, historical tickets & verified winnings
          </p>
        </div>
        <button
          onClick={() => setActiveTab('PLAY')}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 hover:brightness-110 cursor-pointer border border-[#38BDF8]/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#38BDF8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket #TL-XXXXXX or Number (e.g. 777)..."
            className="w-full py-2.5 pl-10 pr-4 bg-[#071833] border border-[#1E40AF]/50 rounded-xl text-white text-xs focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Filter Tabs: ALL, PENDING, WINNERS, NOT MATCHED */}
        <div className="flex bg-[#050E1D] p-1 rounded-xl border border-[#1E40AF]/50 text-xs">
          {[
            { key: 'ALL', label: 'ALL' },
            { key: 'PENDING', label: 'ACTIVE' },
            { key: 'WINNERS', label: 'WINNERS' },
            { key: 'NOT_MATCHED', label: 'NOT MATCHED' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#1D4ED8] to-[#0284C7] text-white border border-[#38BDF8] shadow-sm'
                    : 'text-blue-300/60 hover:text-white'
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
          <div className="p-8 rounded-3xl bg-[#071833]/70 border border-[#1E40AF]/50 text-center">
            <Ticket className="w-12 h-12 text-[#1E40AF]/60 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No tickets found</h4>
            <p className="text-xs text-blue-200/60 mt-1">
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
                  ? 'bg-gradient-to-br from-[#0D2E68] via-[#071833] to-[#050E1D] border-[#38BDF8] shadow-lg shadow-[#1D4ED8]/30 hover:scale-[1.01]'
                  : 'bg-[#071833]/90 hover:bg-[#0B254E] border-[#1E40AF]/60 hover:border-[#38BDF8]/60'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-white tracking-wider block">
                    Ticket #{ticket.ticketNumber}
                  </span>
                  <span className="text-[11px] text-[#38BDF8] font-bold">
                    {ticket.drawId}
                  </span>
                </div>
                {getStatusBadge(ticket.status)}
              </div>

              {/* Number and Stake Display */}
              <div className="flex items-center justify-between bg-[#050E1D] p-3 rounded-xl border border-[#1E40AF]/40">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/60 block mb-1">
                    Selected Number
                  </span>
                  <div className="flex gap-1.5">
                    {ticket.selectedNumber.split('').map((digit, i) => (
                      <span
                        key={i}
                        className="w-8 h-9 rounded-lg bg-[#071833] border border-[#38BDF8] flex items-center justify-center font-mono text-lg font-black text-white"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/60 block">
                    Stake Amount
                  </span>
                  <div className="font-mono text-sm font-bold text-white mt-0.5">
                    {formatCurrency(ticket.stakeAmount, ticket.currency)}
                  </div>
                  <div className="text-[11px] text-[#38BDF8] font-bold mt-0.5">
                    1 × 400 Price Money:{' '}
                    {formatCurrency(ticket.potentialWinning, ticket.currency)}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-[#1E40AF]/40 flex justify-between items-center text-[11px] text-blue-200/70">
                <span>Entry ID: {ticket.entryId}</span>
                <span className="flex items-center gap-1 text-[#38BDF8] font-semibold group-hover:underline">
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
