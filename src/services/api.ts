import { CVParseResult, MatchResult, EmailTemplateResult, Professor } from '../types';

const API_URL = 'http://localhost:5000/api';

// Function to parse CV and extract research interests
export const parseCV = async (file: File): Promise<CVParseResult> => {
  try {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await fetch(`${API_URL}/cv/parse`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse CV');
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing CV:', error);
    return {
      success: false,
      interests: [],
      textLength: 0,
      filename: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to get all professors
export const getProfessors = async (): Promise<Professor[]> => {
  try {
    const response = await fetch(`${API_URL}/professors`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch professors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching professors:', error);
    return [];
  }
};

// Function to match professors based on research interests
export const matchProfessors = async (
  interests: string[],
  universityFilter?: string,
  minScore?: number,
  maxResults?: number
): Promise<MatchResult> => {
  try {
    const response = await fetch(`${API_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interests,
        universityFilter,
        minScore,
        maxResults,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to match professors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error matching professors:', error);
    return {
      success: false,
      matches: [],
      totalMatches: 0,
      query: {
        interests,
        universityFilter: universityFilter || null,
        minScore: minScore || 0.1,
        maxResults: maxResults || 10,
      },
    };
  }
};

// Function to generate email template for a specific professor
export const generateEmailTemplate = async (
  interests: string[],
  professorId: number
): Promise<EmailTemplateResult> => {
  try {
    const response = await fetch(`${API_URL}/match/email-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        researcher: { interests },
        professorId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate email template');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating email template:', error);
    return {
      success: false,
      emailTemplate: '',
      professor: {} as Professor,
    };
  }
};
