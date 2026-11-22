import React from 'react';
import { EconomicsCalculator } from '@/components/EconomicsCalculator';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';
import { PLANS } from '@/lib/economics';

export default function PricingPage() {
  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
          India Pricing & Financial Transparency
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Fair, Sustainable Pricing in Indian Rupees (₹)
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          No hidden USD conversions, no unpredictable subscription traps. Every plan includes all-inclusive INR pricing with transparent 18% GST and Razorpay payment gateway calculations.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Free Tier */}
        <div className="editorial-card p-5 rounded-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-mono text-stone-500 uppercase">Tier 01</span>
            <h3 className="font-bold text-stone-900 text-lg">{PLANS.free.name}</h3>
            <div className="text-2xl font-bold text-stone-900 font-mono">₹0</div>
            <p className="text-xs text-stone-600">{PLANS.free.description}</p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              {PLANS.free.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4">
            <span className="block text-center text-xs py-2 border border-stone-200 text-stone-600 rounded font-mono">
              Included by Default
            </span>
          </div>
        </div>

        {/* 7-Day Sprint Pass */}
        <div className="editorial-card p-5 rounded-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-stone-500 uppercase">Tier 02</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded">
                Campus / Sprint
              </span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg">{PLANS.sprint_7d.name}</h3>
            <div className="text-2xl font-bold text-stone-900 font-mono">
              ₹{PLANS.sprint_7d.priceInr}
              <span className="text-xs font-normal text-stone-400 font-sans ml-1">all-in</span>
            </div>
            <p className="text-xs text-stone-600">{PLANS.sprint_7d.description}</p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              {PLANS.sprint_7d.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4">
            <RazorpayCheckout
              planId="sprint_7d"
              planName={PLANS.sprint_7d.name}
              priceInr={PLANS.sprint_7d.priceInr}
            />
          </div>
        </div>

        {/* Starter Monthly */}
        <div className="editorial-card p-5 rounded-lg space-y-4 border-stone-900 shadow-md flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-stone-900 text-stone-50 text-[10px] font-mono font-semibold uppercase rounded">
            Best Value
          </div>
          <div className="space-y-3">
            <span className="text-xs font-mono text-stone-500 uppercase">Tier 03</span>
            <h3 className="font-bold text-stone-900 text-lg">{PLANS.starter_monthly.name}</h3>
            <div className="text-2xl font-bold text-stone-900 font-mono">
              ₹{PLANS.starter_monthly.priceInr}
              <span className="text-xs font-normal text-stone-400 font-sans ml-1">/ month</span>
            </div>
            <p className="text-xs text-stone-600">{PLANS.starter_monthly.description}</p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              {PLANS.starter_monthly.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4">
            <RazorpayCheckout
              planId="starter_monthly"
              planName={PLANS.starter_monthly.name}
              priceInr={PLANS.starter_monthly.priceInr}
            />
          </div>
        </div>

        {/* Pro Monthly */}
        <div className="editorial-card p-5 rounded-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-mono text-stone-500 uppercase">Tier 04</span>
            <h3 className="font-bold text-stone-900 text-lg">{PLANS.pro_monthly.name}</h3>
            <div className="text-2xl font-bold text-stone-900 font-mono">
              ₹{PLANS.pro_monthly.priceInr}
              <span className="text-xs font-normal text-stone-400 font-sans ml-1">/ month</span>
            </div>
            <p className="text-xs text-stone-600">{PLANS.pro_monthly.description}</p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              {PLANS.pro_monthly.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4">
            <RazorpayCheckout
              planId="pro_monthly"
              planName={PLANS.pro_monthly.name}
              priceInr={PLANS.pro_monthly.priceInr}
            />
          </div>
        </div>
      </div>

      {/* Interactive Economics Engine */}
      <section className="space-y-4">
        <EconomicsCalculator />
      </section>

      {/* Billing & Tax FAQ */}
      <section className="editorial-card p-6 rounded-lg space-y-4">
        <h3 className="font-bold text-stone-900 text-base">
          Frequently Asked Questions on India Billing & Compliance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <h4 className="font-semibold text-stone-800">Are prices inclusive of 18% GST?</h4>
            <p>
              Yes. When you purchase the ₹99 or ₹149 plan, that is the exact final amount debited from your UPI or card. The 18% GST breakdown (₹15.10 or ₹22.73) is provided on your invoice.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <h4 className="font-semibold text-stone-800">What payment methods are supported?</h4>
            <p>
              We integrate Razorpay Standard Checkout supporting UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay Debit/Credit cards, Visa, Mastercard, and Netbanking across all Indian banks.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <h4 className="font-semibold text-stone-800">What happens when my runs run out?</h4>
            <p>
              You can purchase an additional 7-Day Sprint Pass or upgrade to Pro at any time. Unused runs do not expire during an active billing cycle.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <h4 className="font-semibold text-stone-800">Can I permanently delete my uploaded resumes?</h4>
            <p>
              Yes. Visit your <strong className="text-stone-800">Account & Privacy</strong> tab to trigger a 1-click permanent purge of all resumes, extracted texts, and generated records.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
