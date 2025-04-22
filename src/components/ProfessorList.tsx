import React, { useState } from 'react';
import { Professor } from '../types';

interface ProfessorListProps {
  professors: Professor[];
  onSelectProfessor: (professor: Professor) => void;
}

const ProfessorList: React.FC<ProfessorListProps> = ({ professors, onSelectProfessor }) => {
  const [universityFilter, setUniversityFilter] = useState<string>('');
  
  // Get unique universities for filter dropdown
  const universities = [...new Set(professors.map(prof => prof.university))];
  
  // Apply university filter
  const filteredProfessors = universityFilter 
    ? professors.filter(prof => prof.university === universityFilter)
    : professors;

  return (
    <div className="professor-list">
      <h3>Matching Professors</h3>
      
      <div className="filter-controls">
        <label htmlFor="university-filter">Filter by University:</label>
        <select 
          id="university-filter"
          value={universityFilter}
          onChange={(e) => setUniversityFilter(e.target.value)}
        >
          <option value="">All Universities</option>
          {universities.map((university, index) => (
            <option key={index} value={university}>{university}</option>
          ))}
        </select>
      </div>
      
      {filteredProfessors.length > 0 ? (
        <div className="professors-grid">
          {filteredProfessors.map(professor => (
            <div key={professor.id} className="professor-card">
              <h4>{professor.name}</h4>
              <p className="university">{professor.university}</p>
              <p className="department">{professor.department}</p>
              
              {professor.matchScore !== undefined && (
                <div className="match-score">
                  <span className="score-label">Match Score:</span>
                  <span className="score-value">{(professor.matchScore * 100).toFixed(0)}%</span>
                </div>
              )}
              
              <div className="interests">
                <h5>Research Interests:</h5>
                <ul>
                  {professor.researchInterests.slice(0, 3).map((interest, index) => (
                    <li key={index}>{interest}</li>
                  ))}
                  {professor.researchInterests.length > 3 && (
                    <li>+{professor.researchInterests.length - 3} more</li>
                  )}
                </ul>
              </div>
              
              <button 
                onClick={() => onSelectProfessor(professor)}
                className="select-button"
              >
                Generate Email
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-professors">No matching professors found.</p>
      )}
    </div>
  );
};

export default ProfessorList;
