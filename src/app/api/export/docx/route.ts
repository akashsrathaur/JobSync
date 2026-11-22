import { generateAtsFriendlyDocx } from '@/lib/exporter';
import { TailoredResume } from '@/types/resume';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const resumeData: TailoredResume = await req.json();

    if (!resumeData || !resumeData.contactInfo) {
      return NextResponse.json(
        { error: 'Invalid resume data provided for DOCX generation' },
        { status: 400 }
      );
    }

    const docxBuffer = await generateAtsFriendlyDocx(resumeData);

    const safeName = (resumeData.contactInfo.fullName || 'Resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}_ATS_Tailored.docx`;

    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': docxBuffer.length.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('[Export DOCX Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate ATS DOCX' },
      { status: 500 }
    );
  }
}
