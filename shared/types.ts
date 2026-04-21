/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * Resume data structures
 */
export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // null if current
  isCurrent: boolean;
  description: string;
  bulletPoints: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
  gpa?: string;
  details?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  date?: string;
}

export interface ResumeData {
  id?: number;
  title: string;
  template: "modern" | "classic" | "minimal" | "creative";
  contactInfo: ContactInfo;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

export interface JobDescriptionAnalysis {
  keywords: Array<{
    keyword: string;
    frequency: number;
    importance: "high" | "medium" | "low";
  }>;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
}

export interface ATSScoreResult {
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  timestamp: Date;
}

export interface RewriteResult {
  originalText: string;
  rewrittenText: string;
  keywordsIncluded: string[];
  atsScoreImprovement: number; // percentage point improvement
}

export interface SubscriptionStatus {
  tier: "free" | "pro";
  resumeCount: number;
  maxResumes: number;
  canGeneratePDF: boolean;
  canUseCoverLetterGenerator: boolean;
  canAccessTemplates: boolean;
}
