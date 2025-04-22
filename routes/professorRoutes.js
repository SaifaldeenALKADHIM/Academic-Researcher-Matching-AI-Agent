const express = require('express');
const router = express.Router();
const { getAllProfessors, getProfessorById, searchProfessors } = require('../models/Professor');

// Get all professors
router.get('/', (req, res) => {
  const professors = getAllProfessors();
  res.json(professors);
});

// Get professor by ID
router.get('/:id', (req, res) => {
  const professor = getProfessorById(req.params.id);
  if (!professor) {
    return res.status(404).json({ success: false, error: 'Professor not found' });
  }
  res.json(professor);
});

// Search professors by keywords
router.post('/search', (req, res) => {
  const { keywords } = req.body;
  const professors = searchProfessors(keywords);
  res.json(professors);
});

module.exports = router;
