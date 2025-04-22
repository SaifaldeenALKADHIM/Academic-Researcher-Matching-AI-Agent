const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text content from a text file
 * @param {string} filePath - Path to the text file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromTXT = async (filePath) => {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return text;
  } catch (error) {
    console.error('Error extracting text from text file:', error);
    throw new Error('Failed to extract text from text file');
  }
};

/**
 * Extract research interests from text content
 * @param {string} text - Text content
 * @returns {string[]} - Array of research interests
 */
const extractResearchInterests = (text) => {
  // Common research interest indicators
  const interestIndicators = [
    'research interests',
    'research focus',
    'areas of interest',
    'research areas',
    'specialization',
    'expertise',
    'research topics',
    'field of study',
    'research field'
  ];
  
  // Common research methodology terms
  const methodologyTerms = [
    'analysis', 'method', 'approach', 'technique', 'model',
    'framework', 'algorithm', 'system', 'design', 'protocol',
    'procedure', 'experiment', 'study', 'investigation', 'assessment',
    'evaluation', 'measurement', 'testing', 'validation', 'verification'
  ];
  
  // Academic and scientific terms
  const academicTerms = [
    'theory', 'concept', 'paradigm', 'principle', 'hypothesis',
    'thesis', 'dissertation', 'research', 'study', 'investigation',
    'experiment', 'analysis', 'evaluation', 'assessment', 'review',
    'survey', 'exploration', 'examination', 'inquiry', 'probe'
  ];
  
  // Normalize text: lowercase and remove extra whitespace
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Extract potential research interest sections
  let interestSection = '';
  for (const indicator of interestIndicators) {
    const index = normalizedText.indexOf(indicator);
    if (index !== -1) {
      // Extract text from the indicator to the next 500 characters or end of text
      const sectionEnd = Math.min(index + 500, normalizedText.length);
      interestSection += normalizedText.substring(index, sectionEnd) + ' ';
    }
  }
  
  // If no specific section found, use the entire text
  if (!interestSection) {
    interestSection = normalizedText;
  }
  
  // Extract keywords (simple approach for prototype)
  const words = interestSection.split(/\s+/);
  const phrases = [];
  
  // Extract noun phrases (simplified approach)
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 3) { // Skip short words
      // Check for two-word phrases
      if (i < words.length - 1 && words[i+1].length > 3) {
        phrases.push(`${words[i]} ${words[i+1]}`);
      }
      
      // Check for three-word phrases
      if (i < words.length - 2 && words[i+1].length > 3 && words[i+2].length > 3) {
        phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
      }
      
      // Add single words that might be important
      if (methodologyTerms.some(term => words[i].includes(term)) || 
          academicTerms.some(term => words[i].includes(term))) {
        phrases.push(words[i]);
      }
    }
  }
  
  // Filter and deduplicate phrases
  const uniquePhrases = [...new Set(phrases)];
  
  // For prototype, limit to top 10 phrases
  return uniquePhrases.slice(0, 10);
};

/**
 * Parse CV file to extract research interests
 * @param {string} filePath - Path to the CV file
 * @returns {Promise<Object>} - Extracted research interests and metadata
 */
const parseCV = async (filePath) => {
  try {
    const fileExt = path.extname(filePath).toLowerCase();
    let text = '';
    
    // Extract text based on file type
    if (fileExt === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (fileExt === '.txt') {
      text = await extractTextFromTXT(filePath);
    } else {
      throw new Error('Unsupported file format. Please upload PDF or TXT files.');
    }
    
    // Extract research interests
    const interests = extractResearchInterests(text);
    
    return {
      success: true,
      interests,
      textLength: text.length,
      filename: path.basename(filePath)
    };
  } catch (error) {
    console.error('Error parsing CV:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  parseCV,
  extractResearchInterests
};
