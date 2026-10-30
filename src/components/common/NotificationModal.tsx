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
        return <Trophy className="w-5 h-5 text-[#38BDF8]" />;
      case 'ENTRY':
        return <Ticket className="w-5 h-5 text-[#60A5FA]" />;
      case 'WITHDRAWAL':
        return <ArrowDownCircle className="w-5 h-5 text-emerald-400" />;
      case 'WALLET':
      default:
        return <Wallet className="w-5 h-5 text-[#93C5FD]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#071833] border-t sm:border border-[#1E40AF]/60 sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0D2E68] to-[#071833] border-b border-[#1E40AF]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1E40AF] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">Notification Center</h3>
              <p className="text-[11px] text-[#93C5FD]">Updates, draw alerts & winning notices</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotifsAsRead}
                className="px-2.5 py-1 text-xs font-semibold text-[#38BDF8] hover:bg-[#1E40AF] rounded-lg border border-[#38BDF8]/40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationModalOpen(false)}
              className="p-1.5 rounded-lg text-[#93C5FD] hover:text-white hover:bg-[#1E40AF]/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-[#1E40AF]/50 mx-auto mb-3" />
              <p className="text-[#BAE6FD] font-medium text-sm">No notifications yet</p>
              <p className="text-xs text-[#93C5FD]/60 mt-1">
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
                    ? 'bg-[#050E1D]/80 border-[#1E40AF]/40 text-blue-100/80'
                    : 'bg-[#0D2E68]/80 border-[#38BDF8]/60 shadow-md shadow-[#1D4ED8]/20 text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-[#050E1D] border border-[#1E40AF]/50">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          n.type === 'WINNER' ? 'text-[#38BDF8]' : 'text-white'
                        }`}
                      >
                        {n.title}
                      </h4>
                    </div>
                    <p className="text-xs text-blue-100 mt-1 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#38BDF8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
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
        <div className="p-3 bg-[#050E1D]/90 border-t border-[#1E40AF]/40 text-center">
          <p className="text-[11px] text-[#93C5FD]">Thailand Lottery Notification Center</p>
        </div>
      </div>
    </div>
  );
};
