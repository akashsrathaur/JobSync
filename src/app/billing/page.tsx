'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserSession } from '@/types/api';
import { PLANS } from '@/lib/economics';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';

export default function BillingPage() {
  const [session, setSession] = useState<UserSession | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="border-b border-stone-200 pb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
          Subscription Management
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-1">
          Billing & Usage Overview
        </h1>
      </div>

      {/* Current Subscription Card */}
      <div className="editorial-card p-6 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs text-stone-500 font-mono uppercase">Current Active Tier</span>
            <h3 className="text-xl font-bold text-stone-900">
              {session ? session.tier : 'FREE'} Tier
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Account: <span className="font-mono">{session?.email || 'candidate@jobsync.in'}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-500 font-mono uppercase block">Available Runs</span>
            <span className="text-2xl font-bold text-stone-900 font-mono">
              {session?.creditsRemaining ?? 2}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-1">
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-500 block">Payment Currency:</span>
            <strong className="text-stone-900">INR (₹) via Razorpay</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-500 block">GST Compliance:</span>
            <strong className="text-stone-900">18% Registered</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-500 block">Watermark Status:</span>
            <strong className="text-stone-900">
              {session?.tier === 'FREE' ? 'Standard Watermark' : '✓ Watermark Removed'}
            </strong>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900">
          Available Subscription Upgrades
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sprint */}
          <div className="editorial-card p-4 rounded-md space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">7-Day Access</span>
              <h4 className="font-bold text-stone-900">{PLANS.sprint_7d.name}</h4>
              <div className="text-lg font-bold font-mono text-stone-900">₹{PLANS.sprint_7d.priceInr}</div>
              <p className="text-xs text-stone-600">{PLANS.sprint_7d.description}</p>
            </div>
            <RazorpayCheckout
              planId="sprint_7d"
              planName={PLANS.sprint_7d.name}
              priceInr={PLANS.sprint_7d.priceInr}
            />
          </div>

          {/* Starter */}
          <div className="editorial-card p-4 rounded-md space-y-3 border-stone-900 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Monthly</span>
              <h4 className="font-bold text-stone-900">{PLANS.starter_monthly.name}</h4>
              <div className="text-lg font-bold font-mono text-stone-900">₹{PLANS.starter_monthly.priceInr}/mo</div>
              <p className="text-xs text-stone-600">{PLANS.starter_monthly.description}</p>
            </div>
            <RazorpayCheckout
              planId="starter_monthly"
              planName={PLANS.starter_monthly.name}
              priceInr={PLANS.starter_monthly.priceInr}
            />
          </div>

          {/* Pro */}
          <div className="editorial-card p-4 rounded-md space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">High Volume</span>
              <h4 className="font-bold text-stone-900">{PLANS.pro_monthly.name}</h4>
              <div className="text-lg font-bold font-mono text-stone-900">₹{PLANS.pro_monthly.priceInr}/mo</div>
              <p className="text-xs text-stone-600">{PLANS.pro_monthly.description}</p>
            </div>
            <RazorpayCheckout
              planId="pro_monthly"
              planName={PLANS.pro_monthly.name}
              priceInr={PLANS.pro_monthly.priceInr}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
