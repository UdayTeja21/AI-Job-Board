# API Documentation

The AI Job Board utilizes a RESTful API built with Express.js. All endpoints are prefixed with `/api`.

---

## 🔐 Auth API (`/api/auth`)

### 1. Register a User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Purpose**: Create a new Job Seeker or Recruiter account.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "seeker" // or "recruiter"
  }
  ```
- **Response** (201 Created): Returns user object and JWT token.

### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Purpose**: Authenticate user and issue JWT.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response** (200 OK): Returns user object and JWT token.

### 3. Get Current Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/profile`
- **Purpose**: Fetch the logged-in user's profile data.
- **Auth Required**: Yes (Bearer Token)
- **Response** (200 OK): Returns user object without password hash.

---

## 💼 Jobs API (`/api/jobs`)

### 1. Get All Jobs
- **Method**: `GET`
- **Endpoint**: `/api/jobs`
- **Purpose**: Fetch paginated job listings with optional filters.
- **Auth Required**: No
- **Query Params**: `keyword`, `location`, `jobType`, `pageNumber`
- **Response** (200 OK): Returns array of jobs, page info, and total pages.

### 2. Get Single Job
- **Method**: `GET`
- **Endpoint**: `/api/jobs/:id`
- **Purpose**: Fetch details of a specific job by ID.
- **Auth Required**: No
- **Response** (200 OK): Returns job object with populated company details.

### 3. Create Job
- **Method**: `POST`
- **Endpoint**: `/api/jobs`
- **Purpose**: Post a new job listing.
- **Auth Required**: Yes (Role: `recruiter`)
- **Request Body**: `title`, `description`, `company`, `location`, `salary`, `jobType`, `requirements`
- **Response** (201 Created): Returns the created job.

---

## 🏢 Company API (`/api/companies`)

### 1. Get My Company
- **Method**: `GET`
- **Endpoint**: `/api/companies/my`
- **Purpose**: Fetch the authenticated recruiter's company profile.
- **Auth Required**: Yes (Role: `recruiter`)
- **Response** (200 OK): Returns company object. Returns 404 if not found.

### 2. Update/Create My Company
- **Method**: `POST`
- **Endpoint**: `/api/companies/my`
- **Purpose**: Create or update the recruiter's company profile.
- **Auth Required**: Yes (Role: `recruiter`)
- **Request Body**: `name`, `description`, `website`, `location`, `companySize`, `logo`
- **Response** (200 OK / 201 Created): Returns the updated/created company.

---

## 📝 Application API (`/api/applications`)

### 1. Apply for Job
- **Method**: `POST`
- **Endpoint**: `/api/applications`
- **Purpose**: Submit an application as a seeker.
- **Auth Required**: Yes (Role: `seeker`)
- **Request Body**: `jobId`, `resume` (URL), `coverLetter`
- **Response** (201 Created): Returns the application document.

### 2. Get Seeker Applications
- **Method**: `GET`
- **Endpoint**: `/api/applications/my-applications`
- **Purpose**: Fetch all applications submitted by the logged-in seeker.
- **Auth Required**: Yes (Role: `seeker`)
- **Response** (200 OK): Returns array of populated applications.

### 3. Update Application Status (ATS)
- **Method**: `PUT`
- **Endpoint**: `/api/applications/:id/status`
- **Purpose**: Move a candidate through the Kanban ATS pipeline.
- **Auth Required**: Yes (Role: `recruiter`)
- **Request Body**: `status` (e.g., "Interview", "Hired")
- **Response** (200 OK): Returns updated application.

---

## 🤖 AI API (`/api/ai`)

### 1. Generate Job Summary
- **Method**: `POST`
- **Endpoint**: `/api/ai/job-summary`
- **Purpose**: Generate a marketing hook for a job description using Gemini.
- **Auth Required**: Yes (Role: `recruiter`)
- **Request Body**: `title`, `description`, `requirements`
- **Response** (200 OK): Returns `{ summary: "AI generated text..." }`.

### 2. Match Candidate Resume
- **Method**: `POST`
- **Endpoint**: `/api/ai/match-resume`
- **Purpose**: Score a candidate's resume against a job description.
- **Auth Required**: Yes (Role: `recruiter`)
- **Request Body**: `applicationId`, `jobId`
- **Response** (200 OK): Returns JSON with `matchScore`, `analysis`, `matchedSkills`, and `missingSkills`.

---

## 📁 Uploads API (`/api/upload`)

### 1. Upload Resume
- **Method**: `POST`
- **Endpoint**: `/api/upload`
- **Purpose**: Upload a PDF/DOCX file.
- **Auth Required**: Yes (Handled by Multer)
- **Request Body**: FormData containing `resume` file.
- **Response** (200 OK): Returns `{ resumeUrl: "/uploads/filename.pdf" }`.

### 2. Upload Logo
- **Method**: `POST`
- **Endpoint**: `/api/upload/image`
- **Purpose**: Upload a PNG/JPEG file.
- **Auth Required**: Yes
- **Request Body**: FormData containing `image` file.
- **Response** (200 OK): Returns `{ imageUrl: "/uploads/filename.png" }`.
