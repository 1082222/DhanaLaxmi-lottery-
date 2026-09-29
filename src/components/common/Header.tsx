import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, ShieldAlert, Sparkles, User as UserIcon, Wallet as WalletIcon, ChevronDown, Check, X } from 'lucide-react';
import { SUPPORTED_COUNTRIES, COUNTRY_LIST, formatCurrency } from '../../constants/countries';
import { SupportedCountryCode } from '../../types';

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
    setIsAddBalanceModalOpen,
  } = useApp();

  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const activeCountryCode = currentUser ? currentUser.country : selectedCountry;
  const countryInfo = SUPPORTED_COUNTRIES[activeCountryCode] || SUPPORTED_COUNTRIES['IN'];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#320912] via-[#4A0E18] to-[#320912] border-b border-[#D4A017]/30 shadow-lg backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Brand & Logo */}
          <div
            onClick={() => {
              if (isAdminMode) setIsAdminMode(false);
              setActiveTab('HOME');
              setUserSubView('DASHBOARD');
            }}
            className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F5C542] via-[#D4A017] to-[#7F1D2D] p-[1.5px] shadow-md shadow-[#D4A017]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#320912] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5C542] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wide text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542] font-display leading-tight">
                DHANALAXMI LOTTERY
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#F8E7B0]/85 font-semibold tracking-wider uppercase">
                DHANALAXMI LOTTERY RESULT
              </span>
            </div>
          </div>

          {/* Right Controls: Country, Wallet (Top Right Corner), Bell, Profile/Login */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Country Selector Button */}
            <button
              id="header-country-btn"
              onClick={() => setIsCountryPickerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#171114]/70 border border-[#D4A017]/30 hover:border-[#D4A017] text-xs transition-colors"
              title="Change Country"
            >
              <span className="text-sm">{countryInfo.flag}</span>
              <span className="font-bold text-[#F8E7B0] text-[11px] hidden xs:inline">{countryInfo.currency}</span>
              <ChevronDown className="w-3 h-3 text-[#D4A017]" />
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#5B101D] via-[#7F1D2D] to-[#5B101D] border border-[#F5C542]/70 hover:border-[#F5C542] hover:brightness-110 text-[#FFF8E7] transition-all shadow-md shadow-[#D4A017]/20 active:scale-95 cursor-pointer"
              title="Wallet Balance - Click to View"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-[#F5C542] to-[#D4A017] flex items-center justify-center text-[#320912] shadow-sm flex-shrink-0">
                <WalletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#320912]" />
              </div>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[8px] sm:text-[9px] text-[#F8E7B0]/90 font-black tracking-wider uppercase">
                  WALLET
                </span>
                <span className="text-xs sm:text-sm font-black text-[#F5C542] font-mono tracking-tight">
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
              className="relative p-1.5 sm:p-2 rounded-xl bg-[#171114]/60 hover:bg-[#6B1524]/60 border border-[#D4A017]/30 text-[#F8E7B0] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
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
                  ? 'bg-[#D4A017] text-[#320912] border-[#F5C542] shadow-md shadow-[#D4A017]/30 font-bold'
                  : 'bg-[#171114]/60 text-[#F8E7B0] border-[#D4A017]/30 hover:border-[#D4A017]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#F5C542]" />
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
                className="p-1 sm:p-1.5 rounded-xl bg-gradient-to-br from-[#6B1524] to-[#4A0E18] border border-[#D4A017]/50 hover:border-[#F5C542] text-[#FFF8E7] flex items-center gap-1.5 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-[#D4A017] text-[#320912] font-bold text-xs flex items-center justify-center uppercase">
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
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F5C542] text-[#320912] font-bold text-xs shadow-md shadow-[#D4A017]/20 hover:brightness-110 flex items-center gap-1 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#4A0E18] via-[#320912] to-[#171114] border-2 border-[#D4A017] rounded-3xl p-5 w-full max-w-sm text-center shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#D4A017]/30 mb-3">
              <div className="text-left">
                <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8E7B0] to-[#F5C542]">
                  Select Country & Currency
                </h3>
                <p className="text-[11px] text-[#F8E7B0]/70">Choose your country for tickets and lottery draws</p>
              </div>
              <button
                onClick={() => setIsCountryPickerOpen(false)}
                className="p-1 rounded-full bg-[#171114]/60 text-[#F8E7B0] hover:text-white"
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
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#6B1524] to-[#4A0E18] border-[#F5C542] shadow-md shadow-[#D4A017]/20'
                        : 'bg-[#171114]/80 border-[#7F1D2D]/40 hover:border-[#D4A017]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-[#FFF8E7]">{c.name}</div>
                        <div className="text-[10px] text-[#F5C542] font-mono">
                          Currency: {c.currency} ({c.currencySymbol}) • {c.phonePrefix}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#F5C542]" />}
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
