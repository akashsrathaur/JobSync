import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PlanId, RazorpayOrderResponse } from '@/types/billing';
import { PLANS } from './economics';

/**
 * Razorpay Client Singleton
 */
function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'rzp_test_YourTestKeyId12345') {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Server-side order creation.
 * Price is strictly taken from server-defined PLANS to prevent client amount tampering.
 */
export async function createRazorpayOrder(
  planId: PlanId,
  userId: string,
  userEmail: string
): Promise<RazorpayOrderResponse> {
  const plan = PLANS[planId];
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }

  if (plan.priceInr === 0) {
    throw new Error('Cannot create payment order for free tier.');
  }

  // Amount in Paise (1 INR = 100 paise)
  const amountInPaise = Math.round(plan.priceInr * 100);
  const client = getRazorpayClient();

  if (!client) {
    // Generate deterministic mock order for local testing / development
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      planId,
      planName: plan.name,
    };
  }

  const order = await client.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
    notes: {
      userId,
      userEmail,
      planId,
      planName: plan.name,
    },
  });

  return {
    orderId: order.id,
    amount: typeof order.amount === 'number' ? order.amount : amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID || '',
    planId,
    planName: plan.name,
  };
}

/**
 * Constant-time HMAC-SHA256 signature verification for Razorpay webhooks
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const bufExpected = Buffer.from(expectedSignature, 'utf8');
  const bufActual = Buffer.from(signature, 'utf8');

  if (bufExpected.length !== bufActual.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufExpected, bufActual);
}

/**
 * Verifies payment signature received by the client checkout modal
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  const data = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', params.secret)
    .update(data)
    .digest('hex');

  const bufExpected = Buffer.from(expectedSignature, 'utf8');
  const bufActual = Buffer.from(params.signature, 'utf8');

  if (bufExpected.length !== bufActual.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufExpected, bufActual);
}
