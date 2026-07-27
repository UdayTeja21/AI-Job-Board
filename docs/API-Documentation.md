# AI Job Board API Documentation

Base URL: `/api`

## Authentication

All protected routes require a Bearer token in the `Authorization` header.
Format: `Authorization: Bearer <token>`

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "seeker" // or "recruiter"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "_id": "60d5ecb543...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seeker",
    "token": "eyJhb..."
  }
  ```

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK): Returns user object and token.

### 3. Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Access**: Private (Any logged-in user)
- **Response** (200 OK): Returns current user object.

### 4. Google OAuth Login
- **URL**: `/api/auth/google`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "credential": "google_jwt_token_here",
    "role": "seeker" // Only required during initial registration
  }
  ```

---

## Jobs

### 1. Get All Jobs
- **URL**: `/api/jobs`
- **Method**: `GET`
- **Access**: Public
- **Query Parameters**: `keyword`, `location`, `pageNumber`, `jobType`, `workMode`
- **Response** (200 OK):
  ```json
  {
    "jobs": [...],
    "page": 1,
    "pages": 5
  }
  ```

### 2. Get Job by ID
- **URL**: `/api/jobs/:id`
- **Method**: `GET`
- **Access**: Public

### 3. Create Job
- **URL**: `/api/jobs`
- **Method**: `POST`
- **Access**: Private (Recruiter only)
- **Body**:
  ```json
  {
    "title": "Software Engineer",
    "description": "Job details here...",
    "requirements": ["React", "Node.js"],
    "category": "Software Development",
    "jobType": "Full-time",
    "workMode": "Remote",
    "location": "San Francisco, CA",
    "salaryRange": { "min": 100000, "max": 150000 }
  }
  ```

### 4. Update Job
- **URL**: `/api/jobs/:id`
- **Method**: `PUT`
- **Access**: Private (Recruiter only - Owner of job)

### 5. Get Recruiter's Jobs
- **URL**: `/api/jobs/recruiter/my-jobs`
- **Method**: `GET`
- **Access**: Private (Recruiter only)

---

## Companies

### 1. Get All Companies (With Active Jobs)
- **URL**: `/api/companies`
- **Method**: `GET`
- **Access**: Public
- **Response** (200 OK): Array of companies.

### 2. Get/Update Recruiter's Company Profile
- **URL**: `/api/companies/my`
- **Method**: `GET` / `POST`
- **Access**: Private (Recruiter only)
- **Body** (For POST):
  ```json
  {
    "name": "Tech Corp",
    "description": "A great place to work",
    "website": "https://techcorp.com",
    "location": "New York, NY",
    "companySize": "50-200 employees"
  }
  ```

---

## Applications

### 1. Apply for Job
- **URL**: `/api/applications`
- **Method**: `POST`
- **Access**: Private (Seeker only)
- **Body**:
  ```json
  {
    "jobId": "60d5ec...",
    "resume": "https://url-to-resume.pdf",
    "coverLetter": "Hello..."
  }
  ```

### 2. Get My Applications
- **URL**: `/api/applications/my-applications`
- **Method**: `GET`
- **Access**: Private (Seeker only)

### 3. Get Applications for a Job
- **URL**: `/api/applications/job/:jobId`
- **Method**: `GET`
- **Access**: Private (Recruiter only - Owner of job)

### 4. Update Application Status (ATS)
- **URL**: `/api/applications/:id/status`
- **Method**: `PUT`
- **Access**: Private (Recruiter only)
- **Body**:
  ```json
  {
    "status": "Screening" // e.g. Pending, Screening, Interview, Offered, Rejected
  }
  ```

---

## Notifications

### 1. Get My Notifications
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Access**: Private (Any logged-in user)

### 2. Mark Notification as Read
- **URL**: `/api/notifications/:id/read`
- **Method**: `PUT`
- **Access**: Private

### 3. Mark All Notifications as Read
- **URL**: `/api/notifications/read-all`
- **Method**: `PUT`
- **Access**: Private

---

## AI Services

### 1. Generate Job Summary
- **URL**: `/api/ai/job-summary`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "jobId": "60d5ec..."
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "summary": "This is a brief AI-generated summary..."
  }
  ```

## Uploads API (`/api/upload`)

### 1. Upload Resume
- **Method**: `POST`
- **Endpoint**: `/api/upload`
- **Purpose**: Upload a PDF/DOCX file.
- **Auth Required**: Yes
- **Request Body**: FormData containing `resume` file.
- **Response** (200 OK): Returns `{ resumeUrl: "/uploads/filename.pdf" }`.

### 2. Upload Logo
- **Method**: `POST`
- **Endpoint**: `/api/upload/image`
- **Purpose**: Upload a PNG/JPEG file.
- **Auth Required**: Yes
- **Request Body**: FormData containing `image` file.
- **Response** (200 OK): Returns `{ imageUrl: "/uploads/filename.png" }`.
