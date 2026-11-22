import { PlanConfig, PlanEconomicsBreakdown, PlanId } from '@/types/billing';

/**
 * India SaaS Unit Economics Math Engine
 * Configurable via environment variables with real India 2026 baseline defaults.
 */
export const DEFAULT_USD_TO_INR = 92.68;
export const DEFAULT_GST_RATE = 0.18; // 18% GST
export const DEFAULT_GATEWAY_FEE_RATE = 0.02; // 2.0% standard Razorpay rate
export const DEFAULT_GATEWAY_GST_RATE = 0.18; // 18% GST levied on payment gateway fee
// Effective gateway cost = 2.0% * 1.18 = 2.36% of transaction value

export const GEMINI_MODELS = {
  'gemini-3.1-flash-lite': {
    name: 'Gemini 3.1 Flash-Lite (Default Engine)',
    inputPricePerMillionUsd: 0.25,
    outputPricePerMillionUsd: 1.50,
  },
  'gemini-3.5-flash-lite': {
    name: 'Gemini 3.5 Flash-Lite (High Precision Extraction)',
    inputPricePerMillionUsd: 0.30,
    outputPricePerMillionUsd: 2.50,
  },
  'gemini-3.8-flash': {
    name: 'Gemini 3.8 Flash (Deep Polish Mode)',
    inputPricePerMillionUsd: 0.50,
    outputPricePerMillionUsd: 3.50,
  },
} as const;

export interface TokenBudget {
  inputTokens: number;
  outputTokens: number;
}

export const STANDARD_TOKEN_BUDGET: TokenBudget = {
  inputTokens: 3500, // Anti-injection prompt + rubric + resume text + JD text
  outputTokens: 1500, // Structured JSON audit + gap roadmap + rewritten resume
};

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    description: 'Full weakness diagnosis + 2 truthful role rewrites per month',
    priceInr: 0,
    period: 'lifetime_free',
    includedTailorRuns: 2,
    features: [
      '2 Full Resume Weakness Audits / month',
      '2 Truthful Role-Tailored Resumes',
      'ATS & Missing Skill Gap Analysis',
      'Watermarked PDF / Standard Text Export',
      'Zero AI-slop guarantee',
    ],
  },
  sprint_7d: {
    id: 'sprint_7d',
    name: '7-Day Placement Sprint',
    badge: 'Popular for Campus & Active Job Hunt',
    description: 'High-intensity 7-day pass for placement rounds & immediate openings',
    priceInr: 99, // All-inclusive INR (₹83.90 base + ₹15.10 GST)
    period: '7_days',
    includedTailorRuns: 10,
    features: [
      '10 High-Precision Tailoring Runs',
      '10 Comprehensive Weakness Audits',
      'Clean Single-Column ATS PDF & DOCX Exports',
      'Metric Discovery Questions for Real Quantifiable Proof',
      'Valid for 7 Days (UPI / Card / Netbanking)',
    ],
  },
  starter_monthly: {
    id: 'starter_monthly',
    name: 'Starter Monthly',
    badge: 'Best for Active Seekers',
    description: 'Consistent applications with tailored resumes each month',
    priceInr: 149, // All-inclusive INR (₹126.27 base + ₹22.73 GST)
    period: 'monthly',
    includedTailorRuns: 15,
    features: [
      '15 Tailoring & Audit Runs per month',
      'Clean ATS PDF & DOCX Exports (No watermark)',
      'Inline Customization & Bullet Regenerator',
      'Missing Skill Transferability Bridges',
      'Audit History & Version Tracking',
    ],
    recommended: true,
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Career Pass',
    badge: 'For Senior & Multi-Domain Engineers',
    description: 'Unlimited depth, Deep Polish mode, and high-volume iterations',
    priceInr: 399, // All-inclusive INR (₹338.14 base + ₹60.86 GST)
    period: 'monthly',
    includedTailorRuns: 60,
    features: [
      '60 Tailoring & Audit Runs per month',
      'Deep Polish Mode with escalated Gemini 3.8 reasoning',
      'Priority Ingestion & Unlimited PDF/DOCX Exports',
      'Direct Recruiter Bullet Comparison View',
      'Permanent Privacy Data Purge on Demand',
    ],
  },
};

/**
 * Calculates raw AI token cost for a single run
 */
export function calculateTokenCost(
  inputTokens: number = STANDARD_TOKEN_BUDGET.inputTokens,
  outputTokens: number = STANDARD_TOKEN_BUDGET.outputTokens,
  modelKey: keyof typeof GEMINI_MODELS = 'gemini-3.1-flash-lite',
  usdToInr: number = DEFAULT_USD_TO_INR
): {
  costUsd: number;
  costInr: number;
  inputCostInr: number;
  outputCostInr: number;
} {
  const model = GEMINI_MODELS[modelKey];
  const inputCostUsd = (inputTokens / 1_000_000) * model.inputPricePerMillionUsd;
  const outputCostUsd = (outputTokens / 1_000_000) * model.outputPricePerMillionUsd;
  const costUsd = inputCostUsd + outputCostUsd;
  const costInr = costUsd * usdToInr;

  return {
    costUsd,
    costInr,
    inputCostInr: inputCostUsd * usdToInr,
    outputCostInr: outputCostUsd * usdToInr,
  };
}

/**
 * Total COGS per run including AI tokens and marginal server overhead
 * (In-memory parser, PDF/DOCX generation, DB write, SSL/bandwidth)
 */
export function calculateTotalPerRunCogsInr(
  modelKey: keyof typeof GEMINI_MODELS = 'gemini-3.1-flash-lite',
  usdToInr: number = DEFAULT_USD_TO_INR,
  infraMarginalOverheadInr: number = 0.05 // ₹0.05 per run serverless compute/export overhead
): number {
  const tokenCost = calculateTokenCost(
    STANDARD_TOKEN_BUDGET.inputTokens,
    STANDARD_TOKEN_BUDGET.outputTokens,
    modelKey,
    usdToInr
  );
  return tokenCost.costInr + infraMarginalOverheadInr;
}

/**
 * Compute exhaustive economics breakdown for a given subscription tier
 */
export function calculateTierEconomics(
  planId: PlanId,
  options?: {
    usdToInr?: number;
    gstRate?: number;
    gatewayRate?: number;
    gatewayGstRate?: number;
    modelKey?: keyof typeof GEMINI_MODELS;
    averageUtilizationRate?: number; // Real user behavior: e.g. 70% of runs utilized
    fixedMonthlyCostInr?: number; // Hosting (Vercel/Fly/AWS) + Postgres DB + domain: ~₹10,000/mo
  }
): PlanEconomicsBreakdown {
  const usdToInr = options?.usdToInr ?? Number(process.env.USD_TO_INR_RATE || DEFAULT_USD_TO_INR);
  const gstRate = options?.gstRate ?? DEFAULT_GST_RATE;
  const gatewayRate = options?.gatewayRate ?? DEFAULT_GATEWAY_FEE_RATE;
  const gatewayGstRate = options?.gatewayGstRate ?? DEFAULT_GATEWAY_GST_RATE;
  const modelKey = options?.modelKey ?? 'gemini-3.1-flash-lite';
  const averageUtilizationRate = options?.averageUtilizationRate ?? 0.70;
  const fixedMonthlyCostInr = options?.fixedMonthlyCostInr ?? 10_000;

  const plan = PLANS[planId];
  const grossPriceInr = plan.priceInr;

  // Indian consumer pricing: if gross price is ₹99 all-inclusive:
  // Base Price = Gross / (1 + 0.18)
  // GST = Gross - Base
  const basePriceInr = grossPriceInr > 0 ? grossPriceInr / (1 + gstRate) : 0;
  const gstInr = grossPriceInr - basePriceInr;

  // Payment gateway fee: 2% of gross + 18% GST on that 2% = 2.36% of gross
  const effectiveGatewayFeeRate = gatewayRate * (1 + gatewayGstRate);
  const gatewayFeeInr = grossPriceInr > 0 ? grossPriceInr * effectiveGatewayFeeRate : 0;

  // Net revenue deposited to merchant bank account:
  // Gross - Gateway Fee - GST Liability
  const netRevenueInr = Math.max(0, basePriceInr - gatewayFeeInr);

  // Utilization & AI COGS
  const expectedRunsUsed = Math.max(1, Math.round(plan.includedTailorRuns * averageUtilizationRate));
  const aiCostPerRun = calculateTotalPerRunCogsInr(modelKey, usdToInr);
  const totalAiCogsInr = expectedRunsUsed * aiCostPerRun;

  // Marginal infrastructure per user (storage, session DB, egress)
  const infraCogsPerUserInr = planId === 'free' ? 0.30 : 2.00;
  const totalCogsInr = totalAiCogsInr + infraCogsPerUserInr;

  // Net Contribution Margin = Net Revenue - Total COGS
  const netContributionMarginInr = planId === 'free'
    ? -totalCogsInr
    : netRevenueInr - totalCogsInr;

  const grossMarginPercent = grossPriceInr > 0
    ? (netContributionMarginInr / basePriceInr) * 100
    : 0;

  // Break-even paid users required to cover fixed costs
  const breakEvenUsers = netContributionMarginInr > 0
    ? Math.ceil(fixedMonthlyCostInr / netContributionMarginInr)
    : 0;

  return {
    planId,
    planName: plan.name,
    grossPriceInr: Number(grossPriceInr.toFixed(2)),
    basePriceInr: Number(basePriceInr.toFixed(2)),
    gstInr: Number(gstInr.toFixed(2)),
    gatewayFeeInr: Number(gatewayFeeInr.toFixed(2)),
    netRevenueInr: Number(netRevenueInr.toFixed(2)),
    runsAllocated: plan.includedTailorRuns,
    expectedRunUsageRate: averageUtilizationRate,
    expectedRunsUsed,
    geminiModel: modelKey,
    aiCostPerRunInr: Number(aiCostPerRun.toFixed(3)),
    totalAiCogsInr: Number(totalAiCogsInr.toFixed(2)),
    infraCogsPerUserInr: Number(infraCogsPerUserInr.toFixed(2)),
    totalCogsInr: Number(totalCogsInr.toFixed(2)),
    netContributionMarginInr: Number(netContributionMarginInr.toFixed(2)),
    grossMarginPercent: Number(grossMarginPercent.toFixed(1)),
    breakEvenUsersForFixedCosts: breakEvenUsers,
  };
}

/**
 * Returns complete economics overview across all tiers
 */
export function getAllTierEconomics() {
  return {
    free: calculateTierEconomics('free'),
    sprint_7d: calculateTierEconomics('sprint_7d'),
    starter_monthly: calculateTierEconomics('starter_monthly'),
    pro_monthly: calculateTierEconomics('pro_monthly'),
    models: {
      'gemini-3.1-flash-lite': calculateTokenCost(3500, 1500, 'gemini-3.1-flash-lite'),
      'gemini-3.5-flash-lite': calculateTokenCost(3500, 1500, 'gemini-3.5-flash-lite'),
      'gemini-3.8-flash': calculateTokenCost(3500, 1500, 'gemini-3.8-flash'),
    },
    assumptions: {
      usdToInr: DEFAULT_USD_TO_INR,
      gstPercent: 18,
      gatewayFeePercent: 2.0,
      gatewayGstPercent: 18,
      effectiveGatewayRatePercent: 2.36,
      standardInputTokens: STANDARD_TOKEN_BUDGET.inputTokens,
      standardOutputTokens: STANDARD_TOKEN_BUDGET.outputTokens,
    },
  };
}

// Standalone execution for testing: `npm run economics` or `tsx src/lib/economics.ts`
if (typeof require !== 'undefined' && require.main === module) {
  console.log('========================================================================');
  console.log(' JOBSYNC: INDIA SAAS UNIT ECONOMICS MATH & MARGIN ANALYSIS (2026)');
  console.log(` Reference Rate: 1 USD = ₹${DEFAULT_USD_TO_INR}`);
  console.log('========================================================================\n');

  const all = getAllTierEconomics();
  console.log('--- AI MODEL PER-RUN COST (3,500 In / 1,500 Out) ---');
  for (const [key, data] of Object.entries(all.models)) {
    console.log(`- ${key}: $${data.costUsd.toFixed(5)} USD -> ₹${data.costInr.toFixed(3)} INR per tailoring run`);
  }

  console.log('\n--- TIER CONTRIBUTION MARGIN & UNIT ECONOMICS ---');
  for (const tier of [all.sprint_7d, all.starter_monthly, all.pro_monthly]) {
    console.log(`\nPlan: ${tier.planName} (Gross ₹${tier.grossPriceInr})`);
    console.log(`  Base Revenue (Excl 18% GST)   : ₹${tier.basePriceInr}`);
    console.log(`  18% GST Liability             : ₹${tier.gstInr}`);
    console.log(`  Razorpay Fee (2% + 18% GST)   : ₹${tier.gatewayFeeInr}`);
    console.log(`  Net Bank Payout               : ₹${tier.netRevenueInr}`);
    console.log(`  Expected Runs Consumed        : ${tier.expectedRunsUsed} of ${tier.runsAllocated} allocated`);
    console.log(`  AI COGS (${tier.geminiModel}) : ₹${tier.totalAiCogsInr}`);
    console.log(`  Infra & Rendering COGS        : ₹${tier.infraCogsPerUserInr}`);
    console.log(`  Total User COGS               : ₹${tier.totalCogsInr}`);
    console.log(`  Net Contribution Margin       : ₹${tier.netContributionMarginInr} per user`);
    console.log(`  Gross Margin %                : ${tier.grossMarginPercent}%`);
    console.log(`  Break-even Users (₹10k overhead): ${tier.breakEvenUsersForFixedCosts} paid users`);
  }
}
