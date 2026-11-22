import { prisma } from '@/lib/prisma';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { PLANS } from '@/lib/economics';
import { PlanId } from '@/types/billing';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'YourRazorpayWebhookSecretHere';
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    const rawBody = await req.text();

    // Constant-time signature verification
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn('[Webhook] Invalid Razorpay webhook signature detected.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event;

    console.log(`[Webhook] Received Razorpay event "${eventType}" (ID: ${eventId})`);

    // 1. Idempotency Check in Database
    try {
      const existingEvent = await prisma.paymentEvent.findUnique({
        where: { eventId },
      });

      if (existingEvent) {
        console.log(`[Webhook] Event ${eventId} was already processed. Acknowledging with 200 OK.`);
        return NextResponse.json({ status: 'ok', message: 'Already processed' });
      }
    } catch {
      // Continue if DB check skipped
    }

    // 2. Handle Payment Captured or Order Paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      const order = event.payload?.order?.entity;
      const notes = payment?.notes || order?.notes || {};

      const userId = notes.userId;
      const planId = notes.planId as PlanId;

      if (userId && planId && PLANS[planId]) {
        const plan = PLANS[planId];
        const tierEnum = planId === 'sprint_7d'
          ? 'SPRINT'
          : planId === 'starter_monthly'
          ? 'STARTER'
          : 'PRO';

        const daysToAdd = planId === 'sprint_7d' ? 7 : 30;
        const periodEnd = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

        try {
          await prisma.$transaction(async (tx) => {
            // Save event for idempotency
            await tx.paymentEvent.create({
              data: {
                eventId,
                eventType,
                razorpayPaymentId: payment?.id,
                razorpayOrderId: order?.id || payment?.order_id,
                payloadJson: rawBody,
                status: 'PROCESSED',
              },
            });

            // Update user's plan and credit balance
            await tx.user.update({
              where: { id: userId },
              data: {
                tier: tierEnum,
                creditsRemaining: { increment: plan.includedTailorRuns },
                monthlyQuota: plan.includedTailorRuns,
                quotaResetAt: periodEnd,
              },
            });

            // Record Subscription
            await tx.subscription.create({
              data: {
                userId,
                planId,
                tier: tierEnum,
                razorpayOrderId: order?.id || payment?.order_id,
                razorpayPaymentId: payment?.id,
                status: 'ACTIVE',
                amountInr: plan.priceInr,
                gstInr: plan.priceInr * 0.18,
                gatewayFeeInr: plan.priceInr * 0.0236,
                currentPeriodEnd: periodEnd,
              },
            });

            // Record in Usage Ledger
            await tx.usageLedger.create({
              data: {
                userId,
                action: 'PLAN_PURCHASE',
                creditsDelta: plan.includedTailorRuns,
                costInr: plan.priceInr,
              },
            });
          });

          console.log(`[Webhook] Successfully processed payment for user ${userId}. Added ${plan.includedTailorRuns} runs.`);
        } catch (dbErr) {
          console.error('[Webhook DB Error]:', dbErr);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('[Webhook Fatal Error]:', err.message);
    return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 });
  }
}
