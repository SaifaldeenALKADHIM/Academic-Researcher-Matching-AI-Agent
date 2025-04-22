import React, { useState } from 'react';
import { parseCV } from '../services/api';
import { CVParseResult } from '../types';

interface CVUploaderProps {
  onParseSuccess: (result: CVParseResult) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onParseSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'txt') {
      setError('Only PDF and TXT files are supported');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await parseCV(file);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to parse CV');
      }
      
      onParseSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cv-uploader">
      <h2>Upload Your CV or Research Statement</h2>
      <p>Upload your CV or research statement to extract your research interests.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            disabled={loading}
          />
          <p className="file-info">
            {file ? `Selected file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)` : 'No file selected'}
          </p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          disabled={!file || loading}
          className="submit-button"
        >
          {loading ? 'Processing...' : 'Extract Research Interests'}
        </button>
      </form>
    </div>
  );
};

export default CVUploader;
