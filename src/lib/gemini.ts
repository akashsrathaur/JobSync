import { TailorEngineResult } from '@/types/audit';
import { calculateTokenCost, GEMINI_MODELS } from './economics';
import { buildTailoringPrompt, SYSTEM_PROMPT_RESUME_DIAGNOSTIC_AND_TAILOR } from './prompts';
import { wrapWithUntrustedBoundaries } from './security';

export interface GenerateTailoringOptions {
  resumeText: string;
  jdText: string;
  targetRole?: string;
  targetCompany?: string;
  deepPolish?: boolean;
}

/**
 * Robust JSON extraction helper that handles raw JSON or markdown-fenced code blocks
 */
function cleanAndParseJsonResponse(rawText: string): unknown {
  let cleaned = rawText.trim();
  // Strip ```json ... ``` wrapper if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  }
  return JSON.parse(cleaned.trim());
}

/**
 * Fallback heuristic generator when API key is not yet configured during local testing
 */
function generateHeuristicFallbackResult(
  resumeText: string,
  jdText: string,
  modelName: string
): TailorEngineResult {
  const jdLower = jdText.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  // Keyword extraction heuristic
  const commonTech = [
    'typescript', 'python', 'react', 'next.js', 'docker', 'kubernetes', 'aws',
    'postgresql', 'graphql', 'redis', 'kafka', 'ci/cd', 'tailwind', 'node.js',
    'go', 'java', 'microservices', 'rest api', 'system design'
  ];

  const jdKeywords = commonTech.filter(tech => jdLower.includes(tech));
  const candidateKeywords = commonTech.filter(tech => resumeLower.includes(tech));
  const missingKeywords = jdKeywords.filter(k => !candidateKeywords.includes(k));

  const atsBefore = Math.min(85, Math.max(35, Math.round((candidateKeywords.length / Math.max(1, jdKeywords.length)) * 100)));
  const atsAfter = Math.min(95, atsBefore + 18);

  return {
    atsScoreBefore: atsBefore,
    atsScoreAfter: atsAfter,
    telemetry: {
      model: modelName,
      inputTokens: 3420,
      outputTokens: 1480,
      estimatedCostUsd: 0.0031,
      estimatedCostInr: 0.287,
      latencyMs: 1450,
    },
    weaknessAudit: {
      overallHealthScore: atsBefore,
      atsAlignmentScore: atsBefore,
      impactEvidenceScore: 54,
      structuralClarityScore: 68,
      executiveVerdict: `Your resume demonstrates core domain competence, but lacks quantifiable business impact and omits ${missingKeywords.length} key technical terms mentioned in the job description.`,
      atsKeywordIssues: [
        {
          issue: `Missing ${missingKeywords.length} targeted competencies explicitly stated in the job description.`,
          impact: missingKeywords.length > 3 ? 'CRITICAL' : 'HIGH',
          keywordsFound: candidateKeywords.slice(0, 8),
          keywordsMissing: missingKeywords.length > 0 ? missingKeywords : ['system design', 'distributed tracing'],
          fix: 'Incorporate missing hard skills into your technical skills matrix and project bullet points where you have adjacent experience.',
        },
      ],
      impactDeficits: [
        {
          originalBullet: 'Responsible for developing RESTful APIs and collaborating with frontend teams.',
          flaw: 'Vague duty-oriented description lacking metrics, latency improvements, request scale, or technical stack context.',
          suggestedMetricAngle: 'Mention requests per second (RPS), endpoint response times, or error rate reduction.',
          improvedDraft: 'Engineered 12 RESTful API endpoints in Node.js/PostgreSQL handling 15,000 daily requests, reducing p95 response latency from 450ms to 180ms.',
        },
        {
          originalBullet: 'Worked on database optimization and bug fixing.',
          flaw: 'Zero technical specificity on indexing, query planning, or measured speed-up.',
          suggestedMetricAngle: 'Specify slow query log reductions, index strategies, or table sizes.',
          improvedDraft: 'Optimized PostgreSQL query execution plans and applied composite indexes across 2.4M-row tables, cutting reporting query latency by 65%.',
        },
      ],
      structuralFlaws: [
        {
          section: 'Professional Summary',
          flaw: 'Contains generic self-descriptions like "passionate and results-driven problem solver".',
          recommendation: 'Replace fluffy buzzwords with your exact years of experience, primary technical stack, and core architectural domain.',
        },
        {
          section: 'Work Experience',
          flaw: 'Key technical achievements are buried beneath passive duty descriptions.',
          recommendation: 'Lead with strong action verbs: "Architected", "Engineered", "Scaled", "Streamlined".',
        },
      ],
      jdMismatches: missingKeywords.slice(0, 3).map((kw) => ({
        requirement: `Demonstrated expertise in ${kw.toUpperCase()}`,
        candidateReality: `Resume mentions adjacent stack but does not explicitly reference production ${kw}.`,
        gapType: 'MISSING_HARD_SKILL',
        actionableBridge: `Position your experience with related tools and clarify architectural fundamentals transferable to ${kw}.`,
      })),
      missingHardSkills: missingKeywords.slice(0, 4).map((kw) => ({
        skill: kw,
        importance: 'MANDATORY',
        jdContext: `Job description emphasizes ${kw} as a core technical requirement for this position.`,
        adjacentTransferableExperience: `Demonstrate foundational architectural patterns that transfer directly to ${kw}.`,
      })),
      metricDiscoveryQuestions: [
        {
          question: 'What was the peak user traffic, throughput (RPS), or database volume handled by your primary backend service?',
          targetRoleOrProject: 'Most recent software engineering position',
          whyItMatters: 'Recruiters and ATS parsers scan for concrete scale indicators (RPS, users, transactions).',
          exampleAnswerFormat: 'Handled ~4,500 peak requests per second with 99.95% uptime.',
        },
        {
          question: 'Did your refactoring, caching, or code optimization reduce cloud bills, memory footprints, or page load times?',
          targetRoleOrProject: 'Frontend or backend optimization projects',
          whyItMatters: 'Demonstrates tangible cost awareness and engineering discipline.',
          exampleAnswerFormat: 'Reduced AWS CloudWatch log ingestion costs by 32% via structured sampling.',
        },
      ],
    },
    tailoredResume: {
      contactInfo: {
        fullName: 'Candidate Name',
        email: 'candidate@example.com',
        phone: '+91-9876543210',
        location: 'Bengaluru, India',
        linkedinUrl: 'https://linkedin.com/in/candidate',
        githubUrl: 'https://github.com/candidate',
      },
      professionalSummary: `Full-Stack Software Engineer with proven experience designing scalable web applications in TypeScript, React, and Node.js. Track record of optimizing high-traffic endpoints, reducing latency, and building resilient distributed systems.`,
      skills: [
        {
          category: 'Languages & Frameworks',
          skills: candidateKeywords.length > 0 ? candidateKeywords : ['TypeScript', 'JavaScript', 'Node.js', 'React', 'Next.js'],
        },
        {
          category: 'Databases & Infrastructure',
          skills: ['PostgreSQL', 'Redis', 'Docker', 'AWS (S3, ECS)', 'Git', 'Linux'],
        },
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Technology Solutions Pvt Ltd',
          role: 'Software Engineer',
          location: 'Bengaluru, India',
          startDate: '2022-06',
          endDate: 'Present',
          isCurrent: true,
          bullets: [
            'Architected 14 asynchronous microservice endpoints in TypeScript and Node.js handling 40,000+ daily requests with 99.9% availability.',
            'Implemented Redis caching layer for heavy analytics dashboard queries, reducing database load by 45% and lowering p99 response times to under 120ms.',
            'Refactored legacy database schemas with PostgreSQL composite indexes, eliminating table lock bottlenecks during peak traffic periods.',
          ],
          highlightedKeywords: candidateKeywords.slice(0, 4),
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Distributed Event Processing Engine',
          role: 'Lead Developer',
          technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          bullets: [
            'Engineered resilient queuing pipeline processing 5,000 incoming webhook events per minute with zero data loss.',
            'Implemented constant-time HMAC signature validation and database idempotency keys to eliminate duplicate transaction processing.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'National Institute of Technology',
          degree: 'Bachelor of Technology (B.Tech)',
          fieldOfStudy: 'Computer Science and Engineering',
          graduationYear: '2022',
        },
      ],
    },
  };
}

/**
 * Main Gemini AI invocation function with strict JSON parsing and cost tracking
 */
export async function generateResumeTailoringAndAudit(
  options: GenerateTailoringOptions
): Promise<TailorEngineResult> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = options.deepPolish
    ? (process.env.GEMINI_DEEP_POLISH_MODEL || 'gemini-3.8-flash')
    : (process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite');

  // If GEMINI_API_KEY is not configured or in test mode, return structured heuristic
  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.startsWith('rzp_test')) {
    return generateHeuristicFallbackResult(options.resumeText, options.jdText, modelName);
  }

  // Wrap untrusted inputs with boundary nonces
  const wrappedResume = wrapWithUntrustedBoundaries(options.resumeText, 'RESUME');
  const wrappedJd = wrapWithUntrustedBoundaries(options.jdText, 'JOB_DESCRIPTION');

  const userPrompt = buildTailoringPrompt({
    wrappedResumeText: wrappedResume.wrappedText,
    wrappedJdText: wrappedJd.wrappedText,
    targetRole: options.targetRole,
    targetCompany: options.targetCompany,
    deepPolish: options.deepPolish,
  });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT_RESUME_DIAGNOSTIC_AND_TAILOR }],
    },
    generationConfig: {
      temperature: 0.2, // Low temperature for deterministic, factual rewriting
      topP: 0.85,
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const resultData = await response.json();
  const candidateText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Empty response received from Gemini API.');
  }

  const parsed = cleanAndParseJsonResponse(candidateText) as Record<string, unknown>;
  const latencyMs = Date.now() - startTime;

  // Extract real token usage metadata from Gemini response
  const usageMetadata = resultData.usageMetadata || {};
  const inputTokens = usageMetadata.promptTokenCount || 3500;
  const outputTokens = usageMetadata.candidatesTokenCount || 1500;

  const cost = calculateTokenCost(
    inputTokens,
    outputTokens,
    (modelName.includes('3.8') ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite') as keyof typeof GEMINI_MODELS
  );

  return {
    weaknessAudit: parsed.weaknessAudit as import('@/types/audit').ResumeWeaknessAudit,
    tailoredResume: parsed.tailoredResume as import('@/types/resume').TailoredResume,
    atsScoreBefore: Number(parsed.atsScoreBefore) || 45,
    atsScoreAfter: Number(parsed.atsScoreAfter) || 78,
    telemetry: {
      model: modelName,
      inputTokens,
      outputTokens,
      estimatedCostUsd: Number(cost.costUsd.toFixed(6)),
      estimatedCostInr: Number(cost.costInr.toFixed(3)),
      latencyMs,
    },
  };
}
