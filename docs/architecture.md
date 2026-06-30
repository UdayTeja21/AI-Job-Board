# Architecture & API Documentation

## System Architecture

The AI-Job Board is built as a scalable Monorepo.

### 1. Frontend Architecture
- **Framework:** React + Vite
- **State Management:** React Context API (AuthContext, ThemeContext)
- **Styling:** Tailwind CSS with a custom design system token file (`tailwind.config.js` and `index.css`).
- **Routing:** React Router v6.
- **Component Pattern:** Atomic design for UI components (`Button`, `Input`, `Card`, `Badge`) used to construct complex layout sections and pages.

### 2. Backend Architecture
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB Atlas via Mongoose ORM.
- **Pattern:** MVC (Models, Views/Routes, Controllers).
- **Security:** Helmet, CORS, standard JWT authentication, Bcrypt password hashing.

### 3. Database Schema Overview
- **User:** Manages authentication and basic profile info (Role: seeker, recruiter, admin).
- **Company:** Recruiter-managed company profiles with logos hosted on Cloudinary.
- **Job:** Job postings linked to a Company and a Recruiter.
- **Application:** Links a User to a Job, tracks status, and stores AI Match Scores.

## RESTful API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate and receive JWT.
- `GET /profile`: Get the logged-in user's profile (Protected).
- `PUT /profile`: Update user profile (Protected).

### Jobs (`/api/jobs`)
- `GET /`: Retrieve jobs with pagination, filtering, and search.
- `GET /:id`: Get single job details.
- `POST /`: Create a new job (Recruiter/Admin only).

### Applications (`/api/applications`)
- `POST /`: Apply for a job (Seeker only).
- `GET /my-applications`: Get logged-in seeker's applications.
- `GET /job/:jobId`: Get all applications for a specific job (Recruiter only).

### AI Services (`/api/ai`)
- `POST /job-summary`: Generate AI summary of a job description.
- `POST /match-score`: Evaluate resume against a job description.
