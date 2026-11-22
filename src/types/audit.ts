export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface KeywordGapItem {
  issue: string;
  impact: SeverityLevel;
  keywordsFound: string[];
  keywordsMissing: string[];
  fix: string;
}

export interface ImpactDeficitItem {
  originalBullet: string;
  flaw: string; // e.g. "Passive phrasing; missing scale, volume, or business metric context"
  suggestedMetricAngle: string; // e.g. "Mention throughput, request volume, latency reduction, or team scale"
  improvedDraft: string; // Recruiter-grade: Action Verb + Technical Action + Quantified Outcome
}

export interface StructuralFlawItem {
  section: string;
  flaw: string; // e.g. "Summary is 7 lines long with buzzwords; buried core competencies"
  recommendation: string;
}

export interface JdMismatchItem {
  requirement: string;
  candidateReality: string;
  gapType: 'MISSING_HARD_SKILL' | 'SENIORITY_FRAMING' | 'DOMAIN_MISALIGNMENT' | 'UNVERIFIED_CLAIM';
  actionableBridge: string; // How to position truthful adjacent experience without lying
}

export interface MissingHardSkillItem {
  skill: string;
  importance: 'MANDATORY' | 'PREFERRED';
  jdContext: string;
  adjacentTransferableExperience: string; // Truthful bridge, e.g. "Experience with AWS ECS transfers directly to Kubernetes concepts"
}

export interface MetricDiscoveryQuestion {
  question: string;
  targetRoleOrProject: string;
  whyItMatters: string;
  exampleAnswerFormat: string;
}

export interface ResumeWeaknessAudit {
  overallHealthScore: number; // 0 - 100
  atsAlignmentScore: number;  // 0 - 100
  impactEvidenceScore: number; // 0 - 100
  structuralClarityScore: number; // 0 - 100
  executiveVerdict: string; // Unfiltered, honest assessment for the user

  atsKeywordIssues: KeywordGapItem[];
  impactDeficits: ImpactDeficitItem[];
  structuralFlaws: StructuralFlawItem[];
  jdMismatches: JdMismatchItem[];
  missingHardSkills: MissingHardSkillItem[];
  metricDiscoveryQuestions: MetricDiscoveryQuestion[];
}

export interface TailorEngineResult {
  weaknessAudit: ResumeWeaknessAudit;
  tailoredResume: import('./resume').TailoredResume;
  atsScoreBefore: number;
  atsScoreAfter: number;
  telemetry: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
    estimatedCostInr: number;
    latencyMs: number;
  };
}
