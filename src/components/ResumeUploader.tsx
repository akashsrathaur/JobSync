'use client';

import React, { useState } from 'react';

interface ResumeUploaderProps {
  onIngestSuccess: (data: { resumeText: string; fileName: string; resumeId?: string }) => void;
  onJdChange: (jdText: string) => void;
  onTargetDetailsChange: (role: string, company: string, deepPolish: boolean) => void;
  isProcessing: boolean;
  onStartTailoring: () => void;
}

const SAMPLE_RESUME_TEXT = `Akash Sharma
Bengaluru, India | +91-9876543210 | akash.sharma@example.com | linkedin.com/in/akash-sharma-dev | github.com/akash-sharma

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 4 years of experience building web applications. Passionate and results-driven developer leveraging cutting-edge technologies to spearhead dynamic features and create synergistic user experiences.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
- Databases & Tools: MongoDB, PostgreSQL, Git, Docker, Postman

WORK EXPERIENCE
Software Engineer | Apex FinTech Solutions, Bengaluru | July 2022 – Present
- Responsible for developing customer-facing web dashboard using React and TypeScript.
- Worked on backend REST APIs in Node.js and integrated PostgreSQL database.
- Collaborated with product managers to deliver sprint items on time.
- Helped optimize database queries and resolved bugs reported by QA team.

Associate Software Engineer | CloudNine Tech, Pune | August 2020 – June 2022
- Built reusable UI components in React and styled with Tailwind CSS.
- Assisted in migrating monolithic endpoints to express microservices.
- Fixed frontend bugs and improved cross-browser responsiveness.

PROJECTS
E-Commerce Checkout Redesign | React, Node.js, PostgreSQL
- Built cart and payment checkout flow for an online marketplace.
- Integrated third-party payment gateway and tested webhooks.

EDUCATION
B.Tech in Computer Science & Engineering | Visvesvaraya Technological University (VTU) | 2016 – 2020 | CGPA: 8.2/10
`;

const SAMPLE_JD_TEXT = `Role: Senior Full-Stack Engineer (Platform & Payments)
Company: ZetaFlow Technologies
Location: Bengaluru / Hybrid (India)
Experience: 3-6 Years

About the Role:
We are looking for a Senior Full-Stack Engineer to own mission-critical payment workflows, high-throughput microservices, and high-performance React frontends. You will build resilient, distributed systems processing millions of transactions each month.

Key Responsibilities:
- Design and scale distributed backend services in TypeScript / Node.js or Go handling high RPS and low-latency p99 targets.
- Implement idempotency keys, transactional outbox patterns, and event streaming via Apache Kafka or Redis.
- Architect modern Next.js / React frontends utilizing Server Components for rapid first-contentful paint.
- Profile and optimize slow PostgreSQL queries, create composite indexes, and prevent connection pool exhaustion.
- Build resilient third-party integrations with Razorpay, Cashfree, or Stripe with webhook retry loops and constant-time HMAC signature checks.

Requirements:
- 3+ years of production experience in TypeScript, React/Next.js, Node.js, and PostgreSQL.
- Solid understanding of distributed systems fundamentals: caching layers (Redis), queue workers, rate limiting, and idempotency.
- Demonstrated experience optimizing database latency, connection pooling (PgBouncer), and index tuning.
- Understanding of web security fundamentals (OWASP Top 10, CSRF, IDOR prevention, and PII protection).
- Excellent communication and ability to explain architectural trade-offs without buzzwords.
`;

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onIngestSuccess,
  onJdChange,
  onTargetDetailsChange,
  isProcessing,
  onStartTailoring,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [jdText, setJdText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [targetCompany, setTargetCompany] = useState('ZetaFlow Technologies');
  const [deepPolish, setDeepPolish] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5 MB limit.');
      return;
    }

    setIsUploading(true);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to parse file.');
      }

      onIngestSuccess({
        resumeText: json.data.extractedSnippet,
        fileName: json.data.fileName,
        resumeId: json.data.resumeId,
      });
    } catch (err) {
      const error = err as Error;
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const loadSampleData = () => {
    setPastedText(SAMPLE_RESUME_TEXT);
    setJdText(SAMPLE_JD_TEXT);
    setSelectedFileName('sample_software_engineer_resume.txt');
    onIngestSuccess({
      resumeText: SAMPLE_RESUME_TEXT,
      fileName: 'sample_software_engineer_resume.txt',
    });
    onJdChange(SAMPLE_JD_TEXT);
    onTargetDetailsChange(targetRole, targetCompany, deepPolish);
  };

  return (
    <div className="space-y-5">
      {/* Target Role & Mode Bar */}
      <div className="editorial-card p-4 rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
            1. Target Position Details
          </span>
          <button
            type="button"
            onClick={loadSampleData}
            className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
          >
            ⚡ Load Sample Data (1-Click Test)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                onTargetDetailsChange(e.target.value, targetCompany, deepPolish);
              }}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Target Company Name
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => {
                setTargetCompany(e.target.value);
                onTargetDetailsChange(targetRole, e.target.value, deepPolish);
              }}
              placeholder="e.g. ZetaFlow or Flipkart"
              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>
        </div>

        {/* Deep Polish Mode Toggle */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="deepPolishToggle"
              checked={deepPolish}
              onChange={(e) => {
                setDeepPolish(e.target.checked);
                onTargetDetailsChange(targetRole, targetCompany, e.target.checked);
              }}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-800"
            />
            <label htmlFor="deepPolishToggle" className="text-xs text-stone-700 cursor-pointer">
              <span className="font-medium">Deep Polish Mode</span>
              <span className="text-stone-400 text-[10px] ml-1">(Escalates to Gemini 3.8 Flash for senior framing)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Resume Input Area */}
      <div className="editorial-card p-4 rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
            2. Candidate Current Resume
          </span>
          <div className="flex text-xs rounded border border-stone-200 overflow-hidden font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 py-1 ${activeTab === 'upload' ? 'bg-stone-800 text-stone-50' : 'bg-stone-50 text-stone-600'}`}
            >
              PDF / DOCX
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-2.5 py-1 ${activeTab === 'paste' ? 'bg-stone-800 text-stone-50' : 'bg-stone-50 text-stone-600'}`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
              dragActive ? 'border-stone-800 bg-stone-100' : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
            }`}
          >
            <input
              type="file"
              id="resumeFileInput"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <label htmlFor="resumeFileInput" className="cursor-pointer space-y-1 block">
              <div className="text-xs text-stone-700 font-medium">
                {isUploading ? 'Extracting text securely...' : selectedFileName ? `Selected: ${selectedFileName}` : 'Drop PDF or DOCX here, or browse file'}
              </div>
              <div className="text-[11px] text-stone-400">
                Magic byte validated • Max 5 MB • In-memory parsing
              </div>
            </label>
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                onIngestSuccess({
                  resumeText: e.target.value,
                  fileName: 'pasted_text_resume.txt',
                });
              }}
              placeholder="Paste plain text of your current resume here..."
              className="w-full text-xs font-mono p-2.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>
        )}

        {uploadError && (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded">
            {uploadError}
          </div>
        )}
      </div>

      {/* Job Description Input Area */}
      <div className="editorial-card p-4 rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
            3. Target Job Description (JD)
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            {jdText.length} characters
          </span>
        </div>

        <textarea
          rows={7}
          value={jdText}
          onChange={(e) => {
            setJdText(e.target.value);
            onJdChange(e.target.value);
          }}
          placeholder="Paste full Job Description text here..."
          className="w-full text-xs font-mono p-2.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
        />
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={isProcessing || isUploading || jdText.trim().length < 50}
        onClick={onStartTailoring}
        className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded font-mono transition shadow-sm flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-stone-50 border-t-transparent rounded-full"></span>
            Diagnosing Weaknesses & Tailoring Resume...
          </>
        ) : (
          'Diagnose Weaknesses & Generate Truthful Resume →'
        )}
      </button>
    </div>
  );
};
