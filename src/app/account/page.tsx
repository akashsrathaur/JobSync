'use client';

import React, { useEffect, useState } from 'react';
import { UserSession } from '@/types/api';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSession(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handlePermanentDataPurge = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? This will permanently delete all your uploaded resumes, extracted plain text, and generated weakness audits from our servers. This action is irreversible.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteStatus(null);

    try {
      const res = await fetch('/api/user/delete-data', {
        method: 'POST',
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Purge failed.');
      }

      setDeleteStatus('Success: All your uploaded documents and audit outputs have been permanently deleted.');
    } catch (err) {
      const error = err as Error;
      setDeleteStatus(`Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="border-b border-stone-200 pb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
          User Settings & Privacy Compliance
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-1">
          Account & Privacy Center
        </h1>
      </div>

      {/* Account Profile Card */}
      <div className="editorial-card p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-stone-900 text-base">Account Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-500 block font-mono">Email Address</span>
            <span className="font-semibold text-stone-900">{session?.email || 'candidate@jobsync.in'}</span>
          </div>
          <div>
            <span className="text-stone-500 block font-mono">Plan Tier</span>
            <span className="font-semibold text-stone-900 font-mono">{session?.tier || 'FREE'}</span>
          </div>
          <div>
            <span className="text-stone-500 block font-mono">Remaining Tailoring Runs</span>
            <span className="font-semibold text-stone-900 font-mono">{session?.creditsRemaining ?? 2} runs</span>
          </div>
          <div>
            <span className="text-stone-500 block font-mono">Anti-AI Slop Writing Filter</span>
            <span className="text-emerald-700 font-semibold font-mono">✓ Active & Enforced</span>
          </div>
        </div>
      </div>

      {/* DPDP Act 2023 India Compliance: One-Click Data Deletion */}
      <div className="editorial-card p-6 rounded-lg border-rose-200 bg-rose-50/20 space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-rose-800 uppercase">
            Data Privacy & Right to Erasure (DPDP Act 2023)
          </span>
          <h3 className="text-base font-bold text-stone-900 mt-1">
            Permanent Data Purge Control
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Resumes contain Personally Identifiable Information (PII) including your contact details, employment history, and education. We provide an unconditional, one-click mechanism to permanently delete every uploaded file and AI generation.
          </p>
        </div>

        {deleteStatus && (
          <div className="p-3 bg-white border border-stone-200 rounded text-xs font-mono text-stone-800">
            {deleteStatus}
          </div>
        )}

        <button
          type="button"
          disabled={isDeleting}
          onClick={handlePermanentDataPurge}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:bg-rose-300 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded transition shadow-sm"
        >
          {isDeleting ? 'Purging All User Records...' : 'Permanently Delete My Resumes & Data'}
        </button>
      </div>
    </div>
  );
}
