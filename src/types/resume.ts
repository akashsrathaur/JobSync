export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string; // e.g. "Present" or "2024-03"
  isCurrent?: boolean;
  bullets: string[]; // Enforcing [Strong Action Verb] + [Specific Technical/Domain Action] + [Measurable or Concrete Outcome]
  highlightedKeywords?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear: string;
  scoreOrGpa?: string;
}

export interface SkillCategory {
  category: string; // e.g. "Languages & Frameworks", "Cloud & Infrastructure", "Databases & Storage"
  skills: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year?: string;
}

export interface TailoredResume {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  professionalSummary: string; // Concise, recruiter-grade, 2-3 lines max. Zero "passionate/dynamic/results-driven" fluff.
  skills: SkillCategory[];
  experience: WorkExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
}

export interface RawExtractedResume {
  rawText: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
  fileSizeBytes: number;
  extractedLength: number;
  detectedName?: string;
  detectedEmail?: string;
}
