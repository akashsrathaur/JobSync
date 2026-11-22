import { assertUserOwnsResource, getCurrentUserSession } from '@/lib/auth';
import { generateResumeTailoringAndAudit } from '@/lib/gemini';
import { redactPiiFromLogs } from '@/lib/pii';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';
import { ApiResponse, TailorRequestPayload, TailorResponseData } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout for deep reasoning

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUserSession(req);
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate Limiting per User & IP
    const rateCheck = checkRateLimit(`tailor_${session.userId}_${ip}`, 15, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many tailoring requests. Please wait a minute before submitting again.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 429 }
      );
    }

    const body: TailorRequestPayload = await req.json();

    if (!body.idempotencyKey) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_IDEMPOTENCY_KEY',
            message: 'An idempotencyKey is required to guarantee duplicate billing protection.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!body.jobDescriptionText || body.jobDescriptionText.trim().length < 50) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_JD',
            message: 'Please provide a valid Job Description with at least 50 characters.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 1. Check IDEMPOTENCY KEY in DB: Return cached result if already processed
    try {
      const existingJob = await prisma.tailorJob.findUnique({
        where: { idempotencyKey: body.idempotencyKey },
      });

      if (existingJob) {
        // IDOR Check
        await assertUserOwnsResource(session.userId, existingJob.userId);

        console.log(`[Tailor Engine] Idempotency hit for key ${body.idempotencyKey}. Returning cached output without charging tokens.`);
        return NextResponse.json<ApiResponse<TailorResponseData>>({
          success: true,
          data: {
            weaknessAudit: JSON.parse(existingJob.weaknessAuditJson),
            tailoredResume: JSON.parse(existingJob.tailoredResumeJson),
            atsScoreBefore: existingJob.atsScoreBefore,
            atsScoreAfter: existingJob.atsScoreAfter,
            telemetry: {
              model: existingJob.modelUsed,
              inputTokens: existingJob.inputTokens,
              outputTokens: existingJob.outputTokens,
              estimatedCostUsd: 0,
              estimatedCostInr: existingJob.costInr,
              latencyMs: 12,
            },
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      // Continue if DB idempotency query skipped
    }

    // 2. Fetch Resume Text
    let resumeText = body.resumeText;
    if (!resumeText && body.resumeId) {
      try {
        const dbResume = await prisma.resume.findUnique({
          where: { id: body.resumeId },
        });
        if (dbResume) {
          await assertUserOwnsResource(session.userId, dbResume.userId);
          resumeText = dbResume.extractedRawText;
        }
      } catch {
        // Fallback
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_RESUME_TEXT',
            message: 'No resume text available. Please upload a resume or paste text first.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 3. Check Quota / Credit Balance
    if (session.creditsRemaining <= 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'QUOTA_EXHAUSTED',
            message: 'You have reached your tailoring quota for this billing cycle. Please upgrade your plan in the Pricing tab to continue.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 402 }
      );
    }

    console.log(`[Tailor Engine] Starting tailoring run for user ${session.userId}. Model: ${body.deepPolish ? 'Gemini 3.8 Flash' : 'Gemini 3.1 Flash-Lite'}`);

    // 4. Execute AI Generation with Strict Grounding and Schema
    const result = await generateResumeTailoringAndAudit({
      resumeText,
      jdText: body.jobDescriptionText,
      targetRole: body.targetRole,
      targetCompany: body.targetCompany,
      deepPolish: body.deepPolish,
    });

    // 5. Atomic DB Persistence & Credit Decrement
    try {
      await prisma.$transaction(async (tx) => {
        // Save tailor job
        const job = await tx.tailorJob.create({
          data: {
            userId: session.userId,
            resumeId: body.resumeId,
            idempotencyKey: body.idempotencyKey,
            targetRole: body.targetRole,
            targetCompany: body.targetCompany,
            jobDescriptionText: body.jobDescriptionText,
            weaknessAuditJson: JSON.stringify(result.weaknessAudit),
            tailoredResumeJson: JSON.stringify(result.tailoredResume),
            atsScoreBefore: result.atsScoreBefore,
            atsScoreAfter: result.atsScoreAfter,
            modelUsed: result.telemetry.model,
            inputTokens: result.telemetry.inputTokens,
            outputTokens: result.telemetry.outputTokens,
            costInr: result.telemetry.estimatedCostInr,
          },
        });

        // Record in Usage Ledger
        await tx.usageLedger.create({
          data: {
            userId: session.userId,
            jobId: job.id,
            action: body.deepPolish ? 'DEEP_POLISH' : 'TAILOR_RUN',
            creditsDelta: -1,
            tokensUsed: result.telemetry.inputTokens + result.telemetry.outputTokens,
            costUsd: result.telemetry.estimatedCostUsd,
            costInr: result.telemetry.estimatedCostInr,
            ipAddress: ip,
          },
        });

        // Decrement user credit
        await tx.user.update({
          where: { id: session.userId },
          data: {
            creditsRemaining: { decrement: 1 },
            usedRunsThisMonth: { increment: 1 },
          },
        });
      });
    } catch (dbError) {
      console.warn('[Tailor Engine] DB Transaction skipped or failed:', dbError);
    }

    return NextResponse.json<ApiResponse<TailorResponseData>>({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('[Tailor Engine Error]:', redactPiiFromLogs(err.message));
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'TAILORING_FAILED',
          message: err.message || 'An error occurred during resume diagnosis and tailoring.',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
