import { UserSession } from '@/types/api';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'jobsync_super_secret_jwt_key_must_be_32_chars_minimum';
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'jobsync_session';

// Demo fallback user for initial run when DB is fresh
export const DEMO_USER: UserSession = {
  userId: 'demo-user-india-2026',
  email: 'candidate@jobsync.in',
  name: 'Akash Sharma',
  tier: 'FREE',
  creditsRemaining: 2,
};

export interface TokenPayload {
  userId: string;
  email: string;
  tier: 'FREE' | 'SPRINT' | 'STARTER' | 'PRO';
  iat?: number;
  exp?: number;
}

export function createSessionToken(payload: {
  userId: string;
  email: string;
  tier: 'FREE' | 'SPRINT' | 'STARTER' | 'PRO';
}): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256',
  });
}

export function verifySessionToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Resolves current user session from request cookies or returns default active session
 */
export async function getCurrentUserSession(req?: NextRequest): Promise<UserSession> {
  try {
    let token: string | undefined;

    if (req) {
      token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (token) {
      const verified = verifySessionToken(token);
      if (verified) {
        // Query latest credit balance from DB if accessible
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: verified.userId },
            select: { id: true, email: true, name: true, tier: true, creditsRemaining: true },
          });
          if (dbUser) {
            return {
              userId: dbUser.id,
              email: dbUser.email,
              name: dbUser.name || 'User',
              tier: dbUser.tier as 'FREE' | 'SPRINT' | 'STARTER' | 'PRO',
              creditsRemaining: dbUser.creditsRemaining,
            };
          }
        } catch {
          // Fall back to token values if DB query is unreachable
        }

        return {
          userId: verified.userId,
          email: verified.email,
          tier: verified.tier,
          creditsRemaining: 2,
        };
      }
    }
  } catch (error) {
    console.warn('Session resolution error, using active session:', error);
  }

  return DEMO_USER;
}

/**
 * Ensures a database object belongs strictly to the authenticated user (IDOR prevention)
 */
export async function assertUserOwnsResource(userId: string, targetUserId: string): Promise<void> {
  if (userId !== targetUserId) {
    throw new Error('Forbidden: You do not have permission to access or modify this resource.');
  }
}
