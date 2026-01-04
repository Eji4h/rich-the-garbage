// Shared currency rules for donation system
// Used by both frontend (src/) and worker (worker/)

export const SUPPORTED_CURRENCIES = [
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
  'cny',
  'twd',
  'mxn',
  'brl',
  'zar',
] as const;

export function getCurrencyDecimals(currency: string): 0 | 2 {
  // Stripe "zero-decimal" currencies (subset we support)
  return ['jpy', 'krw'].includes(currency.toLowerCase()) ? 0 : 2;
}

// Preset amounts in major units (will be converted to minor units)
const PRESET_AMOUNTS_MAJOR: Record<string, number[]> = {
  // 2-decimal "USD-like" currencies
  usd: [5, 10, 20, 50],
  eur: [5, 10, 20, 50],
  gbp: [5, 10, 20, 50],
  cad: [5, 10, 20, 50],
  aud: [5, 10, 20, 50],
  nzd: [5, 10, 20, 50],
  chf: [5, 10, 20, 50],
  sgd: [5, 10, 20, 50],
  hkd: [50, 100, 200, 500], // HKD has lower value
  mxn: [100, 200, 500, 1000], // MXN has lower value
  brl: [20, 50, 100, 200], // BRL has lower value
  zar: [50, 100, 200, 500], // ZAR has lower value

  // THB (Thai Baht)
  thb: [50, 100, 200, 500],

  // Scandinavian currencies
  sek: [50, 100, 200, 500],
  nok: [50, 100, 200, 500],
  dkk: [50, 100, 200, 500],

  // Eastern European currencies
  pln: [20, 50, 100, 200],
  czk: [100, 200, 500, 1000],

  // Indian Rupee
  inr: [100, 200, 500, 1000],

  // Zero-decimal currencies
  jpy: [500, 1000, 2000, 5000],
  krw: [1000, 5000, 10000, 50000],

  // Chinese currencies
  cny: [10, 20, 50, 100],
  twd: [100, 300, 500, 1000],
};

// Maximum donation amounts in major units (will be converted to minor units)
const MAX_AMOUNTS_MAJOR: Record<string, number> = {
  // 2-decimal "USD-like" currencies - max $1000
  usd: 1000,
  eur: 1000,
  gbp: 1000,
  cad: 1000,
  aud: 1000,
  nzd: 1000,
  chf: 1000,
  sgd: 1000,
  hkd: 10000, // HKD has lower value, so higher max
  mxn: 20000, // MXN has lower value
  brl: 5000, // BRL has lower value
  zar: 20000, // ZAR has lower value

  // THB (Thai Baht)
  thb: 50000,

  // Scandinavian currencies
  sek: 10000,
  nok: 10000,
  dkk: 10000,

  // Eastern European currencies
  pln: 5000,
  czk: 20000,

  // Indian Rupee
  inr: 100000,

  // Zero-decimal currencies
  jpy: 100000, // ¥100,000
  krw: 1000000, // ₩1,000,000 (KRW has lower value)

  // Chinese currencies
  cny: 10000, // ¥10,000
  twd: 50000, // NT$50,000
};

export function getCurrencyPresetMinors(currency: string): number[] {
  const code = currency.toLowerCase();
  const decimals = getCurrencyDecimals(currency);
  const presetsMajor = PRESET_AMOUNTS_MAJOR[code];

  if (!presetsMajor) {
    // Fallback to USD-like defaults
    return [500, 1000, 2000, 5000];
  }

  // Convert major units to minor units
  const factor = 10 ** decimals;
  return presetsMajor.map((amount) => amount * factor);
}

export interface CurrencyLimits {
  minMinor: number;
  maxMinor: number;
}

export function getCurrencyLimitsMinor(currency: string): CurrencyLimits {
  const presets = getCurrencyPresetMinors(currency);
  const minMinor = Math.min(...presets);
  const decimals = getCurrencyDecimals(currency);

  // Get currency-specific max amount in major units, or use fallback
  const code = currency.toLowerCase();
  const maxMajor = MAX_AMOUNTS_MAJOR[code] ?? (decimals === 0 ? 100000 : 1000);
  const factor = 10 ** decimals;
  const maxMinor = maxMajor * factor;

  return { minMinor, maxMinor };
}
