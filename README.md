# Premium AI-Powered Job Board

A production-ready, recruiter-grade AI-powered job board demonstrating modern software engineering practices, exceptional UI/UX, clean architecture, and scalability.

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Axios, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt, Cloudinary
- **DevOps:** GitHub Actions (CI/CD)

## 📦 Monorepo Structure

```
job-board/
├── frontend/           # React + Vite application
├── backend/            # Express.js REST API
├── docs/               # Architecture & API documentation
├── .github/workflows/  # CI/CD pipelines
└── package.json        # Root workspace configuration
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   *Note: Frontend `.env` is optional unless overriding `VITE_API_URL`.*

3. **Run Development Servers:**
   ```bash
   npm run dev
   ```
   This concurrently runs the Vite frontend (usually port 5173) and the Express backend (port 5000).

## 🌟 Features

- **Premium UI/UX:** Built with Tailwind CSS, featuring light/dark mode and modern SaaS aesthetics (glassmorphism, subtle animations).
- **Authentication:** JWT-based secure authentication with Role-Based Access Control (Seeker, Recruiter, Admin).
- **AI Integration Architecture:** Pre-built endpoints and UI integration for AI Resume Matching, AI Job Summaries, and Skill Gap Analysis.
- **Job Search Engine:** Performant job searching with debouncing, filtering, and pagination.
- **Role-specific Dashboards:** Dedicated experiences for job seekers, recruiters, and administrators.

## 🚀 Deployment

This monorepo is configured for standard CI/CD deployment. The included GitHub Actions workflow automatically builds and lints the code.
- **Frontend:** Deploy `frontend/` to Vercel/Netlify.
- **Backend:** Deploy `backend/` to Render/Heroku/AWS.

## 📄 License
MIT License
