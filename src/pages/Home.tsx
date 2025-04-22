import React, { useState, useEffect } from 'react';
import CVUploader from '../components/CVUploader';
import ResearchInterests from '../components/ResearchInterests';
import ProfessorList from '../components/ProfessorList';
import EmailTemplate from '../components/EmailTemplate';
import { matchProfessors, generateEmailTemplate } from '../services/api';
import { CVParseResult, Professor } from '../types';

const Home: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'match' | 'email'>('upload');
  const [cvResult, setCvResult] = useState<CVParseResult | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [matchResults, setMatchResults] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle successful CV parsing
  const handleParseSuccess = (result: CVParseResult) => {
    setCvResult(result);
    setInterests(result.interests);
    setStep('match');
  };

  // Handle changes to research interests
  const handleInterestsChange = (newInterests: string[]) => {
    setInterests(newInterests);
  };

  // Find matching professors
  const handleFindMatches = async () => {
    if (interests.length === 0) {
      setError('Please add at least one research interest');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await matchProfessors(interests);
      
      if (!result.success) {
        throw new Error('Failed to find matching professors');
      }
      
      setMatchResults(result.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle professor selection for email template
  const handleSelectProfessor = async (professor: Professor) => {
    setSelectedProfessor(professor);
    setLoading(true);
    setError(null);

    try {
      const result = await generateEmailTemplate(interests, professor.id);
      
      if (!result.success) {
        throw new Error('Failed to generate email template');
      }
      
      setEmailTemplate(result.emailTemplate);
      setStep('email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Go back to match results
  const handleBackToResults = () => {
    setStep('match');
    setSelectedProfessor(null);
    setEmailTemplate('');
  };

  // Reset to start
  const handleReset = () => {
    setStep('upload');
    setCvResult(null);
    setInterests([]);
    setMatchResults([]);
    setSelectedProfessor(null);
    setEmailTemplate('');
    setError(null);
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Academic Researcher Matching</h1>
        <p>Find professors whose research interests align with yours</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="step-indicator">
        <div className={`step ${step === 'upload' ? 'active' : ''}`}>
          1. Upload CV
        </div>
        <div className={`step ${step === 'match' ? 'active' : ''}`}>
          2. Match Professors
        </div>
        <div className={`step ${step === 'email' ? 'active' : ''}`}>
          3. Generate Email
        </div>
      </div>

      <main className="main-content">
        {step === 'upload' && (
          <CVUploader onParseSuccess={handleParseSuccess} />
        )}

        {step === 'match' && (
          <div className="match-step">
            <div className="interests-section">
              <ResearchInterests 
                interests={interests} 
                onInterestsChange={handleInterestsChange} 
              />
              
              <button 
                onClick={handleFindMatches}
                disabled={interests.length === 0 || loading}
                className="find-matches-button"
              >
                {loading ? 'Finding Matches...' : 'Find Matching Professors'}
              </button>
              
              <button 
                onClick={handleReset}
                className="reset-button"
              >
                Start Over
              </button>
            </div>
            
            {matchResults.length > 0 && (
              <div className="results-section">
                <ProfessorList 
                  professors={matchResults} 
                  onSelectProfessor={handleSelectProfessor} 
                />
              </div>
            )}
          </div>
        )}

        {step === 'email' && selectedProfessor && (
          <EmailTemplate 
            professor={selectedProfessor}
            emailTemplate={emailTemplate}
            onBack={handleBackToResults}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Academic Researcher Matching - Prototype Version</p>
      </footer>
    </div>
  );
};

export default Home;
