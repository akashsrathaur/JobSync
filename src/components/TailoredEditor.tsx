'use client';

import React, { useState } from 'react';
import { TailoredResume, WorkExperienceItem } from '@/types/resume';

interface TailoredEditorProps {
  initialResume: TailoredResume | null;
  atsBefore: number;
  atsAfter: number;
}

export const TailoredEditor: React.FC<TailoredEditorProps> = ({
  initialResume,
  atsBefore,
  atsAfter,
}) => {
  const [resume, setResume] = useState<TailoredResume | null>(initialResume);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when initialResume changes
  React.useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
    }
  }, [initialResume]);

  if (!resume) {
    return (
      <div className="editorial-card p-8 rounded-md text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-mono text-sm">
          03
        </div>
        <h3 className="text-sm font-semibold text-stone-800">
          Tailored Resume Builder
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
          After diagnosis, your rewritten, ATS-optimized resume will appear here.
          You can edit any line inline and export clean, ATS-parseable single-column PDF and DOCX documents.
        </p>
      </div>
    );
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!res.ok) throw new Error('PDF export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.contactInfo.fullName || 'Resume').replace(/\s+/g, '_')}_JobSync_ATS.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!res.ok) throw new Error('DOCX export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.contactInfo.fullName || 'Resume').replace(/\s+/g, '_')}_JobSync_ATS.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download DOCX. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyPlainText = () => {
    const textLines: string[] = [
      resume.contactInfo.fullName,
      `${resume.contactInfo.email} | ${resume.contactInfo.phone} | ${resume.contactInfo.location || ''}`,
      '\nPROFESSIONAL SUMMARY',
      resume.professionalSummary,
      '\nTECHNICAL SKILLS',
      resume.skills.map((s) => `${s.category}: ${s.skills.join(', ')}`).join('\n'),
      '\nWORK EXPERIENCE',
      ...resume.experience.map(
        (exp) => `${exp.role} - ${exp.company} (${exp.startDate} - ${exp.endDate})\n` + exp.bullets.map((b) => `• ${b}`).join('\n')
      ),
      '\nEDUCATION',
      ...resume.education.map((edu) => `${edu.degree} - ${edu.institution} (${edu.graduationYear})`),
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, newText: string) => {
    const updated = { ...resume };
    updated.experience[expIndex].bullets[bulletIndex] = newText;
    setResume(updated);
  };

  return (
    <div className="editorial-card p-5 rounded-md space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Tailored Resume
          </span>
          <h3 className="text-base font-semibold text-stone-900">
            Clean ATS Hierarchy
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 pt-1">
            <span>Score: <strong className="text-stone-900">{atsBefore}%</strong></span>
            <span>→</span>
            <span className="text-emerald-700 font-bold">{atsAfter}%</span>
            <span className="text-[10px] text-stone-400 font-sans">(Single-column ATS standard)</span>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="text-xs px-2.5 py-1.5 border border-stone-300 hover:bg-stone-100 rounded font-mono transition"
          >
            {copied ? '✓ Copied' : 'Copy Text'}
          </button>
          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleExportDocx}
            className="text-xs px-3 py-1.5 border border-stone-300 hover:bg-stone-100 rounded font-mono transition"
          >
            {isExportingDocx ? 'Exporting...' : 'DOCX'}
          </button>
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleExportPdf}
            className="text-xs px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded font-mono transition shadow-sm"
          >
            {isExportingPdf ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Live Resume Canvas */}
      <div className="bg-stone-50/70 border border-stone-200 rounded p-4 space-y-4 max-h-[600px] overflow-y-auto text-xs">
        {/* Contact Info Header */}
        <div className="space-y-1 border-b border-stone-200 pb-3">
          <input
            type="text"
            value={resume.contactInfo.fullName}
            onChange={(e) =>
              setResume({
                ...resume,
                contactInfo: { ...resume.contactInfo, fullName: e.target.value },
              })
            }
            className="w-full text-base font-bold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-800 focus:outline-none"
          />
          <div className="text-[11px] text-stone-500 flex flex-wrap gap-2 font-mono">
            <span>{resume.contactInfo.email}</span>
            <span>•</span>
            <span>{resume.contactInfo.phone}</span>
            <span>•</span>
            <span>{resume.contactInfo.location}</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1.5">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
            Professional Summary
          </h4>
          <textarea
            rows={3}
            value={resume.professionalSummary}
            onChange={(e) =>
              setResume({ ...resume, professionalSummary: e.target.value })
            }
            className="w-full text-xs p-2 border border-stone-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-stone-800 leading-relaxed"
          />
        </div>

        {/* Technical Skills */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
            Technical Skills
          </h4>
          {resume.skills.map((skillGroup, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="font-semibold text-stone-800 text-[11px]">
                {skillGroup.category}:
              </span>
              <div className="flex flex-wrap gap-1">
                {skillGroup.skills.map((skill, kIdx) => (
                  <span
                    key={kIdx}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-mono text-stone-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience with Editable Bullets */}
        <div className="space-y-3">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
            Work Experience
          </h4>
          {resume.experience.map((exp: WorkExperienceItem, eIdx: number) => (
            <div key={exp.id || eIdx} className="space-y-2 bg-white p-3 border border-stone-200 rounded">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{exp.role}</span>
                <span className="text-[11px] font-mono text-stone-500">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="text-[11px] text-stone-600 italic">
                {exp.company} {exp.location ? `| ${exp.location}` : ''}
              </div>

              <div className="space-y-1.5 pt-1">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-start">
                    <span className="text-stone-400 mt-1">•</span>
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) => updateExperienceBullet(eIdx, bIdx, e.target.value)}
                      className="w-full text-xs p-1.5 border border-stone-200 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
            Education
          </h4>
          {resume.education.map((edu, edIdx) => (
            <div key={edu.id || edIdx} className="flex justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-900">{edu.degree}</span>
                <span className="text-stone-500 block text-[11px]">
                  {edu.institution} {edu.scoreOrGpa ? `| GPA: ${edu.scoreOrGpa}` : ''}
                </span>
              </div>
              <span className="font-mono text-stone-500 text-[11px]">
                {edu.graduationYear}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
