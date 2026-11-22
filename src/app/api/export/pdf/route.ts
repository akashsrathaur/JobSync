import { getCurrentUserSession } from '@/lib/auth';
import { generateAtsFriendlyPdf } from '@/lib/exporter';
import { TailoredResume } from '@/types/resume';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUserSession(req);
    const resumeData: TailoredResume = await req.json();

    if (!resumeData || !resumeData.contactInfo) {
      return NextResponse.json(
        { error: 'Invalid resume data provided for PDF generation' },
        { status: 400 }
      );
    }

    // Apply watermark only for free tier users
    const isWatermarked = session.tier === 'FREE';

    const pdfBuffer = await generateAtsFriendlyPdf(resumeData, {
      watermarked: isWatermarked,
    });

    const safeName = (resumeData.contactInfo.fullName || 'Resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}_ATS_Tailored.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('[Export PDF Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate ATS PDF' },
      { status: 500 }
    );
  }
}
