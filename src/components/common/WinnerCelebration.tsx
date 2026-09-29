import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, X, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../constants/countries';

export const WinnerCelebration: React.FC = () => {
  const { activeWinnerCelebration, setActiveWinnerCelebration, setActiveReceipt } = useApp();

  useEffect(() => {
    if (activeWinnerCelebration) {
      // Fire celebratory gold/maroon confetti
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#D4A017', '#F5C542', '#FFF8E7', '#7F1D2D'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#D4A017', '#F5C542', '#FFF8E7', '#7F1D2D'],
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
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(212,160,23,0.3)] animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={() => setActiveWinnerCelebration(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#171114]/60 hover:bg-[#6B1524] text-[#F8E7B0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Trophy & Sparkles */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F5C542] via-[#D4A017] to-[#7F1D2D] p-1 shadow-xl shadow-[#D4A017]/40 animate-bounce">
            <div className="w-full h-full bg-[#320912] rounded-[20px] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-[#F5C542]" />
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-[#F5C542] absolute -top-2 -right-2 animate-spin duration-1000" />
          <Sparkles className="w-5 h-5 text-[#FFF8E7] absolute -bottom-1 -left-2 animate-pulse" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <span className="text-3xl mb-1 block">🎉</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            CONGRATULATIONS!
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#F5C542] tracking-widest uppercase mt-1">
            YOU ARE A WINNER
          </p>
          <p className="text-xs text-[#F8E7B0]/70 mt-1">Dhanalaxmi Lottery Result</p>
        </div>

        {/* Big Winning Number Box */}
        <div className="bg-[#171114]/80 border-2 border-[#D4A017] rounded-2xl p-4 my-4 shadow-inner">
          <span className="text-xs uppercase tracking-widest text-[#F8E7B0]/70 font-semibold block mb-1">
            Matching Winning Number
          </span>
          <div className="flex justify-center gap-3 my-2">
            {activeWinnerCelebration.selectedNumber.split('').map((num, idx) => (
              <div
                key={idx}
                className="w-14 h-16 rounded-2xl bg-gradient-to-b from-[#6B1524] to-[#320912] border-2 border-[#F5C542] flex items-center justify-center text-3xl font-black text-[#F5C542] font-mono shadow-lg shadow-[#D4A017]/20"
              >
                {num}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#7F1D2D]/50 flex justify-between items-center text-xs px-2">
            <span className="text-[#F8E7B0]/70">Ticket ID</span>
            <span className="font-mono font-bold text-[#FFF8E7]">
              {activeWinnerCelebration.ticketNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs px-2 py-1">
            <span className="text-[#F8E7B0]/70">Your Stake</span>
            <span className="font-mono text-[#FFF8E7]">
              {formatCurrency(activeWinnerCelebration.stakeAmount, activeWinnerCelebration.currency)}
            </span>
          </div>
        </div>

        {/* Winning Amount Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6B1524] to-[#4A0E18] border border-[#D4A017] mb-5 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-[#F8E7B0] font-semibold">
            Winning Amount Credited
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#F5C542] font-mono mt-1">
            {formatCurrency(
              activeWinnerCelebration.winningAmount || activeWinnerCelebration.potentialWinning,
              activeWinnerCelebration.currency
            )}
          </div>
          <p className="text-[11px] text-[#F8E7B0]/80 mt-1">
            Automatically credited to your Dhanalaxmi Wallet balance
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewReceipt}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-[#D4A017]/30 flex items-center justify-center gap-2 transition-transform transform active:scale-95"
        >
          <Receipt className="w-5 h-5" />
          <span>VIEW WINNING RECEIPT</span>
        </button>
      </div>
    </div>
  );
};
