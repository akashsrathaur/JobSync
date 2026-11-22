# JobSync: Truthful ATS & Resume Diagnostic Engine (India Production Architecture)

An end-to-end, production-ready web application built in India that lets users upload a resume (PDF/DOCX) and paste a Job Description (JD), diagnoses concrete weaknesses and ATS/skill gaps in the current resume, and generates a truthful, tailored resume—**without generic "AI buzzword" phrasing, robotic tone, or fabricated experience**.

---

## 1. Non-Negotiable Product & Anti-"AI-Slop" Standards

- **Strict Grounding & Zero Hallucination:** Never invents metrics, titles, dates, or skills. Missing JD hard skills are explicitly highlighted under **Missing Skills / Gaps** alongside actionable, truthful transferable bridges.
- **Banned Buzzword Discipline:** Strict system instructions ban robotic AI clichés (`delve`, `spearhead`, `passionate`, `dynamic`, `game-changer`, `results-driven`, `synergy`, `leveraging`, and decorative em-dash spam).
- **Recruiter Formula:** Enforces `[Strong Action Verb] + [Specific Technical / Domain Action] + [Measurable or Concrete Outcome / Scope]` across every bullet point.
- **Mandatory 4-Part Weakness Audit:**
  1. **ATS & Keyword Alignment Issues** (missing hard skills, non-standard section titles, parsing traps).
  2. **Impact & Evidence Deficits** (vague claims, missing numbers/scale/latency context, passive voice).
  3. **Structural & Clarity Flaws** (bloated summaries, buried projects, formatting risks).
  4. **JD Mismatch & Red Flags** (over-claims, misaligned seniority framing, irrelevant details).

---

## 2. Lowest-Cost AI Architecture & India Unit Economics

JobSync utilizes Google Gemini Flash-Lite models with **Structured JSON Schema Outputs** to achieve lowest cost per run while maintaining structured reliability:

- **Reference Exchange Rate:** 1 USD = **₹92.68** (configurable via `USD_TO_INR_RATE`).
- **Standard Token Budget:** ~3,500 input tokens + ~1,500 output tokens.
- **Gemini 3.1 Flash-Lite:** $0.25 / 1M input, $1.50 / 1M output → **₹0.290 INR per run**.
- **Gemini 3.5 Flash-Lite:** $0.30 / 1M input, $2.50 / 1M output → **₹0.445 INR per run**.
- **Gemini 3.8 Flash (Deep Polish Escalation):** $0.50 / 1M input, $3.50 / 1M output → **₹0.649 INR per run**.

### India Subscription Tiers & Margins
All prices are displayed all-inclusive for Indian consumers:
1. **Free Starter:** 2 full weakness audits + 2 tailored resumes / month (watermarked PDF).
2. **7-Day Placement Sprint Pass:** **₹99** all-inclusive (₹83.90 base + ₹15.10 18% GST). 10 runs. **Gross Margin: 92.4%**.
3. **Starter Monthly:** **₹149/month** (₹126.27 base + ₹22.73 18% GST). 15 runs. **Gross Margin: 93.1%**.
4. **Pro Monthly:** **₹399/month** (₹338.14 base + ₹60.86 18% GST). 60 runs with Deep Polish mode. **Gross Margin: 92.4%**.

*For full financial calculations, waterfall tables, and stress testing, refer to [`/docs/unit-economics.md`](docs/unit-economics.md).*

---

## 3. Zero-Trust Security Hardening (OWASP Aligned)

1. **Prompt Injection Defense:** Randomized cryptographic nonces isolate resume and JD inputs (`<UNTRUSTED_RESUME_DATA_[nonce]>`). Delimited content is treated strictly as data.
2. **File Parser Security:** Real magic byte signature validation (`%PDF-` for PDF, `PK\x03\x04` for DOCX) defeats MIME-type spoofing; max 5 MB limit; in-memory safe extraction with XXE entity expansion disabled.
3. **Object-Level Authorization (IDOR Prevention):** Every database query and export endpoint checks `WHERE id = :targetId AND userId = :authenticatedUserId`.
4. **Payment Webhook Verification:** Constant-time HMAC-SHA256 signature verification (`crypto.timingSafeEqual`) on Razorpay webhooks, with event deduplication in PostgreSQL (`PaymentEvent.eventId`) to prevent replay attacks.
5. **PII Privacy & Erasure:** Automatic redaction of phone numbers and emails in server logs; one-click permanent data purge meeting India's **DPDP Act 2023** standards.

*For complete vulnerability mappings, refer to [`/docs/security-threat-model.md`](docs/security-threat-model.md).*

---

## 4. Local Development & Setup Instructions

### Prerequisites
- Node.js 20+ or 22+
- PostgreSQL database (or Supabase/Neon connection string)

### Step 1: Clone & Configure Environment
```bash
git clone <repo-url>
cd JobSync

# Copy environment template
cp .env.example .env
```
Update `.env` with your credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobsync?schema=public"
GEMINI_API_KEY="your-gemini-api-key"
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
USD_TO_INR_RATE=92.68
```

### Step 2: Install Dependencies & Setup Prisma
```bash
npm install
npx prisma generate
npx prisma db push
```

### Step 3: Run the Economics Simulation
```bash
npm run economics
```

### Step 4: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Directory Structure

```
JobSync/
├── .env.example                       # Documented environment template
├── docs/
│   ├── unit-economics.md             # Complete India SaaS financial breakdown
│   └── security-threat-model.md      # Zero-Trust OWASP threat model
├── prisma/
│   └── schema.prisma                 # PostgreSQL schema with audit & idempotency
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Editorial layout with security headers
│   │   ├── page.tsx                  # Landing page with before/after comparison
│   │   ├── workspace/page.tsx        # 3-panel diagnostic & live resume builder
│   │   ├── pricing/page.tsx          # India INR plans & economics breakdown
│   │   ├── billing/page.tsx          # Subscription overview & Razorpay checkout
│   │   ├── account/page.tsx          # Usage ledger & 1-click permanent data purge
│   │   └── api/
│   │       ├── ingest/route.ts       # Magic-byte file validator & PII-scrubbed parser
│   │       ├── tailor/route.ts       # Structured Gemini engine & quota enforcement
│   │       ├── export/pdf/route.ts   # ATS single-column PDF generator
│   │       ├── export/docx/route.ts  # ATS-clean DOCX generator
│   │       ├── razorpay/create-order/route.ts # Server-side order creation
│   │       ├── razorpay/webhook/route.ts # Constant-time HMAC & idempotency
│   │       └── user/delete-data/route.ts # Permanent DPDP privacy purge
│   ├── components/                   # UI components (Editorial & high-contrast)
│   ├── lib/                          # Core engines (Gemini, Parser, Razorpay, Auth)
│   └── types/                        # Strict TypeScript schemas
└── package.json
```
