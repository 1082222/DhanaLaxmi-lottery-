import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency, SUPPORTED_COUNTRIES } from '../../constants/countries';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeReceipt) return null;

  const countryInfo = SUPPORTED_COUNTRIES[activeReceipt.country];
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
      <div className="w-full max-w-md bg-[#050E1D] border border-[#1E40AF]/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Actions */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#0B254E] to-[#071833] border-b border-[#1E40AF]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#BAE6FD]">
              Official Digital Receipt
            </span>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
            className="p-1 rounded-lg text-blue-300 hover:text-white hover:bg-[#1E40AF]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Receipt Area */}
        <div className="p-5 overflow-y-auto flex-1">
          <div
            id="printable-receipt"
            className="bg-gradient-to-b from-[#0A224E] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] rounded-2xl p-5 relative shadow-inner text-[#F0F7FF]"
          >
            {/* Watermark/Emblem */}
            <div className="text-center pb-4 border-b border-dashed border-[#1E40AF]/60">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#0284C7] p-0.5 mb-2 shadow-md shadow-[#1D4ED8]/30">
                <div className="w-full h-full bg-[#071833] rounded-[14px] p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
                    alt="Thailand Lottery"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h2 className="text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8] font-display">
                THAILAND LOTTERY
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[#38BDF8] font-semibold mt-0.5">
                Official Entry Voucher • 1 × 400 Price Money
              </p>
            </div>

            {/* Lucky Number Highlight */}
            <div className="my-4 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0D2E68] to-[#1E40AF] border border-[#38BDF8]/40 text-center shadow-md">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#BAE6FD]">
                Selected Lucky Number
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                {activeReceipt.selectedNumber.split('').map((digit, i) => (
                  <div
                    key={i}
                    className="w-11 h-12 rounded-xl bg-[#050E1D] border-2 border-[#38BDF8] flex items-center justify-center text-2xl font-black text-white shadow-inner font-mono"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#BAE6FD] mt-1.5 font-bold">
                1 × 400 Price Money • Potential Win:{' '}
                <span className="text-white font-black">
                  {formatCurrency(activeReceipt.potentialWinning, activeReceipt.currency)}
                </span>
              </p>
            </div>

            {/* Receipt Table Fields */}
            <div className="space-y-2 text-xs divide-y divide-[#1E40AF]/40">
              <div className="flex justify-between py-1 pt-2">
                <span className="text-[#93C5FD] font-medium">Ticket ID</span>
                <span className="font-mono font-bold text-white">{activeReceipt.ticketNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#93C5FD] font-medium">Entry ID</span>
                <span className="font-mono font-medium text-white">{activeReceipt.entryId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#93C5FD] font-medium">Customer Name</span>
                <span className="font-semibold text-white">{activeReceipt.userName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#93C5FD] font-medium">Country / Currency</span>
                <span className="font-medium text-white">
                  {countryInfo?.flag} {countryInfo?.name} ({activeReceipt.currency})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#93C5FD] font-medium">Stake Amount</span>
                <span className="font-mono font-bold text-white">
                  {formatCurrency(activeReceipt.stakeAmount, activeReceipt.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#93C5FD] font-medium">Draw Round</span>
                <span className="font-medium text-[#38BDF8] font-bold">{activeReceipt.drawId}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-[#93C5FD] font-medium">Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    activeReceipt.status === 'WINNER'
                      ? 'bg-emerald-900/70 text-emerald-300 border-emerald-500'
                      : activeReceipt.status === 'NOT_MATCHED'
                      ? 'bg-red-950/70 text-red-300 border-red-800'
                      : 'bg-[#1E40AF]/50 text-[#38BDF8] border-[#38BDF8]'
                  }`}
                >
                  {activeReceipt.status === 'WINNER' ? '🏆 WINNER' : activeReceipt.status}
                </span>
              </div>
            </div>

            {/* Barcode & Reference Code Area */}
            <div className="mt-5 pt-4 border-t border-dashed border-[#1E40AF]/60 text-center">
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

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-200/70 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Thailand Government Certified Electronic Wagering Receipt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-4 bg-[#071833] border-t border-[#1E40AF]/40 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B254E] hover:bg-[#1E40AF] border border-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#38BDF8]" />
                <span>Copy Ref ID</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#38BDF8]/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
