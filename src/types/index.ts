export interface Professor {
  id: number;
  name: string;
  university: string;
  department: string;
  researchInterests: string[];
  email: string;
  publications: string[];
  matchScore?: number;
  matchDetails?: {
    researcherInterests: string[];
    professorInterests: string[];
    score: number;
  };
}

export interface Researcher {
  interests: string[];
  filename?: string;
  textLength?: number;
}

export interface MatchResult {
  success: boolean;
  matches: Professor[];
  totalMatches: number;
  query: {
    interests: string[];
    universityFilter: string | null;
    minScore: number;
    maxResults: number;
  };
}

export interface EmailTemplateResult {
  success: boolean;
  emailTemplate: string;
  professor: Professor;
}

export interface CVParseResult {
  success: boolean;
  interests: string[];
  textLength: number;
  filename: string;
  error?: string;
}
