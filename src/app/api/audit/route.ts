import { generateResumeTailoringAndAudit } from '@/lib/gemini';
import { ApiResponse } from '@/types/api';
import { ResumeWeaknessAudit } from '@/types/audit';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jdText } = body;

    if (!resumeText || !jdText) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Both resumeText and jdText are required for weakness audit.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const result = await generateResumeTailoringAndAudit({
      resumeText,
      jdText,
    });

    return NextResponse.json<ApiResponse<{ audit: ResumeWeaknessAudit; atsScoreBefore: number }>>({
      success: true,
      data: {
        audit: result.weaknessAudit,
        atsScoreBefore: result.atsScoreBefore,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'AUDIT_FAILED',
          message: err.message || 'Weakness audit generation failed.',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
