import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-in slide-in-from-top-4 duration-300 ${
            toast.type === 'success'
              ? 'bg-[#320912]/95 border-[#D4A017] text-[#FFF8E7]'
              : toast.type === 'error'
              ? 'bg-[#4A0E18]/95 border-red-500/60 text-red-100'
              : 'bg-[#171114]/95 border-[#7F1D2D] text-[#FFF8E7]'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#F5C542] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#D4A017] shrink-0" />}
            <span className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:bg-white/10 rounded-lg text-[#F8E7B0]/70 hover:text-[#FFF8E7] transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
