import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../constants/countries';

export const WinnerCelebration: React.FC = () => {
  const { activeWinnerCelebration, setActiveWinnerCelebration, setActiveReceipt } = useApp();

  useEffect(() => {
    if (activeWinnerCelebration) {
      // Fire celebratory blue confetti
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#1D4ED8', '#2563EB', '#38BDF8', '#93C5FD', '#FFFFFF'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#1D4ED8', '#2563EB', '#38BDF8', '#93C5FD', '#FFFFFF'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [activeWinnerCelebration]);

  if (!activeWinnerCelebration) return null;

  const handleViewReceipt = () => {
    const entry = activeWinnerCelebration;
    setActiveWinnerCelebration(null);
    setActiveReceipt(entry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0D2E68] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(29,78,216,0.35)] animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={() => setActiveWinnerCelebration(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#050E1D]/60 hover:bg-[#1E40AF] text-[#93C5FD] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Trophy & Sparkles with Logo */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1E40AF] via-[#0284C7] to-[#38BDF8] p-1 shadow-xl shadow-[#1D4ED8]/40 animate-bounce">
            <div className="w-full h-full bg-[#071833] rounded-[20px] p-2 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
                alt="Thailand Lottery"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-[#38BDF8] absolute -top-2 -right-2 animate-spin duration-1000" />
          <Sparkles className="w-5 h-5 text-white absolute -bottom-1 -left-2 animate-pulse" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <span className="text-3xl mb-1 block">🎉</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8] font-display">
            CONGRATULATIONS!
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#38BDF8] tracking-widest uppercase mt-1">
            YOU ARE A WINNER • 1 × 400 PRICE MONEY
          </p>
          <p className="text-xs text-[#93C5FD] mt-1">Thailand Lottery Result</p>
        </div>

        {/* Big Winning Number Box */}
        <div className="bg-[#050E1D]/80 border-2 border-[#1E40AF] rounded-2xl p-4 my-4 shadow-inner">
          <span className="text-xs uppercase tracking-widest text-[#93C5FD] font-semibold block mb-1">
            Matching Winning Number
          </span>
          <div className="flex justify-center gap-3 my-2">
            {activeWinnerCelebration.selectedNumber.split('').map((num, idx) => (
              <div
                key={idx}
                className="w-14 h-16 rounded-2xl bg-gradient-to-b from-[#1E40AF] to-[#0A224E] border-2 border-[#38BDF8] flex items-center justify-center text-3xl font-black text-white font-mono shadow-lg shadow-[#1D4ED8]/30"
              >
                {num}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#1E40AF]/50 flex justify-between items-center text-xs px-2">
            <span className="text-[#93C5FD]">Ticket ID</span>
            <span className="font-mono font-bold text-white">
              {activeWinnerCelebration.ticketNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs px-2 py-1">
            <span className="text-[#93C5FD]">Your Stake</span>
            <span className="font-mono text-white">
              {formatCurrency(activeWinnerCelebration.stakeAmount, activeWinnerCelebration.currency)}
            </span>
          </div>
        </div>

        {/* Winning Amount Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0D2E68] to-[#1E40AF] border border-[#38BDF8] mb-5 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-[#BAE6FD] font-semibold">
            Winning Amount Credited (1 × 400)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {formatCurrency(
              activeWinnerCelebration.winningAmount || activeWinnerCelebration.potentialWinning,
              activeWinnerCelebration.currency
            )}
          </div>
          <p className="text-[11px] text-[#BAE6FD]/80 mt-1">
            Automatically credited to your Thailand Lottery Wallet balance
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewReceipt}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-[#1D4ED8]/40 flex items-center justify-center gap-2 transition-transform transform active:scale-95 border border-[#38BDF8]/40 cursor-pointer"
        >
          <Receipt className="w-5 h-5" />
          <span>VIEW WINNING RECEIPT</span>
        </button>
      </div>
    </div>
  );
};
