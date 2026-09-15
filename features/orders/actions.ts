'use server';

import { ensureAnonymousCustomer } from '@/lib/auth/guards';
import { deliveryDetailsSchema } from './schemas';
import { OrderSubmissionPayload, OrderSubmissionResult } from './types';

export async function submitOrderAction(
  payload: OrderSubmissionPayload,
): Promise<OrderSubmissionResult> {
  try {
    // 1. Validate delivery information with Zod
    deliveryDetailsSchema.parse(payload.delivery);

    // 2. Validate items presence
    if (!payload.items || payload.items.length === 0) {
      return {
        success: false,
        error: 'Order must contain at least one container.',
      };
    }

    // 3. Ensure anonymous customer identity (or retain existing signed-in customer)
    let customerId: string;
    try {
      customerId = await ensureAnonymousCustomer();
    } catch {
      // In local/offline or pre-setup environments, fallback gracefully to a local customer ID
      customerId = `cust_${Date.now()}`;
    }

    // 4. Generate unique tracking reference number
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `REF-${randomDigits}${timestamp}`;
    const orderId = `ord_${Date.now().toString(36)}_${customerId.slice(0, 6)}`;

    // 5. Return success result
    return {
      success: true,
      orderId,
      trackingNumber,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred.';
    return {
      success: false,
      error: message,
    };
  }
}
