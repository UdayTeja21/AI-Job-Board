# Features Documentation

The AI Job Board provides a robust feature set tailored for job seekers, recruiters, and administrators. Below is a detailed breakdown of the functionality available across the platform.

---

## 🔐 Authentication & Security

### User Registration
Users can create accounts by selecting a role (Seeker or Recruiter). The registration flow includes strict input validation, requiring valid email formats and minimum password lengths.

### Login & JWT Authentication
Upon successful login, the backend issues a JSON Web Token (JWT) signed with a secret key. This token is stored securely in `localStorage` on the client-side and attached as a `Bearer` token to the `Authorization` header of all subsequent Axios requests.

### Role-Based Access Control (RBAC)
The frontend utilizes a `DashboardLayout` component that conditionally renders navigation items and routes based on the authenticated user's role (`seeker`, `recruiter`, or `admin`). The backend enforces this via an `authorize` middleware that checks `req.user.role`.

---

## 🎨 User Interface (UI)

### Dark Mode
The platform supports a comprehensive Dark Mode, leveraging Tailwind CSS's `dark:` modifier class. Colors are defined via CSS variables in `index.css` to ensure smooth transitions between light and dark themes.

### Responsive UI
Built with a "mobile-first" methodology, the UI adapts flawlessly to all screen sizes. The dashboard sidebar collapses into a hamburger menu on smaller devices, and grid layouts dynamically shift from multiple columns to a single column.

---

## 🔍 Discovery & Search

### Job Search & Filters
A highly optimized search interface allows users to find jobs by keywords, location, and job type (Full-time, Part-time, Contract, Remote). Results are updated dynamically.

### Bookmarks (Saved Jobs)
Job Seekers can "bookmark" jobs to review or apply to later. Bookmarked jobs are stored in the user's database document and viewable via the "Saved Jobs" dashboard tab.

---

## 📊 Dashboards

### Job Seeker Dashboard
A centralized hub for applicants. Seekers can:
- View all their active applications.
- Track application status (e.g., "Under Review", "Interview").
- View bookmarked jobs.
- Update their profile settings.

### Recruiter Dashboard
A comprehensive management interface. Recruiters can:
- Post, edit, and delete job listings.
- Manage their public Company Profile (including logo uploads).
- View all applications submitted to their job postings.

### Admin Dashboard *(Upcoming)*
An administrative view to monitor platform metrics, manage users, and moderate job postings to ensure platform integrity.

---

## 💼 Core Workflows

### Job Applications
Seekers can apply to jobs by submitting a resume (PDF/Doc) and a cover letter. The file is handled by Multer on the backend and stored locally. A reference to the file is saved in the `Application` MongoDB document.

### Kanban ATS (Applicant Tracking System)
Recruiters have access to an `ats-board` view, a drag-and-drop Kanban board representing the hiring pipeline:
1. **Applied**: Initial submission.
2. **Reviewing**: Recruiter is assessing the candidate.
3. **Interview**: Candidate advanced to interview stage.
4. **Offered**: Offer extended.
5. **Hired/Rejected**: Final disposition.

Status changes on the frontend trigger real-time updates to the backend database.

---

## 🤖 AI Features (Powered by Google Gemini)

The defining characteristic of this platform is its deep AI integration.

### AI Job Summaries
When a recruiter is creating a job posting, they can input raw requirements and click "Generate AI Summary". The backend sends a highly-engineered prompt to the `gemini-flash-latest` model to generate a compelling, 2-3 sentence marketing hook to attract top talent.

### Candidate Match Scoring
When a recruiter reviews an application, they can trigger an AI evaluation. The backend extracts the candidate's resume data and compares it against the job description using Gemini. The AI returns a strictly formatted JSON object containing:
- **Match Score**: A percentage (0-100) indicating fitness.
- **Analysis**: A qualitative paragraph explaining the score.
- **Matched Skills**: Bullet points of overlapping skills.
- **Missing Skills**: Bullet points of desired skills the candidate lacks.

---

## 🔔 Notifications *(Future Scope)*
A robust notification system (schema already exists) designed to alert users when their application status changes or when new jobs matching their profile are posted.
