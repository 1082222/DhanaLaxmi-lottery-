import { CountryConfig, SupportedCountryCode, CurrencyCode } from '../types';

export const SUPPORTED_COUNTRIES: Record<SupportedCountryCode, CountryConfig> = {
  TH: {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
    phonePrefix: '+66',
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    phonePrefix: '+91',
  },
  KW: {
    code: 'KW',
    name: 'Kuwait',
    flag: '🇰🇼',
    currency: 'KWD',
    currencySymbol: 'KWD',
    phonePrefix: '+965',
  },
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR',
    phonePrefix: '+966',
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    phonePrefix: '+971',
  },
  OM: {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    currency: 'OMR',
    currencySymbol: 'OMR',
    phonePrefix: '+968',
  },
  BH: {
    code: 'BH',
    name: 'Bahrain',
    flag: '🇧🇭',
    currency: 'BHD',
    currencySymbol: 'BHD',
    phonePrefix: '+973',
  },
};

export const COUNTRY_LIST = Object.values(SUPPORTED_COUNTRIES);

export const DEFAULT_COUNTRY: SupportedCountryCode = 'TH';

export function getCurrencySymbol(curr: CurrencyCode): string {
  switch (curr) {
    case 'THB':
      return '฿';
    case 'INR':
      return '₹';
    case 'KWD':
      return 'KWD';
    case 'SAR':
      return 'SAR';
    case 'OMR':
      return 'OMR';
    case 'BHD':
      return 'BHD';
    case 'AED':
      return 'AED';
    default:
      return curr;
  }
}

export function formatCurrency(amount: number, curr: CurrencyCode): string {
  const precision = curr === 'KWD' || curr === 'OMR' || curr === 'BHD' ? 3 : (curr === 'INR' || curr === 'THB' ? 0 : 2);
  if (curr === 'THB') {
    return `฿${Math.round(amount).toLocaleString('en-US')}`;
  }
  if (curr === 'INR') {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  return `${amount.toFixed(precision)} ${curr}`;
}
