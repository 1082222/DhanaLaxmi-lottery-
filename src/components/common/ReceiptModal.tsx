import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency, SUPPORTED_COUNTRIES } from '../../constants/countries';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeReceipt) return null;

  const countryInfo = SUPPORTED_COUNTRIES[activeReceipt.country];
  const formattedDate = activeReceipt.createdAt.split(' ')[0] || activeReceipt.createdAt;
  const formattedTime = activeReceipt.createdAt.split(' ')[1] || '12:00';
  const receiptCode = `RCP-${activeReceipt.ticketNumber}-${activeReceipt.entryId.replace('EN-', '')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptCode);
    setCopied(true);
    showToast('Receipt Reference ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#171114] border border-[#D4A017]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Actions */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#4A0E18] to-[#320912] border-b border-[#D4A017]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5C542]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F8E7B0]">
              Official Digital Receipt
            </span>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
            className="p-1 rounded-lg text-[#F8E7B0]/70 hover:text-white hover:bg-[#6B1524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Receipt Area */}
        <div className="p-5 overflow-y-auto flex-1">
          <div
            id="printable-receipt"
            className="bg-gradient-to-b from-[#320912] via-[#24060c] to-[#171114] border-2 border-[#D4A017] rounded-2xl p-5 relative shadow-inner text-[#FFF8E7]"
          >
            {/* Watermark/Emblem */}
            <div className="text-center pb-4 border-b border-dashed border-[#D4A017]/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5C542] to-[#7F1D2D] p-0.5 mb-2 shadow-md shadow-[#D4A017]/30">
                <div className="w-full h-full bg-[#320912] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#F5C542]" />
                </div>
              </div>
              <h2 className="text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display">
                DHANALAXMI LOTTERY
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[#D4A017] font-semibold mt-0.5">
                Official Entry Voucher • Dhanalaxmi Lottery Result
              </p>
            </div>

            {/* Lucky Number Highlight */}
            <div className="my-4 py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A0E18] to-[#6B1524] border border-[#F5C542]/40 text-center shadow-md">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#F8E7B0]">
                Selected Lucky Number
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                {activeReceipt.selectedNumber.split('').map((digit, i) => (
                  <div
                    key={i}
                    className="w-11 h-12 rounded-xl bg-[#171114] border-2 border-[#D4A017] flex items-center justify-center text-2xl font-black text-[#F5C542] shadow-inner font-mono"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#F8E7B0]/70 mt-1.5 font-medium">
                Multiplier: {activeReceipt.multiplier}x • Potential Win:{' '}
                <span className="text-[#F5C542] font-bold">
                  {formatCurrency(activeReceipt.potentialWinning, activeReceipt.currency)}
                </span>
              </p>
            </div>

            {/* Receipt Table Fields */}
            <div className="space-y-2 text-xs divide-y divide-[#7F1D2D]/30">
              <div className="flex justify-between py-1 pt-2">
                <span className="text-[#F8E7B0]/70 font-medium">Ticket ID</span>
                <span className="font-mono font-bold text-[#F5C542]">{activeReceipt.ticketNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Entry ID</span>
                <span className="font-mono font-medium text-[#FFF8E7]">{activeReceipt.entryId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Customer Name</span>
                <span className="font-semibold text-[#FFF8E7]">{activeReceipt.userName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Country / Currency</span>
                <span className="font-medium text-[#FFF8E7]">
                  {countryInfo?.flag} {countryInfo?.name} ({activeReceipt.currency})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Stake Amount</span>
                <span className="font-mono font-bold text-[#FFF8E7]">
                  {formatCurrency(activeReceipt.stakeAmount, activeReceipt.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Draw Target Date</span>
                <span className="font-medium text-[#F8E7B0]">{activeReceipt.drawDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#F8E7B0]/70 font-medium">Issued Date & Time</span>
                <span className="font-mono text-[#FFF8E7]/90">{formattedDate} {formattedTime}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-[#F8E7B0]/70 font-medium">Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    activeReceipt.status === 'WINNER'
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500'
                      : activeReceipt.status === 'NOT_MATCHED'
                      ? 'bg-red-950/60 text-red-300 border-red-800'
                      : 'bg-[#D4A017]/20 text-[#F5C542] border-[#D4A017]'
                  }`}
                >
                  {activeReceipt.status === 'WINNER' ? '🏆 WINNER' : activeReceipt.status}
                </span>
              </div>
            </div>

            {/* Barcode & Reference Code Area */}
            <div className="mt-5 pt-4 border-t border-dashed border-[#D4A017]/40 text-center">
              {/* Simulated barcode stripes */}
              <div className="bg-white p-2 rounded-lg inline-block w-full max-w-xs shadow-sm">
                <div className="flex justify-between items-center h-10 px-2 overflow-hidden">
                  {[2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 4].map(
                    (w, idx) => (
                      <div
                        key={idx}
                        className="bg-black h-full"
                        style={{ width: `${w * 2.5}px` }}
                      />
                    )
                  )}
                </div>
                <p className="text-[10px] font-mono text-black font-semibold tracking-widest mt-1">
                  {receiptCode}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] text-[#F8E7B0]/60 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Digitally Authenticated Dhanalaxmi Ledger Entry</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#320912] border-t border-[#D4A017]/30 grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#4A0E18] hover:bg-[#6B1524] border border-[#D4A017]/40 text-[#F8E7B0] text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Receipt ID'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F5C542] hover:brightness-110 text-[#320912] text-xs font-bold shadow-md shadow-[#D4A017]/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
