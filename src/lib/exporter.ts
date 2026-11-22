import { TailoredResume } from '@/types/resume';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';

/**
 * ATS Best Practices Generator:
 * 1. Single-column linear hierarchy (no multi-column tables that scramble parsing order).
 * 2. Standard section headers (SUMMARY, TECHNICAL SKILLS, EXPERIENCE, PROJECTS, EDUCATION).
 * 3. Machine-readable fonts (Helvetica/Arial/Times).
 * 4. No floating graphic boxes, icons, or complex CSS frames.
 */

export async function generateAtsFriendlyPdf(
  resume: TailoredResume,
  options?: { watermarked?: boolean }
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 45;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = margin;
  const lineHeight = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  // Header: Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(resume.contactInfo.fullName || 'Candidate Name', margin, currentY);
  currentY += 20;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 80);
  const contactParts = [
    resume.contactInfo.email,
    resume.contactInfo.phone,
    resume.contactInfo.location,
    resume.contactInfo.linkedinUrl,
    resume.contactInfo.githubUrl,
  ].filter(Boolean);
  doc.text(contactParts.join('  |  '), margin, currentY);
  currentY += 15;

  // Horizontal divider rule
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.75);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 16;

  const renderSectionHeader = (title: string) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39); // Slate-900
    doc.text(title.toUpperCase(), margin, currentY);
    currentY += 5;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 14;
  };

  // Summary
  if (resume.professionalSummary) {
    renderSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const splitSummary = doc.splitTextToSize(resume.professionalSummary, pageWidth - margin * 2);
    checkPageBreak(splitSummary.length * lineHeight);
    doc.text(splitSummary, margin, currentY);
    currentY += splitSummary.length * lineHeight + 10;
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    renderSectionHeader('Technical Skills');
    doc.setFontSize(9.5);
    for (const cat of resume.skills) {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      const catTitle = `${cat.category}: `;
      doc.text(catTitle, margin, currentY);

      const titleWidth = doc.getTextWidth(catTitle);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const skillsText = cat.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, pageWidth - margin * 2 - titleWidth);
      doc.text(splitSkills, margin + titleWidth, currentY);
      currentY += Math.max(1, splitSkills.length) * lineHeight + 3;
    }
    currentY += 8;
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    renderSectionHeader('Work Experience');
    for (const exp of resume.experience) {
      checkPageBreak(35);
      // Role & Dates
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.role, margin, currentY);

      const dateStr = `${exp.startDate} – ${exp.endDate}`;
      const dateWidth = doc.getTextWidth(dateStr);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 100, 100);
      doc.text(dateStr, pageWidth - margin - dateWidth, currentY);
      currentY += 13;

      // Company & Location
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const compLoc = exp.location ? `${exp.company} | ${exp.location}` : exp.company;
      doc.text(compLoc, margin, currentY);
      currentY += 13;

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      for (const bullet of exp.bullets) {
        const bulletText = `•  ${bullet}`;
        const splitBullet = doc.splitTextToSize(bulletText, pageWidth - margin * 2);
        checkPageBreak(splitBullet.length * lineHeight + 2);
        doc.text(splitBullet, margin, currentY);
        currentY += splitBullet.length * lineHeight + 2;
      }
      currentY += 6;
    }
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    renderSectionHeader('Key Projects');
    for (const proj of resume.projects) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      const titleLine = proj.technologies.length > 0
        ? `${proj.title} | ${proj.technologies.join(', ')}`
        : proj.title;
      doc.text(titleLine, margin, currentY);
      currentY += 13;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      for (const bullet of proj.bullets) {
        const bulletText = `•  ${bullet}`;
        const splitBullet = doc.splitTextToSize(bulletText, pageWidth - margin * 2);
        checkPageBreak(splitBullet.length * lineHeight + 2);
        doc.text(splitBullet, margin, currentY);
        currentY += splitBullet.length * lineHeight + 2;
      }
      currentY += 6;
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    renderSectionHeader('Education');
    for (const edu of resume.education) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''), margin, currentY);

      const yearWidth = doc.getTextWidth(edu.graduationYear);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 100, 100);
      doc.text(edu.graduationYear, pageWidth - margin - yearWidth, currentY);
      currentY += 13;

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(60, 60, 60);
      doc.text(edu.institution + (edu.scoreOrGpa ? ` | GPA/Score: ${edu.scoreOrGpa}` : ''), margin, currentY);
      currentY += 16;
    }
  }

  // Watermark for free tier
  if (options?.watermarked) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      'Diagnosed & Tailored via JobSync (Truthful ATS Engine). Upgrade to remove watermark.',
      margin,
      doc.internal.pageSize.getHeight() - 20
    );
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

/**
 * Generates clean, standard ATS-friendly Microsoft Word (.docx) file
 */
export async function generateAtsFriendlyDocx(resume: TailoredResume): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];

  // Full Name Header
  paragraphs.push(
    new Paragraph({
      text: resume.contactInfo.fullName || 'Candidate Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 100 },
    })
  );

  // Contact line
  const contactParts = [
    resume.contactInfo.email,
    resume.contactInfo.phone,
    resume.contactInfo.location,
    resume.contactInfo.linkedinUrl,
    resume.contactInfo.githubUrl,
  ].filter(Boolean);

  paragraphs.push(
    new Paragraph({
      text: contactParts.join('  |  '),
      spacing: { after: 200 },
    })
  );

  // Section builder helper
  const addSectionHeading = (title: string) => {
    paragraphs.push(
      new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
  };

  // Professional Summary
  if (resume.professionalSummary) {
    addSectionHeading('Professional Summary');
    paragraphs.push(
      new Paragraph({
        text: resume.professionalSummary,
        spacing: { after: 150 },
      })
    );
  }

  // Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    addSectionHeading('Technical Skills');
    for (const cat of resume.skills) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${cat.category}: `, bold: true }),
            new TextRun({ text: cat.skills.join(', ') }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeading('Work Experience');
    for (const exp of resume.experience) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.role} - ${exp.company}`, bold: true }),
            new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, italics: true }),
          ],
          spacing: { before: 120, after: 60 },
        })
      );

      for (const bullet of exp.bullets) {
        paragraphs.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
      }
    }
  }

  // Key Projects
  if (resume.projects && resume.projects.length > 0) {
    addSectionHeading('Key Projects');
    for (const proj of resume.projects) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.title, bold: true }),
            new TextRun({ text: ` (${proj.technologies.join(', ')})`, italics: true }),
          ],
          spacing: { before: 100, after: 50 },
        })
      );

      for (const bullet of proj.bullets) {
        paragraphs.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      }
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    addSectionHeading('Education');
    for (const edu of resume.education) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree} - ${edu.institution}`, bold: true }),
            new TextRun({ text: `\t${edu.graduationYear}`, italics: true }),
          ],
          spacing: { before: 100, after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
