# AI Job Board

A premium, AI-powered platform connecting top talent with world-class companies. This platform revolutionizes the recruitment process by leveraging cutting-edge Artificial Intelligence (Google Gemini) to analyze resumes, score candidates, and generate automated, engaging job summaries. 

Built as a scalable, full-stack application, it features comprehensive dashboards for both Job Seekers and Recruiters, real-time application tracking, and an intuitive Kanban-style ATS (Applicant Tracking System).

---

## 📸 Screenshots
*(Add screenshots here)*
- **Landing Page**: `![Landing Page](./docs/assets/landing.png)`
- **Seeker Dashboard**: `![Seeker Dashboard](./docs/assets/seeker-dashboard.png)`
- **Recruiter ATS Board**: `![Recruiter ATS](./docs/assets/recruiter-ats.png)`
- **AI Resume Matcher**: `![AI Matcher](./docs/assets/ai-matcher.png)`

## 🚀 Live Demo
- **Frontend**: [https://ai-job-board-frontend.vercel.app](https://ai-job-board-frontend.vercel.app) *(Replace with actual URL)*
- **Backend**: [https://ai-job-board-backend.onrender.com](https://ai-job-board-backend.onrender.com) *(Replace with actual URL)*

## 🔗 GitHub Repository
[https://github.com/UdayTeja21/AI-Job-Board](https://github.com/UdayTeja21/AI-Job-Board)

---

## ✨ Features

### For Job Seekers
- **Smart Job Search**: Filter by location, job type, and keywords.
- **AI Resume Analysis**: Get instant AI feedback on how well your resume matches a job description.
- **Application Tracking**: Monitor the status of your applications in real-time.
- **Job Bookmarks**: Save jobs to review later.

### For Recruiters
- **AI Job Summaries**: Automatically generate engaging job summaries based on requirements.
- **Kanban ATS Board**: Drag-and-drop interface to move candidates through the hiring pipeline (Applied → Reviewing → Interview → Offered → Hired).
- **Candidate Match Scoring**: AI analyzes applicant resumes against job descriptions and provides a match percentage and skills gap analysis.
- **Company Profiles**: Manage public-facing company branding and logos.

### System-Wide
- **Role-Based Access Control (RBAC)**: Secure authentication and authorization for Seekers, Recruiters, and Admins.
- **Responsive UI**: Built with Tailwind CSS and Framer Motion for a fluid, mobile-first experience.
- **Dark Mode**: Native support for system-preference dark mode.

---

## 🛠 Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS v4** (Styling)
- **Framer Motion** (Animations)
- **React Router v7** (Navigation)
- **Axios** (API Client)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Authentication)
- **Google Generative AI SDK** (Gemini AI Integration)
- **Multer** (File Uploads)

---

## 🏗 Architecture Overview
The application follows a standard **MERN MVC** (Model-View-Controller) architecture. The frontend is a Single Page Application (SPA) that communicates with the backend via a RESTful API. The backend handles business logic, AI interactions, and database operations.

For a detailed breakdown, see [Architecture Documentation](./docs/Architecture.md).

---

## 📁 Folder Structure
```text
AI-Job-Board/
├── backend/
│   ├── src/
│   │   ├── config/       # DB & AI configurations
│   │   ├── controllers/  # API logic
│   │   ├── middleware/   # Auth & Error handling
│   │   ├── models/       # Mongoose schemas
│   │   └── routes/       # Express routes
│   └── uploads/          # Local file storage (resumes/logos)
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements
│   │   ├── context/      # Global state (Auth)
│   │   ├── pages/        # Route views
│   │   └── services/     # API integration
│   └── index.html
└── docs/                 # Detailed Engineering Documentation
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/UdayTeja21/AI-Job-Board.git
cd AI-Job-Board
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
GEMINI_API_KEY=your_gemini_api_key
```
Create a `.env` file in the `frontend/` directory (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

- **Frontend**: Designed to be deployed on Vercel. 
- **Backend**: Designed to be deployed on Render.

For a full deployment guide, see [Deployment Documentation](./docs/Deployment.md).

---

## 🔄 GitHub Actions CI/CD
This project utilizes GitHub Actions for Continuous Integration. Every push to the `dev` or `master` branch triggers a workflow that lints the codebase, builds the frontend, and prepares the backend for deployment.

See [GitHub Actions Documentation](./docs/GitHub-Actions.md) for pipeline details.

---

## 📖 Detailed Documentation (Wiki)
This repository includes a comprehensive set of engineering documentation for onboarding and architectural review:

1. [Project Overview](./docs/Project-Overview.md)
2. [Features](./docs/Features.md)
3. [Architecture](./docs/Architecture.md)
4. [API Documentation](./docs/API-Documentation.md)
5. [Database Design](./docs/Database.md)
6. [Authentication](./docs/Authentication.md)
7. [Frontend Architecture](./docs/Frontend.md)
8. [Backend Architecture](./docs/Backend.md)
9. [Deployment Guide](./docs/Deployment.md)
10. [GitHub Actions CI/CD](./docs/GitHub-Actions.md)
11. [AI Development Process](./docs/AI-Development-Documentation.md)
12. [User Guide](./docs/User-Guide.md)
13. [Future Improvements](./docs/Future-Improvements.md)
14. [Security Overview](./docs/Security.md)
15. [Performance Optimization](./docs/Performance.md)
16. [Accessibility](./docs/Accessibility.md)
17. [Folder Structure](./docs/Folder-Structure.md)
18. [Engineering Review](./docs/Engineering-Review.md)

---

## 🔮 Future Enhancements
- Full Email Notifications via Nodemailer
- Automated Interview Scheduling
- Integrated Chat System between Recruiters and Candidates
- Mobile Native Application (React Native)

---

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgements
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- [Lucide Icons](https://lucide.dev/)
