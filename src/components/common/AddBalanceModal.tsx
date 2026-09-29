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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#171114] border-t sm:border border-[#D4A017]/40 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#4A0E18] to-[#320912] border-b border-[#D4A017]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6B1524] border border-[#D4A017]/50 flex items-center justify-center text-[#F5C542]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FFF8E7] font-display">Add Wallet Balance</h3>
              <p className="text-[11px] text-[#F8E7B0]/70">Instant deposit to play Dhanalaxmi Lucky Draw</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddBalanceModalOpen(false)}
            className="p-1.5 rounded-lg text-[#F8E7B0]/70 hover:text-white hover:bg-[#6B1524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="px-5 py-3 bg-[#320912]/80 border-b border-[#7F1D2D]/40 flex justify-between items-center text-xs">
          <span className="text-[#F8E7B0]/80">Current Available Balance</span>
          <span className="font-mono font-bold text-[#F5C542] text-sm">
            {formatCurrency(wallet.balance, wallet.currency)}
          </span>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Amounts */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#F8E7B0]/80 mb-2">
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
                        ? 'bg-gradient-to-br from-[#D4A017] to-[#F5C542] text-[#320912] border-[#FFF8E7] shadow-md scale-[1.02]'
                        : 'bg-[#320912] border-[#7F1D2D]/60 text-[#F8E7B0] hover:border-[#D4A017]/60'
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
            <label className="block text-xs font-semibold text-[#F8E7B0]/80 mb-1.5">
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
                className="w-full py-3 pl-4 pr-16 bg-[#320912] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] font-mono text-base focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542]"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#D4A017]">
                {wallet.currency}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#F8E7B0]/80 mb-2">
              Payment Gateway
            </label>
            <div className="space-y-2">
              {[
                { id: 'CARD', label: 'Debit / Credit Card (Visa / Mastercard)', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'NET_BANKING', label: 'GCC Regional Direct Debit (Mada / KNet / Benefit)', icon: <CheckCircle2 className="w-4 h-4" /> },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === m.id
                      ? 'bg-[#4A0E18] border-[#D4A017] text-[#FFF8E7]'
                      : 'bg-[#320912]/60 border-[#7F1D2D]/40 text-[#F8E7B0]/70 hover:border-[#D4A017]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <span className="text-[#F5C542]">{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === m.id
                        ? 'border-[#F5C542] bg-[#D4A017]'
                        : 'border-[#F8E7B0]/30'
                    }`}
                  >
                    {selectedMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-[#320912]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#F8E7B0]/70 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
            <span>Secure 256-bit encrypted simulated deposit</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || amount <= 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#D4A017]/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing Deposit...' : `CONFIRM DEPOSIT (${amount} ${wallet.currency})`}
          </button>
        </form>
      </div>
    </div>
  );
};
