'use client';

import React, { useState } from 'react';
import { DEFAULT_USD_TO_INR, calculateTierEconomics, GEMINI_MODELS } from '@/lib/economics';
import { PlanId } from '@/types/billing';

export const EconomicsCalculator: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<PlanId>('starter_monthly');
  const [modelKey, setModelKey] = useState<keyof typeof GEMINI_MODELS>('gemini-3.1-flash-lite');
  const [usdToInr, setUsdToInr] = useState<number>(DEFAULT_USD_TO_INR);
  const [utilizationRate, setUtilizationRate] = useState<number>(0.70);

  const econ = calculateTierEconomics(selectedTier, {
    usdToInr,
    modelKey,
    averageUtilizationRate: utilizationRate,
  });

  return (
    <div className="editorial-card p-6 rounded-lg space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
          Transparent Unit Economics Math Engine
        </span>
        <h3 className="text-lg font-semibold text-stone-900 mt-1">
          India Pricing, 18% GST & AI Token Margins
        </h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
          See exactly where every Rupee goes: from Razorpay gateway fees and 18% GST down to Gemini token costs and net profit margin.
        </p>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <label className="block text-stone-600 mb-1 font-medium">Select Subscription Tier</label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as PlanId)}
            className="w-full p-2 border border-stone-300 rounded bg-stone-50 focus:bg-white"
          >
            <option value="sprint_7d">₹99 - 7-Day Sprint Pass</option>
            <option value="starter_monthly">₹149 - Starter Monthly</option>
            <option value="pro_monthly">₹399 - Pro Monthly</option>
            <option value="free">₹0 - Free Tier</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-600 mb-1 font-medium">Gemini AI Model</label>
          <select
            value={modelKey}
            onChange={(e) => setModelKey(e.target.value as keyof typeof GEMINI_MODELS)}
            className="w-full p-2 border border-stone-300 rounded bg-stone-50 focus:bg-white"
          >
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite ($0.25/$1.50 per 1M)</option>
            <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite ($0.30/$2.50 per 1M)</option>
            <option value="gemini-3.8-flash">Gemini 3.8 Flash ($0.50/$3.50 per 1M)</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-600 mb-1 font-medium">Exchange Rate (USD to INR)</label>
          <input
            type="number"
            step="0.01"
            value={usdToInr}
            onChange={(e) => setUsdToInr(parseFloat(e.target.value) || DEFAULT_USD_TO_INR)}
            className="w-full p-2 border border-stone-300 rounded bg-stone-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Financial Waterfall Breakdown */}
      <div className="bg-stone-50 border border-stone-200 rounded-md p-4 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-stone-900 font-bold border-b border-stone-200 pb-2">
          <span>Gross Consumer Price (All-Inclusive INR)</span>
          <span className="text-sm">₹{econ.grossPriceInr.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Base Revenue (Excluding 18% GST)</span>
          <span>₹{econ.basePriceInr.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-rose-700">
          <span>Less: 18% Indian GST Liability</span>
          <span>- ₹{econ.gstInr.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Less: Razorpay Fee (2.0% + 18% GST on fee = 2.36%)</span>
          <span>- ₹{econ.gatewayFeeInr.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-stone-800 font-semibold border-t border-stone-200 pt-2">
          <span>Net Bank Payout (Deposited to Merchant)</span>
          <span>₹{econ.netRevenueInr.toFixed(2)}</span>
        </div>

        {/* Cost of Goods Sold */}
        <div className="border-t border-dashed border-stone-200 pt-2 space-y-1">
          <div className="flex justify-between text-stone-600">
            <span>Runs Allocated / Expected Consumed</span>
            <span>{econ.runsAllocated} / {econ.expectedRunsUsed} runs ({(econ.expectedRunUsageRate * 100).toFixed(0)}% util)</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>AI Token Cost per Run (3.5k In / 1.5k Out)</span>
            <span>₹{econ.aiCostPerRunInr.toFixed(3)}</span>
          </div>

          <div className="flex justify-between text-rose-700">
            <span>Total AI COGS ({econ.expectedRunsUsed} runs × ₹{econ.aiCostPerRunInr})</span>
            <span>- ₹{econ.totalAiCogsInr.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-rose-700">
            <span>Infra & Rendering Overhead (Postgres, PDF/DOCX)</span>
            <span>- ₹{econ.infraCogsPerUserInr.toFixed(2)}</span>
          </div>
        </div>

        {/* Net Contribution & Margin */}
        <div className="border-t-2 border-stone-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-stone-500 uppercase block font-sans font-semibold">
              Net Contribution Margin Per User
            </span>
            <span className="text-base font-bold text-emerald-700">
              ₹{econ.netContributionMarginInr.toFixed(2)}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-stone-500 uppercase block font-sans font-semibold">
              Gross Margin %
            </span>
            <span className="text-base font-bold text-stone-900">
              {econ.grossMarginPercent}%
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-stone-500 uppercase block font-sans font-semibold">
              Break-Even Paid Users (₹10k Fixed Costs)
            </span>
            <span className="text-sm font-semibold text-stone-800">
              {econ.breakEvenUsersForFixedCosts} subscribers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
