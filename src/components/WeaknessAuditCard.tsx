'use client';

import React, { useState } from 'react';
import { ResumeWeaknessAudit } from '@/types/audit';
import { ScoreBadge } from './ScoreBadge';

interface WeaknessAuditCardProps {
  audit: ResumeWeaknessAudit | null;
  atsBefore: number;
  atsAfter: number;
  telemetry?: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCostInr: number;
  };
}

export const WeaknessAuditCard: React.FC<WeaknessAuditCardProps> = ({
  audit,
  atsBefore,
  atsAfter,
  telemetry,
}) => {
  const [activeTab, setActiveTab] = useState<'keywords' | 'impact' | 'structure' | 'mismatches' | 'questions'>('keywords');

  if (!audit) {
    return (
      <div className="editorial-card p-8 rounded-md text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-mono text-sm">
          02
        </div>
        <h3 className="text-sm font-semibold text-stone-800">
          Weakness Diagnostic Ready
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
          Upload your resume and paste a Job Description on the left, then click{' '}
          <strong className="text-stone-700">"Diagnose Weaknesses"</strong> to receive an unvarnished audit of ATS gaps, vague bullets, and missing hard skills.
        </p>
      </div>
    );
  }

  return (
    <div className="editorial-card p-5 rounded-md space-y-5">
      {/* Diagnostic Header & Honest Match Comparison */}
      <div className="border-b border-stone-200 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Diagnostic Audit Report
            </span>
            <h3 className="text-base font-semibold text-stone-900">
              Current Resume Weakness Breakdown
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] text-stone-400 uppercase font-mono">Original</span>
              <ScoreBadge score={atsBefore} size="sm" />
            </div>
            <span className="text-stone-300">→</span>
            <div className="text-right">
              <span className="block text-[10px] text-stone-400 uppercase font-mono">Truthful Tailored</span>
              <ScoreBadge score={atsAfter} size="sm" />
            </div>
          </div>
        </div>

        {/* Executive Recruiter Verdict */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800 leading-relaxed">
          <strong className="font-semibold text-stone-900 font-mono text-[11px] uppercase mr-1">
            Recruiter Verdict:
          </strong>
          {audit.executiveVerdict}
        </div>

        {/* Telemetry pill */}
        {telemetry && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 pt-1">
            <span className="px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200">
              Engine: {telemetry.model}
            </span>
            <span>•</span>
            <span>Tokens: {telemetry.inputTokens} In / {telemetry.outputTokens} Out</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Cost: ₹{telemetry.estimatedCostInr.toFixed(3)}</span>
          </div>
        )}
      </div>

      {/* Diagnostic Category Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('keywords')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap ${
            activeTab === 'keywords'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          ATS Keywords ({audit.atsKeywordIssues.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('impact')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap ${
            activeTab === 'impact'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Impact Deficits ({audit.impactDeficits.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('structure')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap ${
            activeTab === 'structure'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Structure Flaws ({audit.structuralFlaws.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mismatches')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap ${
            activeTab === 'mismatches'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Missing Skills & Bridges ({audit.missingHardSkills.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap ${
            activeTab === 'questions'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Unlock Real Metrics ({audit.metricDiscoveryQuestions.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* 1. Keywords & ATS Alignment */}
        {activeTab === 'keywords' && (
          <div className="space-y-3">
            {audit.atsKeywordIssues.map((item, idx) => (
              <div key={idx} className="p-3 border border-stone-200 rounded-md bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{item.issue}</span>
                  <span
                    className={`editorial-tag ${
                      item.impact === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : item.impact === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>

                <div className="text-xs space-y-1.5">
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 block mb-1">
                      Target Hard Skills Missing:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.keywordsMissing.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-mono text-[11px]"
                        >
                          ✕ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.keywordsFound.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-mono text-stone-500 block mb-1">
                        Keywords Successfully Matched:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.keywordsFound.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-[11px]"
                          >
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-stone-600 text-[11px] pt-1">
                    <strong className="text-stone-800 font-medium">Recommended Action:</strong> {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Impact Deficits & Bullet Rewrites */}
        {activeTab === 'impact' && (
          <div className="space-y-3">
            {audit.impactDeficits.map((item, idx) => (
              <div key={idx} className="p-3 border border-stone-200 rounded-md bg-white space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 block font-semibold">
                    Original Weak / Unquantified Bullet
                  </span>
                  <div className="text-xs text-stone-700 italic border-l-2 border-rose-300 pl-2.5 my-1">
                    "{item.originalBullet}"
                  </div>
                  <p className="text-[11px] text-stone-500">
                    <strong className="text-stone-700">Flaw:</strong> {item.flaw}
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 block font-semibold mb-1">
                    Recruiter-Grade Truthful Rewrite (No AI Buzzwords)
                  </span>
                  <div className="text-xs text-stone-900 font-medium">
                    {item.improvedDraft}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 mt-1">
                    Angle: {item.suggestedMetricAngle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Structural & Clarity Flaws */}
        {activeTab === 'structure' && (
          <div className="space-y-3">
            {audit.structuralFlaws.map((item, idx) => (
              <div key={idx} className="p-3 border border-stone-200 rounded-md bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{item.section}</span>
                  <span className="editorial-tag bg-stone-100 text-stone-700">FORMATTING</span>
                </div>
                <p className="text-xs text-stone-700">
                  <strong className="text-stone-900">Issue:</strong> {item.flaw}
                </p>
                <p className="text-[11px] text-stone-500">
                  <strong className="text-stone-700">Recommendation:</strong> {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 4. Missing Skills & Truthful Bridges */}
        {activeTab === 'mismatches' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
              <strong>Zero-Hallucination Rule:</strong> We never add skills you do not have.
              Instead, below are adjacent transferable skills you can highlight truthfully.
            </div>

            {audit.missingHardSkills.map((item, idx) => (
              <div key={idx} className="p-3 border border-stone-200 rounded-md bg-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-stone-900">{item.skill}</span>
                  <span
                    className={`editorial-tag ${
                      item.importance === 'MANDATORY' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  <strong className="text-stone-800">JD Context:</strong> {item.jdContext}
                </p>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800">
                  <strong className="text-stone-900 font-mono text-[11px] block mb-0.5">
                    Truthful Transferable Bridge:
                  </strong>
                  {item.adjacentTransferableExperience}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Metric Discovery Questions */}
        {activeTab === 'questions' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-stone-100 border border-stone-200 rounded text-xs text-stone-700">
              Answer these targeted questions to supply real, un-hallucinated numbers from your past projects:
            </div>

            {audit.metricDiscoveryQuestions.map((q, idx) => (
              <div key={idx} className="p-3 border border-stone-200 rounded-md bg-white space-y-2">
                <div className="text-xs font-semibold text-stone-900">
                  {idx + 1}. {q.question}
                </div>
                <div className="text-[11px] text-stone-500">
                  <strong>Target:</strong> {q.targetRoleOrProject} • <strong>Why:</strong> {q.whyItMatters}
                </div>
                <div className="p-2 bg-stone-50 border border-dashed border-stone-300 rounded text-[11px] font-mono text-stone-700">
                  Format: {q.exampleAnswerFormat}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
