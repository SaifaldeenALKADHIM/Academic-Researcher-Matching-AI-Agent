/**
 * Matching algorithm for finding professors with similar research interests
 */

// Helper function to calculate similarity score between two arrays of keywords
const calculateSimilarityScore = (researcherInterests, professorInterests) => {
  if (!researcherInterests || !researcherInterests.length || !professorInterests || !professorInterests.length) {
    return 0;
  }

  // Normalize all interests to lowercase for comparison
  const normalizedResearcherInterests = researcherInterests.map(interest => interest.toLowerCase());
  const normalizedProfessorInterests = professorInterests.map(interest => interest.toLowerCase());

  // Count exact matches
  let exactMatches = 0;
  normalizedResearcherInterests.forEach(interest => {
    if (normalizedProfessorInterests.includes(interest)) {
      exactMatches++;
    }
  });

  // Count partial matches (one interest contains the other)
  let partialMatches = 0;
  normalizedResearcherInterests.forEach(researcherInterest => {
    normalizedProfessorInterests.forEach(professorInterest => {
      // Skip exact matches that were already counted
      if (researcherInterest === professorInterest) {
        return;
      }
      
      // Check if one interest contains the other
      if (researcherInterest.includes(professorInterest) || professorInterest.includes(researcherInterest)) {
        partialMatches++;
      }
    });
  });

  // Calculate word-level matches for more granular matching
  let wordMatches = 0;
  const researcherWords = new Set(
    normalizedResearcherInterests.flatMap(interest => 
      interest.split(/\s+/).filter(word => word.length > 3)
    )
  );
  
  const professorWords = new Set(
    normalizedProfessorInterests.flatMap(interest => 
      interest.split(/\s+/).filter(word => word.length > 3)
    )
  );

  researcherWords.forEach(word => {
    if (Array.from(professorWords).some(profWord => profWord.includes(word) || word.includes(profWord))) {
      wordMatches++;
    }
  });

  // Calculate final score (weighted sum)
  const exactMatchWeight = 1.0;
  const partialMatchWeight = 0.5;
  const wordMatchWeight = 0.2;

  const maxPossibleScore = Math.max(normalizedResearcherInterests.length, normalizedProfessorInterests.length);
  
  if (maxPossibleScore === 0) {
    return 0;
  }

  const weightedScore = (
    (exactMatches * exactMatchWeight) + 
    (partialMatches * partialMatchWeight) + 
    (wordMatches * wordMatchWeight)
  ) / maxPossibleScore;

  // Normalize to 0-1 range
  return Math.min(Math.max(weightedScore, 0), 1);
};

// Main matching function
const findMatchingProfessors = (researcherInterests, professors, options = {}) => {
  const { 
    minScore = 0.1,  // Minimum score threshold
    maxResults = 10, // Maximum number of results
    universityFilter = null // Optional university filter
  } = options;

  if (!researcherInterests || !Array.isArray(researcherInterests) || !professors || !Array.isArray(professors)) {
    return [];
  }

  // Filter professors by university if specified
  let filteredProfessors = professors;
  if (universityFilter) {
    filteredProfessors = professors.filter(prof => 
      prof.university.toLowerCase().includes(universityFilter.toLowerCase())
    );
  }

  // Calculate similarity scores
  const professorsWithScores = filteredProfessors.map(professor => {
    const similarityScore = calculateSimilarityScore(researcherInterests, professor.researchInterests);
    return {
      ...professor,
      matchScore: similarityScore,
      matchDetails: {
        researcherInterests,
        professorInterests: professor.researchInterests,
        score: similarityScore
      }
    };
  });

  // Filter by minimum score and sort by score (descending)
  const matches = professorsWithScores
    .filter(prof => prof.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);

  return matches;
};

// Generate email template based on researcher and professor information
const generateEmailTemplate = (researcher, professor) => {
  if (!researcher || !professor) {
    return '';
  }

  // Extract common research interests
  const researcherInterests = researcher.interests || [];
  const professorInterests = professor.researchInterests || [];
  
  // Find overlapping interests
  const commonInterests = researcherInterests.filter(interest => 
    professorInterests.some(profInterest => 
      profInterest.toLowerCase().includes(interest.toLowerCase()) || 
      interest.toLowerCase().includes(profInterest.toLowerCase())
    )
  );

  // Create email template
  const template = `
Subject: Research Visit Inquiry - Collaboration in ${commonInterests.join(', ')}

Dear ${professor.name},

I am a researcher with interests in ${researcherInterests.join(', ')}. I recently came across your work in ${professorInterests.join(', ')} and am particularly interested in your research on ${professorInterests[0]}.

I am writing to inquire about the possibility of a research visit to your laboratory. My current research focuses on ${researcherInterests[0]}, which I believe aligns well with your work on ${commonInterests.length > 0 ? commonInterests[0] : professorInterests[0]}.

I would be grateful for the opportunity to discuss potential collaboration possibilities with you. Please let me know if you would be open to this and if you require any additional information about my research background.

Thank you for considering my request.

Sincerely,
[Your Name]
[Your Institution]
[Your Email]
[Your Phone Number]
  `;

  return template.trim();
};

module.exports = {
  findMatchingProfessors,
  calculateSimilarityScore,
  generateEmailTemplate
};
