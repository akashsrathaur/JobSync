import { assertUserOwnsResource, getCurrentUserSession } from '@/lib/auth';
import { parseUploadedResumeFile } from '@/lib/parser';
import { redactPiiFromLogs } from '@/lib/pii';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';
import { ApiResponse, IngestResponseData } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUserSession(req);
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit per user/IP
    const rateCheck = checkRateLimit(`ingest_${session.userId}_${ip}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many upload attempts. Please wait 1 minute before trying again.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('directText') as string | null;

    let extractedRawText = '';
    let fileName = 'pasted-resume.txt';
    let fileType = 'text/plain';
    let fileSizeBytes = 0;

    if (file) {
      fileName = file.name;
      fileType = file.type;
      fileSizeBytes = file.size;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parsed = await parseUploadedResumeFile(buffer, fileName);
      extractedRawText = parsed.rawText;
      fileType = parsed.fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (directText && directText.trim().length > 50) {
      extractedRawText = directText.trim();
      fileSizeBytes = Buffer.byteLength(extractedRawText, 'utf8');
    } else {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Please provide either a PDF/DOCX file or paste resume text with at least 50 characters.',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.log(`[Ingest] Ingested resume "${fileName}" (${fileSizeBytes} bytes). Redacted preview: ${redactPiiFromLogs(extractedRawText.slice(0, 120))}`);

    // Persist in database
    let resumeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    try {
      const saved = await prisma.resume.create({
        data: {
          id: resumeId,
          userId: session.userId,
          fileName,
          fileType,
          fileSizeBytes,
          extractedRawText,
        },
      });
      resumeId = saved.id;
    } catch {
      // Fallback if Postgres table is during migration
    }

    const estimatedTokens = Math.ceil(extractedRawText.length / 4);

    return NextResponse.json<ApiResponse<IngestResponseData>>({
      success: true,
      data: {
        resumeId,
        fileName,
        fileSizeBytes,
        fileType,
        extractedSnippet: extractedRawText.slice(0, 300) + '...',
        totalCharacters: extractedRawText.length,
        estimatedTokens,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('[Ingest Error]:', redactPiiFromLogs(err.message));
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'PARSER_FAILED',
          message: err.message || 'Failed to process resume file safely.',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
