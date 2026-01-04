export interface DonateResponse {
  url: string;
}

export interface Donate {
  createCheckoutSession(
    amountMinor: number,
    currency: string,
  ): Promise<DonateResponse>;
}
