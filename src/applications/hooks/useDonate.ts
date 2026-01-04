import { useState, useCallback } from 'react';
import { DonateApi } from '../../adapters/outbounds/repositories/Donate.imp';

const donateApi = new DonateApi();

export function useDonate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(
    async (amountMinor: number, currency: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { url } = await donateApi.createCheckoutSession(
          amountMinor,
          currency,
        );
        window.location.href = url;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create checkout';
        setError(message);
        setIsLoading(false);
        throw err;
      }
    },
    [],
  );

  return {
    createCheckout,
    isLoading,
    error,
  };
}
