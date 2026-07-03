# Project Overview

## Project Purpose
The AI Job Board is designed to bridge the gap between talented job seekers and leading companies through an intelligent, seamless, and intuitive platform. By integrating artificial intelligence directly into the recruitment pipeline, the platform eliminates the manual overhead of evaluating candidates and writing job descriptions, significantly accelerating the hiring process.

## Business Objective
The primary business objective is to provide a premium, Software-as-a-Service (SaaS) recruitment platform that:
1. **Reduces Time-to-Hire**: By using AI to automatically parse and score candidate resumes against job descriptions.
2. **Improves Candidate Experience**: By providing transparent application tracking and instant feedback on resume match percentages.
3. **Optimizes Recruiter Workflows**: By offering a centralized Kanban-style Applicant Tracking System (ATS) and AI-assisted job description generation.

## Target Users
The platform serves three distinct user roles:

1. **Job Seekers**: 
   - Individuals looking for employment opportunities.
   - They need tools to search for jobs, apply with their resumes, track their application statuses, and gauge their fit for a role via AI feedback.
   
2. **Recruiters / Employers**:
   - HR professionals and hiring managers looking to source top talent.
   - They require an interface to post jobs, manage their company's public branding, review applications, and move candidates through hiring stages.

3. **Administrators**:
   - Platform owners who monitor overall system health.
   - They require oversight of all users, jobs, and companies to ensure platform integrity and compliance.

## Key Features
- **AI-Powered Matching**: Deep integration with Google Gemini to analyze resumes and output structured JSON data containing match percentages and skills gap analysis.
- **Automated Copywriting**: AI generates engaging, conversion-optimized job summaries based on raw requirements.
- **Kanban ATS**: A drag-and-drop board for recruiters to manage candidates across customizable hiring stages.
- **Role-Based Dashboards**: Entirely distinct UI experiences based on whether the logged-in user is a Seeker or Recruiter.
- **Real-Time Job Search**: Advanced filtering, search functionality, and job bookmarking.

## Technology Choices
The MERN stack (MongoDB, Express.js, React, Node.js) was selected for this project due to its ubiquitous nature, massive ecosystem, and the ability to use JavaScript across the entire stack.

- **Frontend**: React (via Vite) was chosen for its blazing fast HMR and optimized production builds. Tailwind CSS ensures rapid, consistent styling without leaving the HTML context.
- **Backend**: Node.js and Express provide a lightweight, non-blocking environment perfectly suited for handling concurrent API requests and file uploads.
- **Database**: MongoDB (NoSQL) offers the flexibility needed for evolving schemas, particularly when storing unstructured AI outputs and complex application lifecycles.
- **AI Integration**: The Google Generative AI SDK (Gemini) was chosen for its superior context windows and fast inference times, making real-time resume analysis feasible.

## High-Level Architecture
The system employs a classic Client-Server architecture:
1. **The Client (Frontend)**: A React SPA hosted on Vercel. It maintains its own routing state (React Router) and global state (Context API) and communicates with the backend exclusively via RESTful JSON APIs using Axios.
2. **The API (Backend)**: An Express server hosted on Render. It handles routing, middleware validation, authentication (JWT), and interacts with external services (Gemini API, File System).
3. **The Data Layer**: A MongoDB Atlas cluster. Data is structured using Mongoose ODM, enforcing strict schemas for Users, Jobs, Applications, and Companies.
