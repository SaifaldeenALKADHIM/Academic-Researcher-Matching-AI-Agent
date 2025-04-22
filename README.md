# Academic Researcher Matching AI Agent

A prototype web application to match researchers with professors based on research interests.

## Demonstration Guide

This document provides instructions on how to run and test the Academic Researcher Matching prototype.

### Prerequisites

- Node.js (v14+)
- npm or yarn
- A PDF or TXT file containing research interests (for testing)

### Running the Application

#### Step 1: Start the Backend Server

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```

The backend server will start on port 5000. You should see a message: "Server running on port 5000"

#### Step 2: Start the Frontend Application

```bash
# Open a new terminal window
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on port 3000 and should automatically open in your browser. If it doesn't, you can access it at http://localhost:3000

### Testing the Application

#### Step 1: Upload a CV or Research Statement

1. On the home page, click the "Choose File" button
2. Select a PDF or TXT file containing research interests
3. Click "Extract Research Interests"
4. The system will parse the file and extract research interests

#### Step 2: Review and Edit Research Interests

1. Review the extracted research interests
2. Add or remove interests as needed
3. Click "Find Matching Professors"

#### Step 3: View Matching Professors

1. The system will display professors whose research interests match yours
2. Each professor card shows:
   - Name, university, and department
   - Match score
   - Top research interests
3. You can filter professors by university using the dropdown

#### Step 4: Generate Email Template

1. Click "Generate Email" on any professor card
2. Review the personalized email template
3. Click "Copy to Clipboard" to copy the email
4. Use the template to reach out to the professor

### Sample Test Data

For testing purposes, the system includes sample professor data from Xi'an Jiaotong University with research interests in neuroscience and neuropathic pain.

If you don't have a CV to test with, you can create a simple text file with the following content:

```
Research Interests:
- Neuropathic pain
- Neural circuits
- Pain management
- Neuropharmacology
```

### Troubleshooting

- If the backend server fails to start, check if port 5000 is already in use
- If the frontend fails to connect to the backend, verify the API_URL in src/services/api.ts
- For file upload issues, ensure your file is in PDF or TXT format and under 5MB

## Repository Structure

- `/frontend`: React.js web application
- `/backend`: Node.js/Express API server
- `/data`: Sample data and database schemas

## Development Status

This is a prototype application demonstrating core functionality. See limitations and future enhancements in the documentation.
