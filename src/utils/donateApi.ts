const API_BASE = '/api/donate';

export interface DonateCheckoutResponse {
  url: string;
}

export interface DonateError {
  error: string;
  details?: string;
}

export async function createCheckoutSession(
  amount: number,
): Promise<DonateCheckoutResponse> {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const error: DonateError = await response.json();
    throw new Error(
      error.details || error.error || 'Failed to create checkout',
    );
  }

  return await response.json();
}

export async function redirectToCheckout(amount: number): Promise<void> {
  const session = await createCheckoutSession(amount);
  window.location.href = session.url;
}
