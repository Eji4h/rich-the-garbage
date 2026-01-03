import {
  Donate,
  DonateResponse,
} from '../../../applications/ports/Donate.port';
import { getClientId } from '../../../utils/clientId';

export class DonateApi implements Donate {
  async createCheckoutSession(
    amountMinor: number,
    currency: string,
  ): Promise<DonateResponse> {
    const response = await fetch('/api/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': getClientId(),
      },
      body: JSON.stringify({ amountMinor, currency }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Failed to create checkout session',
      }));
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return await response.json();
  }
}
