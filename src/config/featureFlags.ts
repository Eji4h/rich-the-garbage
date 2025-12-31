export interface FeatureFlags {
  donation: boolean;
}

const defaultFlags: FeatureFlags = {
  donation: true,
};

function getEnvFlag(key: string, defaultValue: boolean): boolean {
  const envValue = import.meta.env[`VITE_FEATURE_${key.toUpperCase()}`];
  if (envValue === undefined) {
    return defaultValue;
  }
  // Handle string values like "true", "false", "1", "0"
  if (typeof envValue === 'string') {
    return envValue.toLowerCase() === 'true' || envValue === '1';
  }
  return Boolean(envValue);
}

export const featureFlags: FeatureFlags = {
  donation: getEnvFlag('donation', defaultFlags.donation),
};
