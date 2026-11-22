# JobSync: India Unit Economics & AI Margin Architecture

## 1. Executive Summary & Macro Assumptions (India 2026)

JobSync is designed to operate with high gross margins (>80% on paid tiers) while delivering recruiter-grade resume diagnostics and tailoring without AI buzzwords or hallucinations.

| Parameter | Value | Notes |
|:---|:---|:---|
| **Exchange Rate** | **1 USD = ₹92.68** | Configurable via `USD_TO_INR_RATE` |
| **GST Rate** | **18.0%** | Standard Indian digital services tax |
| **Razorpay Fee** | **2.0% + 18% GST on fee** | Effective gateway deduction: **2.36% of gross** |
| **Fixed Overhead** | **₹10,000 / month** | Managed Postgres (Supabase/Neon), Vercel Pro, Domain, SSL |
| **Target Token Budget** | **3,500 Input / 1,500 Output** | Structured JSON schema with anti-injection prompts |

---

## 2. Gemini Model Pricing & Per-Run Token Math

We leverage Google's Flash-Lite models for our primary pipeline, achieving near-zero token overhead:

### A. Token Rates (USD & INR at ₹92.68)
1. **Gemini 3.1 Flash-Lite (Default Engine)**
   - Input: **$0.25 / 1M tokens** (~₹0.0232 / 1,000 tokens)
   - Output: **$1.50 / 1M tokens** (~₹0.1390 / 1,000 tokens)
   - Cost for 3,500 in + 1,500 out:
     - Input Cost: `(3,500 / 1,000,000) * $0.25 * 92.68` = **₹0.0811**
     - Output Cost: `(1,500 / 1,000,000) * $1.50 * 92.68` = **₹0.2085**
     - **Total AI Token Cost Per Run = ₹0.290 INR** ($0.003125 USD)

2. **Gemini 3.5 Flash-Lite (High Precision Mode)**
   - Input: **$0.30 / 1M tokens**
   - Output: **$2.50 / 1M tokens**
   - Input Cost: `(3,500 / 1M) * $0.30 * 92.68` = **₹0.0973**
   - Output Cost: `(1,500 / 1M) * $2.50 * 92.68` = **₹0.3476**
   - **Total AI Token Cost Per Run = ₹0.445 INR** ($0.0048 USD)

3. **Gemini 3.8 Flash (Deep Polish Escalation)**
   - Input: **$0.50 / 1M tokens**
   - Output: **$3.50 / 1M tokens**
   - **Total AI Token Cost Per Run = ₹0.649 INR** ($0.0070 USD)

### B. Marginal Infrastructure Overhead per Run
- In-memory PDF / DOCX streaming generation: ~**₹0.03**
- PostgreSQL transaction write & ledger audit: ~**₹0.02**
- **Total Blended Per-Run COGS on Gemini 3.1 Flash-Lite = ~₹0.34 INR**

---

## 3. Subscription Tier Economics (INR)

All Indian pricing is presented transparently as all-inclusive to eliminate checkout friction.

### Tier 1: Free Starter
- **Price:** ₹0
- **Allocation:** 2 full weakness audits + 2 tailored resumes / month (watermarked PDF export).
- **Cost to Company per Active Free User:**
  - AI COGS (2 runs × ₹0.290): ₹0.58
  - Infra & storage: ₹0.30
  - **Net CAC/Acquisition Cost per active user: ~₹0.88 / month**
  - Serves as the zero-friction viral hook.

### Tier 2: 7-Day Placement Sprint Pass
- **Gross Price:** **₹99** (all-inclusive)
- **Allocation:** 10 tailoring runs (valid 7 days)
- **Base Revenue (Net of 18% GST):** `₹99 / 1.18` = **₹83.90**
- **18% GST Liability:** **₹15.10**
- **Razorpay Fee (2.36% of ₹99):** **₹2.34**
- **Net Bank Payout:** **₹81.56**
- **Expected Utilization:** 70% of runs consumed (7 runs used):
  - AI COGS (7 runs × ₹0.290): ₹2.03
  - Infra & rendering: ₹2.00
  - **Total COGS:** **₹4.03**
- **Net Contribution Margin:** `₹81.56 - ₹4.03` = **₹77.53 per user**
- **Gross Margin %:** **92.4%**
- **Break-even to cover ₹10,000 monthly fixed costs:** **129 sprint users/month**

### Tier 3: Starter Monthly (Flagship)
- **Gross Price:** **₹149 / month** (all-inclusive)
- **Allocation:** 15 tailoring runs / month
- **Base Revenue:** `₹149 / 1.18` = **₹126.27**
- **18% GST Liability:** **₹22.73**
- **Razorpay Fee (2.36% of ₹149):** **₹3.52**
- **Net Bank Payout:** **₹122.75**
- **Expected Utilization:** 70% (11 runs used):
  - AI COGS (11 runs × ₹0.290): ₹3.19
  - Infra & storage: ₹2.00
  - **Total COGS:** **₹5.19**
- **Net Contribution Margin:** `₹122.75 - ₹5.19` = **₹117.56 per user**
- **Gross Margin %:** **93.1%**
- **Break-even:** **86 subscribers/month**

### Tier 4: Pro Career Pass
- **Gross Price:** **₹399 / month** (all-inclusive)
- **Allocation:** 60 tailoring runs / month + Deep Polish mode (Gemini 3.8 Flash escalation)
- **Base Revenue:** `₹399 / 1.18` = **₹338.14**
- **18% GST Liability:** **₹60.86**
- **Razorpay Fee (2.36% of ₹399):** **₹9.42**
- **Net Bank Payout:** **₹328.72**
- **Expected Utilization:** 50% (30 runs used, with 10 Deep Polish runs):
  - Standard AI COGS (20 runs × ₹0.290): ₹5.80
  - Deep Polish AI COGS (10 runs × ₹0.649): ₹6.49
  - Infra, egress & high-res exports: ₹4.00
  - **Total COGS:** **₹16.29**
- **Net Contribution Margin:** `₹328.72 - ₹16.29` = **₹312.43 per user**
- **Gross Margin %:** **92.4%**
- **Break-even:** **33 subscribers/month**

---

## 4. Financial Sensitivity & Stress Testing

| Scenario | USD/INR | Avg Run Usage | Gateway Fee | Contribution Margin (Starter ₹149) | Gross Margin % |
|:---|:---|:---|:---|:---|:---|
| **Base Case** | 92.68 | 70% (11 runs) | 2.36% | **₹117.56** | **93.1%** |
| **Rupee Depreciation (₹100/$)**| 100.00| 70% (11 runs) | 2.36% | **₹117.31** | **92.9%** |
| **Heavy Usage (100% of runs)**| 92.68 | 100% (15 runs) | 2.36% | **₹116.40** | **92.2%** |
| **High Gateway Tier (3% + GST)**| 92.68| 70% (11 runs) | 3.54% | **₹115.80** | **91.7%** |

**Conclusion:** Even under extreme usage and rupee depreciation, gross margins remain solidly **above 91%** across all paid tiers due to the aggressive unit cost efficiency of `gemini-3.1-flash-lite`.
