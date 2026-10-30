import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, ShieldAlert, User as UserIcon, Wallet as WalletIcon, ChevronDown, Check, X } from 'lucide-react';
import { SUPPORTED_COUNTRIES, COUNTRY_LIST, formatCurrency } from '../../constants/countries';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentAdmin,
    wallet,
    selectedCountry,
    setSelectedCountry,
    unreadCount,
    setIsNotificationModalOpen,
    setIsAdminMode,
    isAdminMode,
    setActiveTab,
    setUserSubView,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();

  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const activeCountryCode = currentUser ? currentUser.country : selectedCountry;
  const countryInfo = SUPPORTED_COUNTRIES[activeCountryCode] || SUPPORTED_COUNTRIES['TH'];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#071833] via-[#0B254E] to-[#071833] border-b border-[#1E40AF]/50 shadow-lg backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Brand & Uploaded Logo */}
          <div
            onClick={() => {
              if (isAdminMode) setIsAdminMode(false);
              setActiveTab('HOME');
              setUserSubView('DASHBOARD');
            }}
            className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#1E40AF] via-[#0284C7] to-[#38BDF8] p-[1.5px] shadow-md shadow-[#1D4ED8]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#071833] rounded-[10px] p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/Logo_of_the_Government_Lottery_Office_f8d13cfa.svg"
                  alt="Thailand Lottery Logo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wide text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8] font-display leading-tight">
                THAILAND LOTTERY
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#93C5FD] font-semibold tracking-wider uppercase">
                THAILAND LOTTERY RESULT
              </span>
            </div>
          </div>

          {/* Right Controls: Country, Wallet, Bell, Admin, Profile/Login */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Country Selector Button */}
            <button
              id="header-country-btn"
              onClick={() => setIsCountryPickerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#050E1D]/80 border border-[#1E40AF]/50 hover:border-[#38BDF8] text-xs transition-colors cursor-pointer"
              title="Change Country"
            >
              <span className="text-sm">{countryInfo.flag}</span>
              <span className="font-bold text-[#BAE6FD] text-[11px] hidden xs:inline">{countryInfo.currency}</span>
              <ChevronDown className="w-3 h-3 text-[#38BDF8]" />
            </button>

            {/* TOP RIGHT CORNER: WALLET DISPLAY */}
            <button
              id="header-wallet-btn"
              onClick={() => {
                if (isAdminMode) setIsAdminMode(false);
                if (currentUser) {
                  setUserSubView('WALLET');
                  setActiveTab('HOME');
                } else {
                  setAuthMode('LOGIN');
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#0D2E68] via-[#1D4ED8] to-[#0D2E68] border border-[#38BDF8]/60 hover:border-[#38BDF8] hover:brightness-110 text-[#F0F7FF] transition-all shadow-md shadow-[#1D4ED8]/30 active:scale-95 cursor-pointer"
              title="Wallet Balance - Click to View"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#050E1D] border border-[#38BDF8]/60 flex items-center justify-center text-[#38BDF8] shadow-sm flex-shrink-0">
                <WalletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[8px] sm:text-[9px] text-[#BAE6FD] font-black tracking-wider uppercase">
                  WALLET
                </span>
                <span className="text-xs sm:text-sm font-black text-white font-mono tracking-tight">
                  {currentUser && wallet
                    ? formatCurrency(wallet.balance, wallet.currency)
                    : formatCurrency(0, countryInfo.currency)}
                </span>
              </div>
            </button>

            {/* Notifications Bell */}
            <button
              id="header-bell-btn"
              onClick={() => setIsNotificationModalOpen(true)}
              aria-label="Notifications"
              className="relative p-1.5 sm:p-2 rounded-xl bg-[#050E1D]/80 hover:bg-[#1E40AF]/60 border border-[#1E40AF]/50 text-[#BAE6FD] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#38BDF8]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce border border-[#38BDF8]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Admin Switch Shortcut */}
            <button
              id="header-admin-btn"
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false);
                } else if (currentAdmin) {
                  setIsAdminMode(true);
                } else {
                  setAuthMode('ADMIN_LOGIN');
                  setIsAuthModalOpen(true);
                }
              }}
              title={isAdminMode ? 'Back to User App' : 'Switch to Admin Portal'}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-gradient-to-r from-[#1D4ED8] to-[#0284C7] text-white border-[#38BDF8] shadow-md shadow-blue-500/30 font-bold'
                  : 'bg-[#050E1D]/80 text-[#93C5FD] border border-[#1E40AF]/50 hover:border-[#38BDF8]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden md:inline">{isAdminMode ? 'Exit Admin' : 'Admin'}</span>
            </button>

            {/* Profile / Login Button */}
            {currentUser ? (
              <button
                id="header-profile-btn"
                onClick={() => {
                  if (isAdminMode) setIsAdminMode(false);
                  setActiveTab('PROFILE');
                }}
                className="p-1 sm:p-1.5 rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#0A224E] border border-[#38BDF8]/50 hover:border-white text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#071833] text-[#38BDF8] font-bold text-xs flex items-center justify-center uppercase border border-[#38BDF8]/40">
                  {currentUser.fullName.charAt(0)}
                </div>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setIsAuthModalOpen(true);
                }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] text-white font-bold text-xs shadow-md shadow-[#1D4ED8]/30 hover:brightness-110 flex items-center gap-1 transition-all border border-[#38BDF8]/50 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Country Selection Modal */}
      {isCountryPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#0A224E] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] rounded-3xl p-5 w-full max-w-sm text-center shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E40AF]/40 mb-3">
              <div className="text-left">
                <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BAE6FD] to-[#38BDF8]">
                  Select Country & Currency
                </h3>
                <p className="text-[11px] text-[#93C5FD]">Choose your country for tickets and lottery draws</p>
              </div>
              <button
                onClick={() => setIsCountryPickerOpen(false)}
                className="p-1 rounded-full bg-[#050E1D]/80 text-[#93C5FD] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {COUNTRY_LIST.map((c) => {
                const isSelected = activeCountryCode === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c.code);
                      setIsCountryPickerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1E40AF] to-[#0A224E] border-[#38BDF8] shadow-md shadow-[#1D4ED8]/30'
                        : 'bg-[#050E1D]/90 border-[#1E40AF]/40 hover:border-[#38BDF8]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-[#38BDF8] font-mono">
                          Currency: {c.currency} ({c.currencySymbol}) • {c.phonePrefix}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#38BDF8]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
