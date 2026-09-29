import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Lock, Phone, CreditCard, Globe, CheckCircle2, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { COUNTRY_LIST } from '../../constants/countries';
import { SupportedCountryCode } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    selectedCountry,
    setSelectedCountry,
    showToast,
  } = useApp();

  // Unified Login state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCountry, setRegCountry] = useState<SupportedCountryCode>(selectedCountry || 'IN');
  const [regAccountHolder, setRegAccountHolder] = useState('');
  const [regBankName, setRegBankName] = useState('');
  const [regIban, setRegIban] = useState('');
  const [regSwift, setRegSwift] = useState('');
  const [showBankFields, setShowBankFields] = useState(true);

  const [loading, setLoading] = useState(false);
  const [regSuccessMessage, setRegSuccessMessage] = useState(false);

  // Keep country in sync with global selectedCountry
  useEffect(() => {
    if (selectedCountry) {
      setRegCountry(selectedCountry);
    }
  }, [selectedCountry]);

  if (!isAuthModalOpen) return null;

  const currentCountryConfig = COUNTRY_LIST.find((c) => c.code === regCountry) || COUNTRY_LIST[0];

  // Unified Login: Admin & User Login in the EXACT same screen
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMobile.trim()) {
      showToast('Please enter your mobile number', 'error');
      return;
    }
    setLoading(true);
    await login(loginMobile.trim(), loginPassword);
    setLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!regFullName.trim() || !regMobile.trim()) {
      showToast('Please enter your name and mobile number.', 'error');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: regFullName.trim(),
      mobile: regMobile.trim(),
      password: regPassword,
      country: regCountry,
      currency: currentCountryConfig.currency,
      bankDetails: {
        accountHolder: regAccountHolder || regFullName.trim(),
        bankName: regBankName || 'Commercial Bank',
        accountNumberOrIban: regIban || '000012345678',
        ifscOrSwift: regSwift || 'SBIN0001234',
      },
    });
    setLoading(false);

    if (res.success) {
      setRegSuccessMessage(true);
      setTimeout(() => {
        setRegSuccessMessage(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-[#2A070E] via-[#1C050A] to-[#120306] border-2 border-[#D4A017] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#4A0E18] via-[#5B101D] to-[#320912] border-b border-[#D4A017]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F5C542] to-[#D4A017] p-0.5 shadow-md shadow-[#D4A017]/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#320912] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F5C542]" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base text-[#FFF8E7] font-display leading-tight tracking-wide">
                DHANALAXMI LOTTERY
              </h3>
              <p className="text-[11px] text-[#F8E7B0]/80 font-medium">
                {authMode === 'REGISTER'
                  ? 'Create New Account'
                  : 'Sign In (User & Admin)'}
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-[#F8E7B0]/70 hover:text-white hover:bg-[#6B1524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* UNIFIED INTERFACE: Only 2 simple tabs (Login or Register) */}
        <div className="flex border-b border-[#7F1D2D]/60 bg-[#171114] text-xs font-bold">
          <button
            id="auth-tab-login"
            onClick={() => setAuthMode('LOGIN')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-2 ${
              authMode !== 'REGISTER'
                ? 'text-[#F5C542] border-b-2 border-[#F5C542] bg-[#4A0E18]/60 font-black'
                : 'text-[#F8E7B0]/60 hover:text-[#FFF8E7]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button
            id="auth-tab-register"
            onClick={() => setAuthMode('REGISTER')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-2 ${
              authMode === 'REGISTER'
                ? 'text-[#F5C542] border-b-2 border-[#F5C542] bg-[#4A0E18]/60 font-black'
                : 'text-[#F8E7B0]/60 hover:text-[#FFF8E7]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {regSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <h4 className="font-bold text-sm">Account Created Successfully!</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">Starting wallet balance is 0.00</p>
            </div>
          )}

          {/* UNIFIED LOGIN: Clean, secure login form */}
          {authMode !== 'REGISTER' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Mobile / ID Field */}
              <div>
                <label className="block text-xs font-bold text-[#F8E7B0] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#D4A017] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-mobile-input"
                    type="text"
                    required
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full py-3 pl-10 pr-4 bg-[#2A070E] border-2 border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-sm font-semibold focus:outline-none focus:border-[#F5C542] placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-[#F8E7B0] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#D4A017] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full py-3 pl-10 pr-11 bg-[#2A070E] border-2 border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-sm font-semibold focus:outline-none focus:border-[#F5C542] placeholder:text-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A017] hover:text-[#F5C542] p-1"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Big Gold Login Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 active:scale-[0.99] text-[#320912] font-black text-sm tracking-wider uppercase shadow-xl shadow-[#D4A017]/25 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'LOGIN NOW'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#F8E7B0]/60">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('REGISTER')}
                  className="text-xs font-black text-[#F5C542] hover:underline"
                >
                  Create Account Here
                </button>
              </div>
            </form>
          )}

          {/* REGISTER NEW ACCOUNT */}
          {authMode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Notice: Starting wallet balance is 0 */}
              <div className="p-2.5 rounded-xl bg-[#320912] border border-[#D4A017]/40 text-center">
                <span className="text-xs font-bold text-[#F5C542]">New Wallet Balance: 0.00</span>
                <p className="text-[10px] text-[#F8E7B0]/80">Account starts with 0 balance. Add funds anytime to play!</p>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-bold text-[#F8E7B0] mb-1">
                  Country & Currency
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#D4A017] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="register-country-select"
                    value={regCountry}
                    onChange={(e) => {
                      const code = e.target.value as SupportedCountryCode;
                      setRegCountry(code);
                      setSelectedCountry(code);
                    }}
                    className="w-full py-2.5 pl-9 pr-3 bg-[#2A070E] border-2 border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs font-bold focus:outline-none focus:border-[#F5C542]"
                  >
                    {COUNTRY_LIST.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currency} - {c.currencySymbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#F8E7B0] mb-1">
                  Full Name *
                </label>
                <input
                  id="register-name-input"
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full py-2.5 px-3 bg-[#2A070E] border-2 border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs font-semibold focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-[#F8E7B0] mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#D4A017] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-mobile-input"
                    type="tel"
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder={`e.g. ${currentCountryConfig.phonePrefix} 9876543210`}
                    className="w-full py-2.5 pl-9 pr-3 bg-[#2A070E] border-2 border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs font-semibold focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#F8E7B0] mb-1">
                    Password *
                  </label>
                  <input
                    id="register-pass-input"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F8E7B0] mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="register-confirm-pass-input"
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/40 rounded-xl text-[#FFF8E7] text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              {/* Bank Details for Payouts (Locked after creation) */}
              <div className="pt-2 border-t border-[#7F1D2D]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5C542]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Bank Account for Payouts</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked Once Set</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1A0408] border border-[#D4A017]/30 text-[11px] text-[#F8E7B0]/80">
                  <span className="font-bold text-[#F5C542]">Security Notice:</span> Bank details and profile information cannot be changed after creating the account. Please enter your genuine payout details.
                </div>

                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#F8E7B0]/90 mb-0.5">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regAccountHolder}
                        onChange={(e) => setRegAccountHolder(e.target.value)}
                        placeholder="e.g. Full Legal Name"
                        className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/30 rounded-lg text-[#FFF8E7] text-xs focus:outline-none focus:border-[#F5C542]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#F8E7B0]/90 mb-0.5">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regBankName}
                        onChange={(e) => setRegBankName(e.target.value)}
                        placeholder="e.g. National Bank / SBI"
                        className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/30 rounded-lg text-[#FFF8E7] text-xs focus:outline-none focus:border-[#F5C542]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#F8E7B0]/90 mb-0.5">
                        Account Number / IBAN *
                      </label>
                      <input
                        type="text"
                        required
                        value={regIban}
                        onChange={(e) => setRegIban(e.target.value)}
                        placeholder="Account or IBAN number"
                        className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/30 rounded-lg text-[#FFF8E7] text-xs font-mono focus:outline-none focus:border-[#F5C542]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#F8E7B0]/90 mb-0.5">
                        IFSC / SWIFT Code
                      </label>
                      <input
                        type="text"
                        value={regSwift}
                        onChange={(e) => setRegSwift(e.target.value)}
                        placeholder="IFSC or SWIFT/BIC"
                        className="w-full py-2 px-3 bg-[#2A070E] border border-[#D4A017]/30 rounded-lg text-[#FFF8E7] text-xs font-mono focus:outline-none focus:border-[#F5C542]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A017] via-[#F5C542] to-[#D4A017] hover:brightness-110 text-[#320912] font-black text-sm tracking-wider uppercase shadow-xl shadow-[#D4A017]/25 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-[#F8E7B0]/60">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className="text-xs font-black text-[#F5C542] hover:underline"
                >
                  LOGIN HERE
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
