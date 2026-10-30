import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import { Trophy, Search, CheckCircle2 } from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');
  const results = dbService.getDrawResults();

  const filtered = results.filter(
    (r) =>
      r.drawNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.winningNumber.includes(search.trim())
  );

  const currency = currentUser ? currentUser.currency : 'THB';

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header */}
      <div className="text-left px-1">
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
          Thailand Lottery Results
        </h2>
        <p className="text-xs text-blue-200/70 mt-0.5">
          Official declared winning numbers & certified historical draw payouts
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#38BDF8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Draw Number (e.g. #TL-102) or Winning Digits..."
          className="w-full py-2.5 pl-10 pr-4 bg-[#071833] border border-[#1E40AF]/60 rounded-xl text-white text-xs placeholder:text-blue-300/40 focus:outline-none focus:border-[#38BDF8] shadow-inner"
        />
      </div>

      {/* Results Cards List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#071833]/60 border border-[#1E40AF]/40 text-center">
            <Trophy className="w-12 h-12 text-[#38BDF8]/40 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No draw results found</h4>
            <p className="text-xs text-blue-200/60 mt-1">Try another search keyword</p>
          </div>
        ) : (
          filtered.map((draw) => (
            <div
              key={draw.id}
              className="rounded-3xl bg-gradient-to-br from-[#071833] via-[#0A224E] to-[#050E1D] border border-[#1E40AF]/60 p-5 shadow-xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0B3B7A] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-mono tracking-wide">
                      {draw.drawNumber}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{draw.status}</span>
                </span>
              </div>

              {/* Big Winning Number Display */}
              <div className="p-4 rounded-2xl bg-[#050E1D] border-2 border-[#1E40AF] text-center my-3 shadow-inner">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200/70 block mb-1">
                  WINNING NUMBER
                </span>
                <div className="flex justify-center gap-2 my-1">
                  {draw.winningNumber.split('').map((digit, i) => (
                    <div
                      key={i}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-b from-[#1D4ED8] to-[#0A224E] border-2 border-[#38BDF8] flex items-center justify-center text-3xl sm:text-4xl font-black text-white font-mono shadow-md shadow-blue-500/20"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#38BDF8] font-bold tracking-wider uppercase mt-1 block">
                  1 × 400 Price Money • Thailand Lottery Match
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E40AF]/40 text-center text-xs">
                <div className="bg-[#071833]/70 p-2 rounded-xl border border-[#1E40AF]/30">
                  <span className="text-[10px] text-blue-200/60 uppercase block">Total Entries</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm">
                    {draw.totalEntries.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#071833]/70 p-2 rounded-xl border border-[#1E40AF]/30">
                  <span className="text-[10px] text-blue-200/60 uppercase block">Winners</span>
                  <span className="font-mono font-bold text-[#38BDF8] text-xs sm:text-sm">
                    {draw.totalWinners}
                  </span>
                </div>

                <div className="bg-[#071833]/70 p-2 rounded-xl border border-[#1E40AF]/30">
                  <span className="text-[10px] text-blue-200/60 uppercase block">Total Payout</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm">
                    {draw.totalPayout.toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
