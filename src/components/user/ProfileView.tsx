import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  Phone,
  ShieldAlert,
  LogOut,
  Bell,
  Landmark,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { SUPPORTED_COUNTRIES } from '../../constants/countries';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    currentAdmin,
    logout,
    setIsAdminMode,
    setIsNotificationModalOpen,
    setUserSubView,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();

  if (!currentUser) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        <div className="px-1">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            User Profile
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            Account information, regional settings & security controls
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#050E1D] border border-[#38BDF8]/40 mx-auto flex items-center justify-center text-[#38BDF8]">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">You are not logged in</h3>
            <p className="text-xs text-blue-200/70 max-w-xs mx-auto mt-1">
              Log in to view your profile, manage verified bank details, and track your lottery activity.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#071833] border border-[#1E40AF] text-[#38BDF8] font-bold text-xs uppercase tracking-wider hover:bg-[#0A224E] cursor-pointer"
            >
              <span>Register</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const countryInfo = SUPPORTED_COUNTRIES[currentUser.country];

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
          User Profile
        </h2>
        <p className="text-xs text-blue-200/70 mt-0.5">
          Account information, regional settings & security controls
        </p>
      </div>

      {/* User Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#1E40AF] to-[#071833] border-2 border-[#38BDF8]/60 p-5 shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#38BDF8] p-0.5 shadow-lg shadow-blue-500/30 shrink-0">
          <div className="w-full h-full bg-[#071833] rounded-[14px] flex items-center justify-center text-[#38BDF8] text-2xl font-black uppercase">
            {currentUser.fullName.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate font-display">
            {currentUser.fullName}
          </h3>
          <p className="text-xs text-blue-200/80 font-mono mt-0.5 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-[#38BDF8]" />
            <span>{currentUser.mobile}</span>
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-blue-200">
            <span>{countryInfo?.flag} {countryInfo?.name}</span>
            <span>•</span>
            <span className="font-bold text-[#38BDF8]">{currentUser.currency}</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Links */}
      <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 overflow-hidden shadow-lg divide-y divide-[#1E40AF]/40 text-xs">
        <button
          onClick={() => setUserSubView('BANK_KYC')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#0B3B7A]/40 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#050E1D] border border-[#1E40AF]/50 flex items-center justify-center text-[#38BDF8]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Bank Details & KYC</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-mono font-bold">
                  LOCKED
                </span>
              </div>
              <div className="text-[11px] text-blue-200/60">View locked registered bank details & KYC documents</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-300/50" />
        </button>

        <button
          onClick={() => setIsNotificationModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#0B3B7A]/40 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#050E1D] border border-[#1E40AF]/50 flex items-center justify-center text-[#38BDF8]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Notification Center</div>
              <div className="text-[11px] text-blue-200/60">Alerts, draw declarations and results</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-300/50" />
        </button>

        {/* Admin Portal Switcher (Only visible to admin accounts) */}
        {currentAdmin && (
          <button
            onClick={() => setIsAdminMode(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#0B3B7A]/40 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0B3B7A] border border-[#38BDF8]/50 flex items-center justify-center text-[#38BDF8]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#38BDF8] flex items-center gap-1.5">
                  <span>Thailand Lottery Admin Portal</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1D4ED8]/30 border border-[#38BDF8]/40 text-[#38BDF8]">
                    OFFICER
                  </span>
                </div>
                <div className="text-[11px] text-blue-200/60">Declare results, payouts, and user management</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#38BDF8]" />
          </button>
        )}
      </div>

      {/* Logout Button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl bg-red-950/60 hover:bg-red-950 border border-red-800/60 text-red-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );
};
