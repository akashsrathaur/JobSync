import { createSessionToken, getCurrentUserSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { ApiResponse, UserSession } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUserSession(req);

    const response = NextResponse.json<ApiResponse<UserSession>>({
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
    });

    // Ensure session cookie exists
    const existingCookie = req.cookies.get(SESSION_COOKIE_NAME);
    if (!existingCookie) {
      const token = createSessionToken({
        userId: session.userId,
        email: session.email,
        tier: session.tier,
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  } catch (error) {
    const err = error as Error;
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'AUTH_SESSION_ERROR',
          message: err.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
