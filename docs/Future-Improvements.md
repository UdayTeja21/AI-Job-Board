# Future Improvements

While the AI Job Board is currently a robust Minimum Viable Product (MVP), the architectural foundation was explicitly designed to accommodate the following future features.

---

## 📧 1. Email Notifications (Nodemailer)
**Current State**: Boilerplate code exists in `src/utils/emailTemplates.js` and `sendEmail.js`.
**Future State**: Hook into the `updateApplicationStatus` controller. When a recruiter moves a candidate from "Reviewing" to "Interview" on the Kanban board, an automated HTML email is fired to the job seeker via SendGrid or Gmail SMTP, notifying them of their progress.

## 📅 2. Interview Scheduling
**Current State**: Recruiters must contact candidates outside the platform.
**Future State**: Integration with the Google Calendar API or Calendly. When a candidate reaches the "Interview" stage, they receive a generated link to book a time slot directly on the recruiter's calendar.

## 💬 3. In-App Real-time Chat
**Current State**: No direct communication platform between parties.
**Future State**: Implement **Socket.io** on the Node.js backend. When an application is accepted, a WebSocket room is created, allowing the recruiter and candidate to chat in real-time within the dashboard.

## 💳 4. Payment Integration (Stripe)
**Current State**: All job postings are free.
**Future State**: Integrate Stripe Checkout. Restrict recruiters to 1 free job post, after which they must pay a tier fee (e.g., $99/post or a $299/month subscription) to list active jobs.

## ☁️ 5. Cloud Object Storage (AWS S3)
**Current State**: Resumes and logos are saved to the local `/uploads` directory via Multer.
**Future State**: Replace local disk storage with `@aws-sdk/client-s3`. Local storage is volatile on containerized hosts (like Render). Streaming uploads to an S3 bucket ensures files are persisted permanently and served rapidly via CDN.

## 📱 6. React Native Mobile App
**Current State**: The React SPA is highly responsive, but exists only in the browser.
**Future State**: Because the backend is a decoupled REST API, a dedicated React Native application can be built for iOS and Android, consuming the exact same `/api/` endpoints without any backend modifications.

## 🔍 7. Enhanced AI Resume Parsing
**Current State**: AI compares a submitted resume against a job description.
**Future State**: When a Seeker uploads their resume, use Gemini to automatically extract their work experience, education, and skills into structured JSON, auto-filling their user profile so they don't have to type it manually.
