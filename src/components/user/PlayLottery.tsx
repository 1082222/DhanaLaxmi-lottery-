import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Dices, RotateCcw, ShieldCheck, Wallet as WalletIcon } from 'lucide-react';
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

  const [digits, setDigits] = useState<string[]>(['7', '7', '7']);
  const [activeDigitIdx, setActiveDigitIdx] = useState<number>(0);
  const [stake, setStake] = useState<number>(1);
  const [customStake, setCustomStake] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const multiplier = appSettings.winningMultiplier || 400;
  const potentialWinning = stake * multiplier;
  const selectedNumber = digits.join('');
  const currency = currentUser ? currentUser.currency : 'THB';
  const balance = wallet ? wallet.balance : 0;
  const isInsufficient = balance < stake;

  const quickStakes = [1, 5, 10, 50, 100, 500];

  // Numpad input handler
  const handleNumClick = (num: string) => {
    const newDigits = [...digits];
    newDigits[activeDigitIdx] = num;
    setDigits(newDigits);
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
      {/* Title Header with Logo */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071833] border border-[#1E40AF]/60 text-xs text-[#38BDF8] mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-bold tracking-wide uppercase">1 × 400 Prize Money</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8] font-display">
          THAILAND LOTTERY
        </h2>
        <p className="text-xs text-[#93C5FD] mt-0.5">
          Pick your lucky 3-digit number from <span className="text-white font-mono font-bold">000</span> to{' '}
          <span className="text-white font-mono font-bold">999</span>
        </p>
      </div>

      {/* Number Selector Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0D2E68] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] p-5 shadow-2xl shadow-[#1D4ED8]/20 text-center relative overflow-hidden">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#BAE6FD] block mb-2">
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
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all transform select-none cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#1D4ED8] to-[#0B254E] border-3 border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105'
                    : 'bg-[#050E1D] border-2 border-[#1E40AF]/60 hover:border-[#38BDF8]'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black font-mono text-white drop-shadow-md">
                  {digit}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-widest mt-1 ${
                    isCurrent ? 'text-[#38BDF8]' : 'text-[#93C5FD]/60'
                  }`}
                >
                  Digit {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Buttons for Number Picker */}
        <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-[#1E40AF]/50">
          <button
            type="button"
            onClick={handleRandom}
            className="py-2 px-4 rounded-xl bg-[#1E40AF] hover:bg-[#2563EB] border border-[#38BDF8]/50 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm cursor-pointer"
          >
            <Dices className="w-4 h-4 text-[#38BDF8]" />
            <span>Random Lucky Pick</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="py-2 px-4 rounded-xl bg-[#071833] hover:bg-[#0D2E68] border border-[#1E40AF]/60 text-[#93C5FD] text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Clear</span>
          </button>
        </div>

        {/* 0-9 Interactive Numpad */}
        <div className="mt-4 pt-3 border-t border-[#1E40AF]/40">
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumClick(num)}
                className="py-2.5 rounded-xl bg-[#071833] hover:bg-[#1E40AF] active:bg-[#38BDF8] active:text-[#050E1D] border border-[#1E40AF]/50 text-[#F0F7FF] font-mono text-base font-bold transition-all shadow-sm cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={handleBackspace}
              className="py-1.5 px-4 rounded-xl bg-[#050E1D] border border-[#1E40AF]/60 text-[#BAE6FD] text-xs font-semibold hover:border-[#38BDF8] transition-all cursor-pointer"
            >
              ⌫ Backspace
            </button>
          </div>
        </div>
      </div>

      {/* STAKE SELECTION & POTENTIAL WINNING */}
      <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-extrabold uppercase tracking-widest text-[#BAE6FD]">
            Select Stake Amount ({currency})
          </label>
          {wallet && (
            <div className="flex items-center gap-1 text-xs text-[#93C5FD]">
              <WalletIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>
                Balance: <strong className="text-white">{wallet.balance} {currency}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickStakes.map((amt) => {
            const isSelected = stake === amt;
            return (
              <button
                type="button"
                key={amt}
                onClick={() => handleSelectStake(amt)}
                className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1D4ED8] to-[#0284C7] text-white border-[#38BDF8] shadow-md shadow-[#1D4ED8]/30 scale-[1.02]'
                    : 'bg-[#050E1D] border-[#1E40AF]/60 text-[#BAE6FD] hover:border-[#38BDF8]/60'
                }`}
              >
                {amt} {currency}
              </button>
            );
          })}
        </div>

        {/* 1 currency -> 400 currency guarantee indicator */}
        <div className="p-2.5 rounded-xl bg-[#050E1D] border border-[#38BDF8]/40 text-center flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
          <span className="text-[#BAE6FD]">
            Price Money: <strong className="text-white font-black">1 × 400</strong> (1 {currency} stake pays 400 {currency})
          </span>
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-[#93C5FD] mb-1.5">
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
              className="w-full py-2.5 pl-4 pr-16 bg-[#050E1D] border border-[#1E40AF]/50 rounded-xl text-[#F0F7FF] font-mono text-sm focus:outline-none focus:border-[#38BDF8]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#38BDF8]">
              {currency}
            </span>
          </div>
        </div>

        {/* Financial Calculation Display: Your Stake & Potential Winning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0D2E68] to-[#071833] border border-[#1E40AF]/60 flex justify-between items-center shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#93C5FD] block">
              Your Stake
            </span>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {formatCurrency(stake, currency)}
            </div>
            <span className="text-[10px] text-[#38BDF8] font-bold">
              1 × {multiplier} Price Money
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
              Potential Winning
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-[#38BDF8] mt-0.5">
              {formatCurrency(potentialWinning, currency)}
            </div>
            <span className="text-[10px] text-[#93C5FD]">
              For exact 3-digit match
            </span>
          </div>
        </div>

        {/* Insufficient balance warning */}
        {isInsufficient && currentUser && (
          <div className="p-3 rounded-xl bg-[#0B254E] border border-[#38BDF8]/60 flex items-center justify-between text-xs">
            <span className="text-blue-100">Insufficient balance for this stake</span>
            <button
              onClick={() => setIsAddBalanceModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white font-bold text-xs shadow-sm hover:brightness-110 border border-[#38BDF8]/40 cursor-pointer"
            >
              Add Funds
            </button>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || stake <= 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-[#1D4ED8]/30 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50 cursor-pointer border border-[#38BDF8]/50"
        >
          <Sparkles className="w-5 h-5 text-[#38BDF8]" />
          <span>
            {isSubmitting
              ? 'CONFIRMING ENTRY...'
              : `CONFIRM & PLAY NUMBER ${selectedNumber} (${formatCurrency(stake, currency)})`}
          </span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#93C5FD]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Immediate digital ticket issuance with verifiable receipt</span>
        </div>
      </div>
    </div>
  );
};
