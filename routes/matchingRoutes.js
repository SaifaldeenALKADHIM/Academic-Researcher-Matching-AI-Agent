const express = require('express');
const router = express.Router();
const { findMatchingProfessors, generateEmailTemplate } = require('../controllers/matchingAlgorithm');
const { getAllProfessors } = require('../models/Professor');

// Match professors based on researcher interests
router.post('/', (req, res) => {
  try {
    const { interests, universityFilter, minScore, maxResults } = req.body;
    
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Research interests are required and must be an array' 
      });
    }
    
    const professors = getAllProfessors();
    const options = {
      minScore: minScore || 0.1,
      maxResults: maxResults || 10,
      universityFilter: universityFilter || null
    };
    
    const matches = findMatchingProfessors(interests, professors, options);
    
    return res.json({
      success: true,
      matches,
      totalMatches: matches.length,
      query: {
        interests,
        universityFilter: options.universityFilter,
        minScore: options.minScore,
        maxResults: options.maxResults
      }
    });
  } catch (error) {
    console.error('Error in matching route:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while matching professors' 
    });
  }
});

// Generate email template for a specific professor
router.post('/email-template', (req, res) => {
  try {
    const { researcher, professorId } = req.body;
    
    if (!researcher || !researcher.interests || !professorId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Researcher interests and professor ID are required' 
      });
    }
    
    const professors = getAllProfessors();
    const professor = professors.find(p => p.id === parseInt(professorId));
    
    if (!professor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Professor not found' 
      });
    }
    
    const emailTemplate = generateEmailTemplate(researcher, professor);
    
    return res.json({
      success: true,
      emailTemplate,
      professor
    });
  } catch (error) {
    console.error('Error generating email template:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while generating email template' 
    });
  }
});

module.exports = router;
