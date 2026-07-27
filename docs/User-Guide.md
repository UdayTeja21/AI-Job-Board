# User Guide

This guide outlines the workflows and capabilities available to the three distinct user roles within the AI Job Board platform.

---

## 👤 1. Guest (Unauthenticated User)

Guests are users who have not logged in. Their access is limited to discovery and platform marketing.

### Capabilities:
- **View Landing Page**: Access the platform's marketing copy, value propositions, and high-level features.
- **Browse Jobs & Companies**: Navigate to the "Find Jobs" or "Companies" pages to view active listings and hiring organizations.
- **Search & Filter**: Search for jobs by keyword or filter by location and job type.
- **View Job Details**: Click on a specific job card to read the full description, requirements, and AI summary.
- **Public Directory**: Access the Blog, Pricing, and About Us pages from the footer.
- **Register / Login**: Create a new account as either a "Seeker" or "Recruiter", or log in to an existing account.

*(Note: If a guest attempts to click "Apply Now" on a job, they are intercepted and redirected to the Login page).*

---

## 💼 2. Job Seeker

A Job Seeker is an authenticated user looking for employment.

### Capabilities:
- **All Guest Features**: Full access to search and discovery.
- **Apply for Jobs**: Access the application modal on any job listing. Seekers can upload a PDF/DOCX resume and write a custom cover letter.
- **Seeker Dashboard**: A personalized command center containing:
  - **Overview**: High-level statistics of their job hunt.
  - **My Applications**: A historical list of all submitted applications and their real-time ATS status (e.g., "Under Review", "Interview").
  - **Real-Time Notifications**: Instant updates via the notification bell when an application advances in the hiring pipeline.
  - **Saved Jobs**: A bookmarking system for jobs the seeker wants to revisit later.
  - **Settings**: Manage personal profile details, skills, and change passwords.

---

## 🏢 3. Recruiter (Employer)

A Recruiter is an authenticated user looking to hire talent.

### Capabilities:
- **Company Profile Management**: Create and edit their organization's public profile, including uploading a company logo, defining the company size, headquarters location, and mission statement.
- **Job Management**: Create, read, update, and delete (CRUD) job postings.
  - **AI Job Summary Generation**: When creating a job, the recruiter can input technical requirements and click a button to have Google Gemini instantly generate an engaging, marketing-focused job summary.
- **Applicant Tracking System (ATS)**:
  - **Kanban Board**: Navigate to the "ATS Board" to view a Trello-style interface. Candidates are represented as draggable cards mapped to specific columns (Applied, Reviewing, Interview, Offered, Hired, Rejected).
  - **Drag and Drop**: Moving a candidate card from "Applied" to "Interview" instantly updates their status in the database (which the Seeker can see on their dashboard).
- **AI Candidate Matching**:
  - Open a specific applicant's card and click "Evaluate with AI". 
  - The system will use Google Gemini to cross-reference the candidate's resume with the job requirements, returning a Match Percentage, a qualitative analysis, and exact lists of matched/missing skills.

---

## 👑 4. Administrator *(Upcoming)*

Admins are internal staff responsible for platform integrity.

### Capabilities:
- **User Management**: Suspend or delete fraudulent accounts.
- **Content Moderation**: Remove inappropriate job postings or company profiles.
- **Platform Analytics**: View system-wide metrics (total applications, active users, API usage).
