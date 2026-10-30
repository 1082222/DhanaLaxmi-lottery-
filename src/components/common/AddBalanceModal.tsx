import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, PlusCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../constants/countries';

export const AddBalanceModal: React.FC = () => {
  const { isAddBalanceModalOpen, setIsAddBalanceModalOpen, wallet, addBalance } = useApp();
  const [amount, setAmount] = useState<number>(50);
  const [customInput, setCustomInput] = useState<string>('50');
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'NET_BANKING' | 'APPLE_PAY'>('CARD');
  const [loading, setLoading] = useState(false);

  if (!isAddBalanceModalOpen || !wallet) return null;

  const quickAmounts = [10, 50, 100, 500];

  const handleSelectQuick = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setLoading(true);
    // Simulate swift instant gateway processing
    setTimeout(async () => {
      await addBalance(amount, `Instant Deposit (${selectedMethod})`);
      setLoading(false);
      setIsAddBalanceModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#050E1D] border-t sm:border border-[#1E40AF]/60 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0D2E68] to-[#071833] border-b border-[#1E40AF]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1E40AF] border border-[#38BDF8]/50 flex items-center justify-center text-[#38BDF8]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F0F7FF] font-display">Add Wallet Balance</h3>
              <p className="text-[11px] text-[#93C5FD]">Instant deposit to play Thailand Lottery Lucky Draw</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddBalanceModalOpen(false)}
            className="p-1.5 rounded-lg text-[#93C5FD] hover:text-white hover:bg-[#1E40AF]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="px-5 py-3 bg-[#071833] border-b border-[#1E40AF]/40 flex justify-between items-center text-xs">
          <span className="text-[#93C5FD]">Current Available Balance</span>
          <span className="font-mono font-bold text-[#38BDF8] text-sm">
            {formatCurrency(wallet.balance, wallet.currency)}
          </span>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Amounts */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
              Select Top-up Amount ({wallet.currency})
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => {
                const isSelected = amount === amt;
                return (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => handleSelectQuick(amt)}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold font-mono transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1D4ED8] to-[#0284C7] text-white border-[#38BDF8] shadow-md scale-[1.02]'
                        : 'bg-[#071833] border-[#1E40AF]/50 text-[#BAE6FD] hover:border-[#38BDF8]/60'
                    }`}
                  >
                    +{amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#93C5FD] mb-1.5">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="any"
                value={customInput}
                onChange={handleCustomChange}
                placeholder="Enter amount"
                className="w-full py-3 pl-4 pr-16 bg-[#071833] border border-[#1E40AF]/50 rounded-xl text-[#F0F7FF] font-mono text-base focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#38BDF8]">
                {wallet.currency}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#93C5FD] mb-2">
              Payment Gateway
            </label>
            <div className="space-y-2">
              {[
                { id: 'CARD', label: 'Debit / Credit Card (Visa / Mastercard)', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'NET_BANKING', label: 'Online Direct Banking / PromptPay / Regional NetBanking', icon: <CheckCircle2 className="w-4 h-4" /> },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === m.id
                      ? 'bg-[#0D2E68] border-[#38BDF8] text-[#F0F7FF]'
                      : 'bg-[#071833]/60 border-[#1E40AF]/40 text-[#93C5FD]/70 hover:border-[#38BDF8]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <span className="text-[#38BDF8]">{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === m.id
                        ? 'border-[#38BDF8] bg-[#1D4ED8]'
                        : 'border-[#93C5FD]/30'
                    }`}
                  >
                    {selectedMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#93C5FD]/70 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>Secure 256-bit encrypted simulated deposit</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || amount <= 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#1D4ED8]/30 transition-all disabled:opacity-50 border border-[#38BDF8]/40"
          >
            {loading ? 'Processing Deposit...' : `CONFIRM DEPOSIT (${amount} ${wallet.currency})`}
          </button>
        </form>
      </div>
    </div>
  );
};
