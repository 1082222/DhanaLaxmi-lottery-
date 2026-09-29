import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, Trophy, Ticket, ArrowDownCircle, Wallet } from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead,
  } = useApp();

  if (!isNotificationModalOpen) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'WINNER':
        return <Trophy className="w-5 h-5 text-[#F5C542]" />;
      case 'ENTRY':
        return <Ticket className="w-5 h-5 text-[#D4A017]" />;
      case 'WITHDRAWAL':
        return <ArrowDownCircle className="w-5 h-5 text-amber-400" />;
      case 'WALLET':
      default:
        return <Wallet className="w-5 h-5 text-[#F8E7B0]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#320912] border-t sm:border border-[#D4A017]/40 sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#4A0E18] to-[#320912] border-b border-[#D4A017]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6B1524] border border-[#D4A017]/40 flex items-center justify-center text-[#F5C542]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FFF8E7] font-display">Notification Center</h3>
              <p className="text-[11px] text-[#F8E7B0]/70">Updates, draw alerts & winning notices</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotifsAsRead}
                className="px-2.5 py-1 text-xs font-semibold text-[#F5C542] hover:bg-[#6B1524] rounded-lg border border-[#D4A017]/30 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationModalOpen(false)}
              className="p-1.5 rounded-lg text-[#F8E7B0]/70 hover:text-white hover:bg-[#4A0E18] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-[#D4A017]/30 mx-auto mb-3" />
              <p className="text-[#F8E7B0] font-medium text-sm">No notifications yet</p>
              <p className="text-xs text-[#F8E7B0]/50 mt-1">
                You'll receive notices when draws conclude or tickets win!
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotifAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-[#171114]/60 border-[#7F1D2D]/40 text-[#FFF8E7]/80'
                    : 'bg-[#4A0E18]/80 border-[#D4A017]/60 shadow-md shadow-[#D4A017]/10 text-[#FFF8E7]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'WINNER'
                        ? 'bg-gradient-to-br from-[#D4A017] to-[#7F1D2D] text-[#320912]'
                        : 'bg-[#320912] border border-[#D4A017]/30'
                    }`}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          n.type === 'WINNER' ? 'text-[#F5C542]' : 'text-[#FFF8E7]'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-[#F8E7B0]/50 whitespace-nowrap">
                        {n.timestamp.split(' ')[1] || n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#FFF8E7]/90 mt-1 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#F5C542]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                        <span>NEW</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#171114]/80 border-t border-[#7F1D2D]/40 text-center">
          <p className="text-[11px] text-[#F8E7B0]/60">Dhanalaxmi Lottery Notification Center</p>
        </div>
      </div>
    </div>
  );
};
