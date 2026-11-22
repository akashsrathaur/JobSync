'use client';

import React, { useState } from 'react';
import { ResumeUploader } from '@/components/ResumeUploader';
import { WeaknessAuditCard } from '@/components/WeaknessAuditCard';
import { TailoredEditor } from '@/components/TailoredEditor';
import { ResumeWeaknessAudit, TailorEngineResult } from '@/types/audit';
import { TailoredResume } from '@/types/resume';

export default function WorkspacePage() {
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('Uploaded Resume');
  const [jdText, setJdText] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack Engineer');
  const [targetCompany, setTargetCompany] = useState<string>('ZetaFlow Technologies');
  const [deepPolish, setDeepPolish] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [audit, setAudit] = useState<ResumeWeaknessAudit | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [atsBefore, setAtsBefore] = useState<number>(45);
  const [atsAfter, setAtsAfter] = useState<number>(84);
  const [telemetry, setTelemetry] = useState<TailorEngineResult['telemetry'] | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIngestSuccess = (data: {
    resumeText: string;
    fileName: string;
    resumeId?: string;
  }) => {
    setResumeText(data.resumeText);
    setFileName(data.fileName);
    if (data.resumeId) setResumeId(data.resumeId);
  };

  const handleStartTailoring = async () => {
    setErrorMessage(null);
    if (!resumeText || resumeText.trim().length < 50) {
      setErrorMessage('Please provide a valid resume with at least 50 characters.');
      return;
    }
    if (!jdText || jdText.trim().length < 50) {
      setErrorMessage('Please provide a valid Job Description with at least 50 characters.');
      return;
    }

    setIsProcessing(true);

    try {
      // Deterministic idempotency key per run content to prevent double-charging tokens on retries
      const idempotencyKey = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          resumeId,
          jobDescriptionText: jdText,
          targetRole,
          targetCompany,
          deepPolish,
          idempotencyKey,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Tailoring failed.');
      }

      const result: TailorEngineResult = json.data;
      setAudit(result.weaknessAudit);
      setTailoredResume(result.tailoredResume);
      setAtsBefore(result.atsScoreBefore);
      setAtsAfter(result.atsScoreAfter);
      setTelemetry(result.telemetry);
    } catch (err) {
      const error = err as Error;
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Tailoring Workspace
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Strict Grounding • Zero AI-Slop • Real Recruiter Evidence
          </p>
        </div>

        {telemetry && (
          <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-stone-600">Cost:</span>
            <span className="font-bold text-stone-900">₹{telemetry.estimatedCostInr.toFixed(3)}</span>
            <span className="text-stone-400">({telemetry.latencyMs}ms)</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* 3-Panel Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Input Panel: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ResumeUploader
            onIngestSuccess={handleIngestSuccess}
            onJdChange={(text) => setJdText(text)}
            onTargetDetailsChange={(role, company, polish) => {
              setTargetRole(role);
              setTargetCompany(company);
              setDeepPolish(polish);
            }}
            isProcessing={isProcessing}
            onStartTailoring={handleStartTailoring}
          />
        </div>

        {/* Center Column (Diagnostic Audit Panel: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <WeaknessAuditCard
            audit={audit}
            atsBefore={atsBefore}
            atsAfter={atsAfter}
            telemetry={telemetry}
          />
        </div>

        {/* Right Column (Tailored Resume Builder: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <TailoredEditor
            initialResume={tailoredResume}
            atsBefore={atsBefore}
            atsAfter={atsAfter}
          />
        </div>
      </div>
    </div>
  );
}
