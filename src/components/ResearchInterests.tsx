import React, { useState } from 'react';

interface ResearchInterestsProps {
  interests: string[];
  onInterestsChange: (interests: string[]) => void;
  editable?: boolean;
}

const ResearchInterests: React.FC<ResearchInterestsProps> = ({ 
  interests, 
  onInterestsChange,
  editable = true 
}) => {
  const [newInterest, setNewInterest] = useState<string>('');

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      onInterestsChange(updatedInterests);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    onInterestsChange(updatedInterests);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="research-interests">
      <h3>Research Interests</h3>
      
      {editable && (
        <div className="add-interest">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a research interest"
          />
          <button 
            onClick={handleAddInterest}
            disabled={!newInterest.trim()}
          >
            Add
          </button>
        </div>
      )}
      
      <div className="interests-list">
        {interests.length > 0 ? (
          <ul>
            {interests.map((interest, index) => (
              <li key={index} className="interest-item">
                <span>{interest}</span>
                {editable && (
                  <button 
                    onClick={() => handleRemoveInterest(index)}
                    className="remove-button"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-interests">No research interests found.</p>
        )}
      </div>
    </div>
  );
};

export default ResearchInterests;
