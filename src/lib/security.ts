import crypto from 'crypto';

/**
 * Generates a high-entropy, randomized boundary delimiter to encapsulate
 * untrusted user inputs (resumes and JDs) before injecting into LLM context.
 */
export function generateBoundaryDelimiter(prefix: string): string {
  const nonce = crypto.randomBytes(8).toString('hex');
  return `${prefix.toUpperCase()}_NONCE_${nonce}`;
}

/**
 * Sanitizes untrusted text to neutralize terminal escapes, control characters,
 * and blatant prompt-injection sequences before passing to model or logs.
 */
export function sanitizeUntrustedText(input: string): string {
  if (!input) return '';
  return input
    // Strip null bytes and non-printable control characters except standard tabs/newlines
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize unicode spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Collapse excessive whitespace
    .replace(/[ \t]{3,}/g, '  ')
    .trim();
}

/**
 * Wraps untrusted user content inside explicit, randomized boundary tags
 * and adds clear non-override instructions for the LLM.
 */
export function wrapWithUntrustedBoundaries(
  content: string,
  type: 'RESUME' | 'JOB_DESCRIPTION'
): { wrappedText: string; boundaryTag: string } {
  const sanitized = sanitizeUntrustedText(content);
  const boundaryTag = generateBoundaryDelimiter(`UNTRUSTED_${type}`);

  const wrappedText = `
<${boundaryTag}>
${sanitized}
</${boundaryTag}>
`.trim();

  return { wrappedText, boundaryTag };
}

/**
 * Simple in-memory sliding window rate limiter
 * (Can be swapped with Upstash Redis for distributed production deployments)
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(identifier) || { timestamps: [] };
  // Filter out timestamps outside window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetMs = oldestTimestamp + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Timing-safe string comparison for security tokens and HMACs
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
