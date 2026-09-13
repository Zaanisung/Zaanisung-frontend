import { request } from "./apiClient";

export interface InitializePaymentResult {
  reference: string;
  authorization_url: string;
  /** Present when the backend is running Paystack in dummy/demo mode. */
  dummy?: boolean;
  payment?: string;
}

export interface VerifyPaymentResult {
  status: "SUCCESS" | "PENDING" | "FAILED";
  dummy?: boolean;
}

/**
 * Initialize a Paystack transaction for the given amount (GHS).
 * Returns the reference to verify and, in live mode, the hosted checkout URL.
 */
export async function initializePayment(data: {
  amount: number;
  currency?: string;
  orderId?: string;
  meta?: Record<string, unknown>;
}): Promise<InitializePaymentResult> {
  return request("/payments/initialize", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Verify a previously initialized transaction by its reference. */
export async function verifyPayment(reference: string): Promise<VerifyPaymentResult> {
  return request("/payments/verify", {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
}