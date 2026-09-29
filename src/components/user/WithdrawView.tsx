import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  ShieldCheck,
  Loader2,
  Banknote,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '../../constants/countries';
import { BankDetails } from '../../types';

export const WithdrawView: React.FC = () => {
  const { currentUser, wallet, requestWithdraw, showToast, setIsAuthModalOpen, setAuthMode } = useApp();

  const [amount, setAmount] = useState<string>('50');

  // 8-second processing simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSecondsLeft, setProcessingSecondsLeft] = useState(8);
  const [processingStep, setProcessingStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastWithdrawnAmount, setLastWithdrawnAmount] = useState(0);
  const [lastBankName, setLastBankName] = useState('');

  // Countdown timer for 8-second processing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessing && processingSecondsLeft > 0) {
      timer = setTimeout(() => {
        setProcessingSecondsLeft((prev) => prev - 1);
        if (processingSecondsLeft <= 6 && processingSecondsLeft > 3) {
          setProcessingStep(2);
        } else if (processingSecondsLeft <= 3) {
          setProcessingStep(3);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isProcessing, processingSecondsLeft]);

  if (!currentUser || !wallet) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        <div className="px-1">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
            Bank Withdrawal
          </h2>
          <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
            Direct payout to your verified regional bank account
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#171114] border border-[#D4A017]/40 mx-auto flex items-center justify-center text-emerald-400">
            <ArrowDownCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#FFF8E7]">Login Required for Withdrawals</h3>
            <p className="text-xs text-[#F8E7B0]/70 max-w-xs mx-auto mt-1">
              Please sign in to your account or register to submit secure bank withdrawals and track payouts.
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

  const userWithdrawals = dbService.getWithdrawals(currentUser.id);
  const requestedNum = parseFloat(amount) || 0;
  const isInsufficient = requestedNum > wallet.balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedNum <= 0) {
      showToast('Please enter a valid withdrawal amount.', 'error');
      return;
    }

    if (isInsufficient) {
      showToast('Withdrawal amount cannot exceed available balance.', 'error');
      return;
    }

    const targetBank: BankDetails = currentUser.bankDetails;
    setLastWithdrawnAmount(requestedNum);
    setLastBankName(targetBank.bankName || 'Registered Bank');

    // Start 8-second processing flow
    setIsProcessing(true);
    setProcessingSecondsLeft(8);
    setProcessingStep(1);

    // Wait for 8 full seconds
    await new Promise((resolve) => setTimeout(resolve, 8000));

    // Submit withdrawal request in DB
    const res = await requestWithdraw(requestedNum, targetBank);
    setIsProcessing(false);

    if (res.success) {
      setAmount('10');
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* 8-Second Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#2A070E] via-[#1C050A] to-[#120306] border-2 border-[#D4A017] rounded-3xl p-6 text-center shadow-2xl space-y-4">
            {/* Spinning Loader & Countdown */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#D4A017]/20"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-[#F5C542] border-t-transparent animate-spin"
                style={{ animationDuration: '1.2s' }}
              ></div>
              <div className="text-center">
                <span className="text-3xl font-black text-[#F5C542] font-mono">
                  {processingSecondsLeft}
                </span>
                <span className="block text-[10px] text-[#F8E7B0]/70 uppercase font-bold tracking-widest">
                  SEC
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#FFF8E7] font-display">
                Processing Withdrawal
              </h3>
              <p className="text-xs text-[#F8E7B0]/80 mt-1">
                Amount: <span className="text-[#F5C542] font-mono font-bold">{lastWithdrawnAmount} {wallet.currency}</span>
              </p>
            </div>

            {/* Step Progress Indicators */}
            <div className="space-y-2 text-left bg-[#171114] p-3.5 rounded-2xl border border-[#7F1D2D]/60 text-xs">
              <div className="flex items-center gap-2">
                {processingStep >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
                )}
                <span className={processingStep >= 1 ? 'text-emerald-300 font-medium' : 'text-stone-400'}>
                  Verifying account balance & KYC details...
                </span>
              </div>
              <div className="flex items-center gap-2">
                {processingStep >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
                )}
                <span className={processingStep >= 2 ? 'text-emerald-300 font-medium' : 'text-stone-400'}>
                  Initiating secure bank gateway handshake...
                </span>
              </div>
              <div className="flex items-center gap-2">
                {processingStep >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-600 flex-shrink-0" />
                )}
                <span className={processingStep >= 3 ? 'text-emerald-300 font-medium' : 'text-stone-400'}>
                  Finalizing encrypted transfer confirmation...
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#F8E7B0]/60">
              Please do not close or refresh this page.
            </p>
          </div>
        </div>
      )}

      {/* Withdrawal Success Modal (Shown after 8-sec processing completes) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#2A070E] via-[#1C050A] to-[#120306] border-2 border-[#D4A017] rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 inline-block mb-1.5">
                TRANSACTION CONFIRMED
              </span>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
                Withdrawal Success!
              </h3>
              <p className="text-xs text-[#F8E7B0]/80 mt-1">
                Your withdrawal request of{' '}
                <strong className="text-[#F5C542] font-mono">
                  {lastWithdrawnAmount} {wallet.currency}
                </strong>{' '}
                has been processed successfully.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171114] border border-[#7F1D2D]/60 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-[#F8E7B0]/70">Amount:</span>
                <span className="font-mono font-bold text-[#FFF8E7]">
                  {lastWithdrawnAmount} {wallet.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F8E7B0]/70">Destination Bank:</span>
                <span className="font-bold text-[#F5C542]">{lastBankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F8E7B0]/70">Remaining Balance:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {wallet.balance} {wallet.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F8E7B0]/70">Status:</span>
                <span className="text-emerald-400 font-bold">Approved & Submitted</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] text-[#320912] font-black text-sm tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              DONE / CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
          Request Withdrawal
        </h2>
        <p className="text-xs text-[#F8E7B0]/70 mt-0.5">
          Transfer your available lottery winnings directly to your bank account
        </p>
      </div>

      {/* Balance Summary Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] p-5 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8E7B0]/70 block">
              AVAILABLE BALANCE
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#F5C542] font-mono mt-0.5">
              {formatCurrency(wallet.balance, wallet.currency)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8E7B0]/70 block">
              WITHDRAWAL AMOUNT
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#FFF8E7] font-mono mt-0.5">
              {formatCurrency(requestedNum, wallet.currency)}
            </div>
          </div>
        </div>

        {wallet.lockedBalance > 0 && (
          <div className="mt-3 pt-3 border-t border-[#7F1D2D]/40 flex items-center justify-between text-xs text-[#F8E7B0]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Reserved in Pending Requests</span>
            </span>
            <span className="font-mono font-bold text-amber-300">
              {formatCurrency(wallet.lockedBalance, wallet.currency)}
            </span>
          </div>
        )}
      </div>

      {/* Withdrawal Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#320912]/80 border border-[#D4A017]/40 p-5 shadow-lg space-y-4"
      >
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#F8E7B0] mb-1.5">
            Withdrawal Amount ({wallet.currency}) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className="w-full py-3 pl-4 pr-16 bg-[#171114] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] font-mono text-base focus:outline-none focus:border-[#F5C542]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#D4A017]">
              {wallet.currency}
            </span>
          </div>
          {isInsufficient && (
            <p className="text-xs text-rose-400 mt-1 font-medium">
              Amount exceeds your available balance ({wallet.balance} {wallet.currency})
            </p>
          )}
        </div>

        {/* Destination Bank Account (Locked to Registered Account) */}
        <div className="pt-2 border-t border-[#7F1D2D]/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5C542] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Payout Destination Account</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Locked & Verified</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171114] border border-[#7F1D2D]/60 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[#320912]">
              <span className="text-[#F8E7B0]/60 text-[11px]">Account Holder:</span>
              <span className="font-bold text-[#FFF8E7] text-xs">
                {currentUser.bankDetails.accountHolder || currentUser.fullName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#320912]">
              <span className="text-[#F8E7B0]/60 text-[11px]">Bank Name:</span>
              <span className="font-bold text-[#F5C542] text-xs">
                {currentUser.bankDetails.bankName || 'Registered Bank'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#320912]">
              <span className="text-[#F8E7B0]/60 text-[11px]">Account / IBAN:</span>
              <span className="font-mono font-bold text-[#FFF8E7] text-xs">
                {currentUser.bankDetails.accountNumberOrIban || '•••• •••• ••••'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#F8E7B0]/60 text-[11px]">IFSC / SWIFT:</span>
              <span className="font-mono font-bold text-[#F8E7B0] text-xs">
                {currentUser.bankDetails.ifscOrSwift || 'REGISTERED'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-[#F8E7B0]/60 italic">
            * Payouts are exclusively dispatched to your verified, locked bank account for anti-fraud protection.
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing || isInsufficient || requestedNum <= 0}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-black text-sm tracking-wider uppercase shadow-xl shadow-[#D4A017]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <ArrowDownCircle className="w-5 h-5" />
          <span>
            {isProcessing
              ? 'PROCESSING (8 SEC)...'
              : `CONFIRM WITHDRAWAL (${requestedNum} ${wallet.currency})`}
          </span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#F8E7B0]/60 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>Audited by Dhanalaxmi Compliance. Instant gateway dispatch.</span>
        </div>
      </form>

      {/* WITHDRAWAL STATUS HISTORY */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#F8E7B0] px-1">
          Withdrawal Status History
        </h3>

        {userWithdrawals.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#320912]/50 border border-[#7F1D2D]/40 text-center">
            <p className="text-xs text-[#F8E7B0]/70">No previous withdrawal requests</p>
          </div>
        ) : (
          userWithdrawals.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-2xl bg-[#320912]/80 border border-[#7F1D2D]/60 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-sm font-bold text-[#FFF8E7]">
                    {formatCurrency(req.amount, req.currency)}
                  </div>
                  <div className="text-[10px] text-[#F8E7B0]/60 font-mono mt-0.5">
                    {req.bankDetails.bankName} • {req.requestDate}
                  </div>
                </div>

                <div>
                  {req.status === 'COMPLETED' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  )}
                  {req.status === 'PENDING' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4A017]/20 text-[#F5C542] border border-[#D4A017] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>PENDING</span>
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-950/80 text-red-300 border border-red-700 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>REJECTED (REFUNDED)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Rejection Note if any */}
              {req.status === 'REJECTED' && req.rejectionReason && (
                <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/40 text-[11px] text-red-200">
                  <span className="font-semibold text-red-300">Rejection Reason: </span>
                  {req.rejectionReason} (Amount was automatically refunded to your available balance)
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
