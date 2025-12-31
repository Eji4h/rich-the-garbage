// Currency code to symbol mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: '$',
  thb: '฿',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  cad: 'C$',
  aud: 'A$',
  sgd: 'S$',
  hkd: 'HK$',
  nzd: 'NZ$',
  chf: 'CHF',
  sek: 'kr',
  nok: 'kr',
  dkk: 'kr',
  pln: 'zł',
  czk: 'Kč',
  inr: '₹',
  krw: '₩',
  cny: '¥',
  mxn: '$',
  brl: 'R$',
  zar: 'R',
};

// Locale to currency mapping
const LOCALE_TO_CURRENCY: Record<string, string> = {
  'en-US': 'usd',
  'en-CA': 'cad',
  'en-GB': 'gbp',
  'en-AU': 'aud',
  'en-NZ': 'nzd',
  'en-SG': 'sgd',
  'en-HK': 'hkd',
  'th-TH': 'thb',
  'de-DE': 'eur',
  'fr-FR': 'eur',
  'it-IT': 'eur',
  'es-ES': 'eur',
  'nl-NL': 'eur',
  'pt-PT': 'eur',
  'ja-JP': 'jpy',
  'ko-KR': 'krw',
  'zh-CN': 'cny',
  'zh-TW': 'twd',
  'sv-SE': 'sek',
  'no-NO': 'nok',
  'da-DK': 'dkk',
  'pl-PL': 'pln',
  'cs-CZ': 'czk',
  'hi-IN': 'inr',
  'es-MX': 'mxn',
  'pt-BR': 'brl',
  'af-ZA': 'zar',
};

// Stripe supported currencies (common ones)
const STRIPE_SUPPORTED_CURRENCIES = [
  'usd',
  'thb',
  'eur',
  'gbp',
  'jpy',
  'cad',
  'aud',
  'sgd',
  'hkd',
  'nzd',
  'chf',
  'sek',
  'nok',
  'dkk',
  'pln',
  'czk',
  'inr',
  'krw',
  'mxn',
  'brl',
  'zar',
];

export function detectCurrencyFromLocale(): string {
  if (typeof window === 'undefined') {
    return 'usd';
  }

  const locale = navigator.language || navigator.languages?.[0] || 'en-US';

  // Try exact match first
  if (LOCALE_TO_CURRENCY[locale]) {
    return LOCALE_TO_CURRENCY[locale];
  }

  // Try language code match (e.g., 'en' from 'en-US')
  const languageCode = locale.split('-')[0];
  for (const [key, currency] of Object.entries(LOCALE_TO_CURRENCY)) {
    if (key.startsWith(languageCode)) {
      return currency;
    }
  }

  // Default fallback
  return 'usd';
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toLowerCase()] || currency.toUpperCase();
}

export function formatAmount(amountMinor: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const amount = amountMinor / 100;

  // Special handling for currencies without decimals
  const decimals = ['jpy', 'krw'].includes(currency.toLowerCase()) ? 0 : 2;

  return `${symbol}${amount.toFixed(decimals)}`;
}

export function isValidCurrency(currency: string): boolean {
  return STRIPE_SUPPORTED_CURRENCIES.includes(currency.toLowerCase());
}

export function getSupportedCurrencies(): Array<{
  code: string;
  name: string;
  symbol: string;
}> {
  return STRIPE_SUPPORTED_CURRENCIES.map((code) => ({
    code,
    name: code.toUpperCase(),
    symbol: getCurrencySymbol(code),
  }));
}
