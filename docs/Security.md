# Security Documentation

Security is a primary concern for the AI Job Board, as it handles sensitive user data (resumes, emails, employment history). The following layers of security have been implemented to protect against common web vulnerabilities.

---

## 🔐 1. Authentication & Session Management

- **JSON Web Tokens (JWT)**: User sessions are managed statelessly using JWTs. Tokens are cryptographically signed using a strong `JWT_SECRET` unknown to the public. If a token is tampered with, the signature verification fails, and the request is rejected (`401 Unauthorized`).
- **Password Hashing**: User passwords are never stored in plaintext. Mongoose uses a `pre('save')` hook to automatically salt and hash passwords using `bcrypt` (10 rounds) before they touch the database.

## 🛡 2. Express Middleware Security

- **Helmet**: The application uses the `helmet` package to automatically set a variety of HTTP headers that defend against common attacks:
  - Disables the `X-Powered-By` header (hiding the Express.js footprint).
  - Sets `X-Content-Type-Options: nosniff`.
  - Sets `X-Frame-Options: SAMEORIGIN` (preventing Clickjacking).
- **CORS (Cross-Origin Resource Sharing)**: The `cors` package is explicitly configured so the API will only accept requests from trusted frontend domains (e.g., the Vercel production URL and `localhost:5173` for development), preventing cross-site request forgery (CSRF) attempts from malicious third-party sites.

## 📝 3. Data Integrity & Input Validation

- **Mongoose Schemas**: MongoDB documents are strictly typed. Attempting to save a string to a Number field, or omitting a `required: true` field, will cause Mongoose to reject the write operation, preventing bad data injection.
- **Express Validator**: Certain routes utilize `express-validator` to sanitize and validate input payloads (e.g., ensuring an email is actually formatted as an email) before the controller logic even executes.
- **NoSQL Injection Prevention**: Mongoose inherently protects against basic NoSQL injection because it sanitizes objects passed into queries, ensuring they match schema definitions.

## 📁 4. Safe File Uploads

- **Multer Configuration**: The `uploadRoutes.js` explicitly checks file mimetypes and extensions. It will reject any file that is not a PDF, DOCX, JPEG, or PNG. This prevents malicious actors from uploading executable scripts (e.g., `.php` or `.sh`) to the server.

## 🤫 5. Environment Variables

- **Separation of Secrets**: All sensitive information (Database URIs, JWT Secrets, Gemini API Keys) is injected via `process.env`. These values are stored in a git-ignored `.env` file locally, and injected securely via the Render dashboard in production, ensuring secrets are never hardcoded into the source code repository.

## 🚦 6. Rate Limiting (Recommended Best Practice)

*(Note: Currently flagged for future implementation)*
To protect against Brute Force attacks on the `/api/auth/login` route and to prevent Denial of Service (DoS) attacks on expensive AI endpoints (`/api/ai/job-summary`), a rate limiter like `express-rate-limit` should be implemented to throttle requests from a single IP address.
