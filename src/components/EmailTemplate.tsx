import React, { useState } from 'react';
import { Professor } from '../types';

interface EmailTemplateProps {
  professor: Professor;
  emailTemplate: string;
  onBack: () => void;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ professor, emailTemplate, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="email-template">
      <h3>Email Template for {professor.name}</h3>
      
      <div className="professor-info">
        <p><strong>University:</strong> {professor.university}</p>
        <p><strong>Department:</strong> {professor.department}</p>
        <p><strong>Email:</strong> {professor.email}</p>
      </div>
      
      <div className="template-container">
        <pre className="email-content">{emailTemplate}</pre>
      </div>
      
      <div className="template-actions">
        <button 
          onClick={handleCopyToClipboard}
          className="copy-button"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        
        <button 
          onClick={onBack}
          className="back-button"
        >
          Back to Results
        </button>
      </div>
      
      <div className="template-instructions">
        <h4>How to use this template:</h4>
        <ol>
          <li>Copy the email template to your clipboard</li>
          <li>Open your email client and create a new message</li>
          <li>Paste the template into your email</li>
          <li>Replace [Your Name], [Your Institution], etc. with your information</li>
          <li>Review and personalize the email before sending</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTemplate;
