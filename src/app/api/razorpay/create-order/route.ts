import { getCurrentUserSession } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { ApiResponse } from '@/types/api';
import { PlanId, RazorpayOrderResponse } from '@/types/billing';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUserSession(req);
    const body = await req.json();
    const planId = body.planId as PlanId;

    if (!planId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_PLAN_ID',
            message: 'planId is required to create a payment order.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const orderData = await createRazorpayOrder(planId, session.userId, session.email);

    return NextResponse.json<ApiResponse<RazorpayOrderResponse>>({
      success: true,
      data: orderData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('[Razorpay Order Error]:', err.message);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'ORDER_CREATION_FAILED',
          message: err.message || 'Unable to create payment order.',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
