import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Dices, RotateCcw, ShieldCheck, Wallet as WalletIcon, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../constants/countries';

export const PlayLottery: React.FC = () => {
  const {
    currentUser,
    wallet,
    appSettings,
    placeEntry,
    setIsAddBalanceModalOpen,
    setIsAuthModalOpen,
    setAuthMode,
    showToast,
  } = useApp();

  const [digits, setDigits] = useState<string[]>(['7', '7', '7']); // default 777 as in prompt example
  const [activeDigitIdx, setActiveDigitIdx] = useState<number>(0);
  const [stake, setStake] = useState<number>(1);
  const [customStake, setCustomStake] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const multiplier = appSettings.winningMultiplier || 500;
  const potentialWinning = stake * multiplier;
  const selectedNumber = digits.join('');
  const currency = currentUser ? currentUser.currency : 'INR';
  const balance = wallet ? wallet.balance : 0;
  const isInsufficient = balance < stake;

  const quickStakes = [1, 5, 10, 50, 100, 500];

  // Numpad input handler
  const handleNumClick = (num: string) => {
    const newDigits = [...digits];
    newDigits[activeDigitIdx] = num;
    setDigits(newDigits);
    // Move to next digit automatically if not at the end
    if (activeDigitIdx < 2) {
      setActiveDigitIdx(activeDigitIdx + 1);
    }
  };

  const handleBackspace = () => {
    const newDigits = [...digits];
    newDigits[activeDigitIdx] = '0';
    setDigits(newDigits);
    if (activeDigitIdx > 0) {
      setActiveDigitIdx(activeDigitIdx - 1);
    }
  };

  const handleClear = () => {
    setDigits(['0', '0', '0']);
    setActiveDigitIdx(0);
  };

  const handleRandom = () => {
    const r1 = Math.floor(Math.random() * 10).toString();
    const r2 = Math.floor(Math.random() * 10).toString();
    const r3 = Math.floor(Math.random() * 10).toString();
    setDigits([r1, r2, r3]);
    setActiveDigitIdx(0);
    showToast(`Generated Lucky Pick: ${r1}${r2}${r3}`, 'info');
  };

  const handleSelectStake = (val: number) => {
    setStake(val);
    setCustomStake(val.toString());
  };

  const handleCustomStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomStake(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setStake(parsed);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setAuthMode('LOGIN');
      setIsAuthModalOpen(true);
      return;
    }

    if (selectedNumber.length !== 3 || digits.some((d) => d === '' || d === undefined)) {
      showToast('Please select all 3 digits (000 to 999).', 'error');
      return;
    }

    if (stake <= 0) {
      showToast('Stake amount must be greater than zero.', 'error');
      return;
    }

    if (isInsufficient) {
      showToast(`Insufficient balance! Please add funds to your wallet.`, 'error');
      setIsAddBalanceModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    await placeEntry(selectedNumber, stake);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Title Header */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#320912] border border-[#D4A017]/40 text-xs text-[#F5C542] mb-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wide uppercase">3-Digit Lucky Draw</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
          DHANALAXMI LOTTERY
        </h2>
        <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
          Pick your lucky 3-digit number from <span className="text-[#F5C542] font-mono">000</span> to{' '}
          <span className="text-[#F5C542] font-mono">999</span>
        </p>
      </div>

      {/* Number Selector Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] p-5 shadow-2xl shadow-[#D4A017]/20 text-center relative overflow-hidden">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8E7B0]/80 block mb-2">
          Your Lucky Number
        </span>

        {/* 3 Balls / Number Slots */}
        <div className="flex justify-center items-center gap-3 my-2">
          {digits.map((digit, idx) => {
            const isCurrent = activeDigitIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDigitIdx(idx)}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all transform select-none ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#6B1524] to-[#320912] border-3 border-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.5)] scale-105'
                    : 'bg-[#171114] border-2 border-[#D4A017]/50 hover:border-[#D4A017]'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#F5C542] drop-shadow-md">
                  {digit}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-widest mt-1 ${
                    isCurrent ? 'text-[#F5C542]' : 'text-[#F8E7B0]/40'
                  }`}
                >
                  Digit {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Buttons for Number Picker */}
        <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-[#7F1D2D]/50">
          <button
            type="button"
            onClick={handleRandom}
            className="py-2 px-4 rounded-xl bg-[#6B1524] hover:bg-[#7F1D2D] border border-[#D4A017]/50 text-[#F8E7B0] text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <Dices className="w-4 h-4 text-[#F5C542]" />
            <span>Random Lucky Pick</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="py-2 px-4 rounded-xl bg-[#320912] hover:bg-[#4A0E18] border border-[#7F1D2D] text-[#F8E7B0]/70 text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* 0-9 Interactive Numpad */}
        <div className="mt-4 pt-3 border-t border-[#7F1D2D]/40">
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumClick(num)}
                className="py-2.5 rounded-xl bg-[#320912] hover:bg-[#6B1524] active:bg-[#D4A017] active:text-[#320912] border border-[#D4A017]/30 text-[#FFF8E7] font-mono text-base font-bold transition-all shadow-sm"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={handleBackspace}
              className="py-1.5 px-4 rounded-xl bg-[#171114] border border-[#7F1D2D] text-[#F8E7B0]/80 text-xs font-semibold hover:border-[#D4A017] transition-all"
            >
              ⌫ Backspace
            </button>
          </div>
        </div>
      </div>

      {/* 14. STAKE SELECTION & POTENTIAL WINNING */}
      <div className="rounded-3xl bg-[#320912]/80 border border-[#D4A017]/40 p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-extrabold uppercase tracking-widest text-[#F8E7B0]">
            Select Stake Amount ({currency})
          </label>
          {wallet && (
            <div className="flex items-center gap-1 text-xs text-[#F8E7B0]/80">
              <WalletIcon className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>
                Balance: <strong className="text-[#F5C542]">{wallet.balance} {currency}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Amount Buttons: +1, +5, +10, +50, +100, +500 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickStakes.map((amt) => {
            const isSelected = stake === amt;
            return (
              <button
                type="button"
                key={amt}
                onClick={() => handleSelectStake(amt)}
                className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#D4A017] to-[#F5C542] text-[#320912] border-[#FFF8E7] shadow-md shadow-[#D4A017]/20 scale-[1.02]'
                    : 'bg-[#171114] border-[#7F1D2D]/60 text-[#F8E7B0] hover:border-[#D4A017]/60'
                }`}
              >
                {amt} {currency}
              </button>
            );
          })}
        </div>

        {/* 1 currency -> 500 currency guarantee indicator */}
        <div className="p-2 rounded-xl bg-[#171114] border border-[#F5C542]/40 text-center flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-[#F5C542] flex-shrink-0" />
          <span className="text-[#F8E7B0]">
            Winning Rule: <strong className="text-[#F5C542]">1 {currency} stake wins 500 {currency} payout</strong>
          </span>
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-[#F8E7B0]/80 mb-1.5">
            Or Custom Amount
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="any"
              value={customStake}
              onChange={handleCustomStakeChange}
              placeholder="Custom stake"
              className="w-full py-2.5 pl-4 pr-16 bg-[#171114] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] font-mono text-sm focus:outline-none focus:border-[#F5C542]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#D4A017]">
              {currency}
            </span>
          </div>
        </div>

        {/* Financial Calculation Display: Your Stake & Potential Winning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#4A0E18] to-[#24060c] border border-[#D4A017]/50 flex justify-between items-center shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F8E7B0]/70 block">
              Your Stake
            </span>
            <div className="text-base font-bold font-mono text-[#FFF8E7] mt-0.5">
              {formatCurrency(stake, currency)}
            </div>
            <span className="text-[10px] text-[#D4A017] font-semibold">
              Multiplier: {multiplier}x
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5C542] block">
              Potential Winning
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] to-[#F5C542] mt-0.5">
              {formatCurrency(potentialWinning, currency)}
            </div>
            <span className="text-[10px] text-[#F8E7B0]/70">
              For exact 3-digit match
            </span>
          </div>
        </div>

        {/* Insufficient balance warning + add balance trigger */}
        {isInsufficient && currentUser && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-between text-xs">
            <span className="text-amber-200">Insufficient balance for this stake</span>
            <button
              onClick={() => setIsAddBalanceModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[#D4A017] text-[#320912] font-bold text-xs shadow-sm hover:brightness-110"
            >
              Add Funds
            </button>
          </div>
        )}

        {/* 15. SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || stake <= 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-[#D4A017]/25 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span>
            {isSubmitting
              ? 'CONFIRMING ENTRY...'
              : `CONFIRM & PLAY NUMBER ${selectedNumber} (${formatCurrency(stake, currency)})`}
          </span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#F8E7B0]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>Immediate digital ticket issuance with verifiable receipt</span>
        </div>
      </div>
    </div>
  );
};
