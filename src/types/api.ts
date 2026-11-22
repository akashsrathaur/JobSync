import { TailorEngineResult } from './audit';
import { TailoredResume } from './resume';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface IngestResponseData {
  resumeId: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
  extractedSnippet: string;
  totalCharacters: number;
  estimatedTokens: number;
}

export interface TailorRequestPayload {
  resumeText?: string;
  resumeId?: string;
  jobDescriptionText: string;
  targetRole?: string;
  targetCompany?: string;
  deepPolish?: boolean; // Escalates to deeper reasoning model
  idempotencyKey: string;
}

export type TailorResponseData = TailorEngineResult;

export interface UserSession {
  userId: string;
  email: string;
  name?: string;
  tier: 'FREE' | 'SPRINT' | 'STARTER' | 'PRO';
  creditsRemaining: number;
}
