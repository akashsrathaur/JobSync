import Link from 'next/link';
import React from 'react';
import { EconomicsCalculator } from '@/components/EconomicsCalculator';
import { ScoreBadge } from '@/components/ScoreBadge';
import { PLANS } from '@/lib/economics';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';

export default function HomePage() {
  return (
    <div className="space-y-20 py-4">
      {/* Editorial Hero Section */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-stone-700 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Zero AI Buzzwords • Zero Fabricated Experience • India-First Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]">
          Diagnose real resume weaknesses. <br />
          <span className="text-stone-500 font-normal">
            Generate truthful, role-tailored resumes that pass technical recruiters.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          Most AI resume tools write generic corporate slop with words like <em>"spearheaded"</em>, <em>"leveraged"</em>, and made-up metrics that get rejected by hiring managers in India. JobSync audits your genuine gaps, fixes passive bullets, and bridges missing JD requirements without hallucinating.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/workspace"
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-mono font-semibold uppercase tracking-wider rounded transition shadow-sm"
          >
            Launch Diagnostic Workspace →
          </Link>
          <a
            href="#before-after"
            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-mono rounded transition"
          >
            See Before vs After Audit
          </a>
        </div>
      </section>

      {/* Before & After Transformation Demo */}
      <section id="before-after" className="space-y-6 scroll-mt-20">
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Real Proof Over Hype
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            How JobSync Eliminates AI-Slop & Bridges Gaps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: What AI Slop / Typical Resumes Write */}
          <div className="editorial-card p-5 rounded-md border-rose-200 bg-rose-50/20 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <span className="text-xs font-mono font-bold text-rose-800 uppercase">
                ✕ Common Resume / Generic AI Slop
              </span>
              <ScoreBadge score={42} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded border border-rose-200">
                <span className="text-[10px] font-mono text-rose-700 uppercase block font-semibold mb-1">
                  Vague & Fluffy Bullet:
                </span>
                <p className="text-stone-700 italic">
                  "Spearheaded dynamic frontend features leveraging React to supercharge customer engagement and synergy across teams."
                </p>
                <div className="text-[11px] text-rose-600 mt-2 font-mono">
                  Flaw: Banned buzzwords ("spearheaded", "leveraging", "supercharge"). Zero scale, volume, or technical specifics.
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-rose-200">
                <span className="text-[10px] font-mono text-rose-700 uppercase block font-semibold mb-1">
                  Missing Hard Skill (Fabrication Trap):
                </span>
                <p className="text-stone-700 italic">
                  Candidate only used Docker locally. Generic AI falsely claims: "5 years scaling enterprise Kubernetes clusters."
                </p>
                <div className="text-[11px] text-rose-600 mt-2 font-mono">
                  Risk: Immediate interview failure when quizzed on etcd, ingress controllers, or node affinity.
                </div>
              </div>
            </div>
          </div>

          {/* Right: JobSync Truthful Recruiter-Grade Output */}
          <div className="editorial-card p-5 rounded-md border-emerald-200 bg-emerald-50/20 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                ✓ JobSync Truthful Recruiter Standard
              </span>
              <ScoreBadge score={84} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 uppercase block font-semibold mb-1">
                  Grounded Action + Stack + Scale Formula:
                </span>
                <p className="text-stone-900 font-medium">
                  "Rebuilt checkout workflow using Next.js 14 and React Server Components, reducing initial JavaScript bundle by 38% and lowering checkout drop-off from 6.2% to 4.1%."
                </p>
                <div className="text-[11px] text-emerald-700 mt-2 font-mono">
                  Strictly grounded: Concrete tech stack, quantifiable latency/bundle metric, zero buzzwords.
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 uppercase block font-semibold mb-1">
                  Truthful Transferable Bridge (No Lies):
                </span>
                <p className="text-stone-900 font-medium">
                  Flags Kubernetes under "Missing Skills" and writes: "Containerized 12 microservices using Docker; orchestrated task definitions directly transferable to K8s pods."
                </p>
                <div className="text-[11px] text-emerald-700 mt-2 font-mono">
                  Honest: Positions transferable container expertise without fabricating production Kubernetes tenure.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Pillar Weakness Diagnostic Feature Walkthrough */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Diagnostic Standard
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            The 4-Part Resume Weakness Audit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="editorial-card p-4 rounded-md space-y-2">
            <span className="text-xs font-mono font-bold text-stone-800">01. ATS Keywords</span>
            <h4 className="text-sm font-semibold text-stone-900">Hard Skill Gap Analysis</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Finds exact missing hard skills, libraries, and frameworks required by the JD without blind keyword stuffing.
            </p>
          </div>

          <div className="editorial-card p-4 rounded-md space-y-2">
            <span className="text-xs font-mono font-bold text-stone-800">02. Evidence Deficits</span>
            <h4 className="text-sm font-semibold text-stone-900">Quantifiable Metrics</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Identifies passive claims and suggests precise technical scale questions (RPS, table size, latency) to extract real numbers.
            </p>
          </div>

          <div className="editorial-card p-4 rounded-md space-y-2">
            <span className="text-xs font-mono font-bold text-stone-800">03. Structure & Layout</span>
            <h4 className="text-sm font-semibold text-stone-900">ATS Parsing Traps</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Flattens bloated summaries, highlights buried projects, and ensures clean single-column PDF/DOCX machine readability.
            </p>
          </div>

          <div className="editorial-card p-4 rounded-md space-y-2">
            <span className="text-xs font-mono font-bold text-stone-800">04. Red Flags & Overclaims</span>
            <h4 className="text-sm font-semibold text-stone-900">Seniority Alignment</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Catches senior misalignments, domain mismatch, and unsupported buzzwords before a human recruiter rejects the profile.
            </p>
          </div>
        </div>
      </section>

      {/* Unit Economics Calculator Section */}
      <section id="economics" className="space-y-4 scroll-mt-20">
        <EconomicsCalculator />
      </section>

      {/* India Subscription Plans */}
      <section id="pricing-section" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
            India-First Pricing
          </span>
          <h2 className="text-2xl font-bold text-stone-900">
            Transparent Plans in INR (₹)
          </h2>
          <p className="text-xs text-stone-600">
            All prices are all-inclusive with 18% GST and Razorpay fee transparency. Pay via UPI, RuPay, or Cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 7-Day Sprint Pass */}
          <div className="editorial-card p-5 rounded-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-900 text-sm">
                  {PLANS.sprint_7d.name}
                </span>
                <span className="text-[10px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                  7 Days
                </span>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                ₹{PLANS.sprint_7d.priceInr}
                <span className="text-xs font-normal text-stone-500 font-mono ml-1">all-inclusive</span>
              </div>
              <p className="text-xs text-stone-600">
                {PLANS.sprint_7d.description}
              </p>
              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                {PLANS.sprint_7d.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <RazorpayCheckout
              planId="sprint_7d"
              planName={PLANS.sprint_7d.name}
              priceInr={PLANS.sprint_7d.priceInr}
            />
          </div>

          {/* Starter Monthly */}
          <div className="editorial-card p-5 rounded-lg space-y-4 border-stone-800 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-stone-900 text-stone-50 text-[10px] font-mono font-semibold uppercase rounded">
              Most Popular
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-900 text-sm">
                  {PLANS.starter_monthly.name}
                </span>
                <span className="text-[10px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                  Monthly
                </span>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                ₹{PLANS.starter_monthly.priceInr}
                <span className="text-xs font-normal text-stone-500 font-mono ml-1">/ month</span>
              </div>
              <p className="text-xs text-stone-600">
                {PLANS.starter_monthly.description}
              </p>
              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                {PLANS.starter_monthly.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <RazorpayCheckout
              planId="starter_monthly"
              planName={PLANS.starter_monthly.name}
              priceInr={PLANS.starter_monthly.priceInr}
            />
          </div>

          {/* Pro Monthly */}
          <div className="editorial-card p-5 rounded-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-900 text-sm">
                  {PLANS.pro_monthly.name}
                </span>
                <span className="text-[10px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                  Staff / Pro
                </span>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                ₹{PLANS.pro_monthly.priceInr}
                <span className="text-xs font-normal text-stone-500 font-mono ml-1">/ month</span>
              </div>
              <p className="text-xs text-stone-600">
                {PLANS.pro_monthly.description}
              </p>
              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                {PLANS.pro_monthly.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <RazorpayCheckout
              planId="pro_monthly"
              planName={PLANS.pro_monthly.name}
              priceInr={PLANS.pro_monthly.priceInr}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
