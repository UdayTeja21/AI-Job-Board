# Backend Documentation

The backend of the AI Job Board is a RESTful API built on **Node.js** and **Express.js**. It handles data persistence, authentication, and integration with third-party services like Google Gemini AI.

---

## 🏗 Directory Structure

```text
backend/src/
├── config/       # Connection logic (Database)
├── controllers/  # Route handler logic (Business Rules)
├── middleware/   # Express interceptors (Auth, Error Handling)
├── models/       # Mongoose Schemas
├── routes/       # Endpoint definitions mapping to Controllers
└── utils/        # Shared helper functions
```

---

## 🚦 Routing & Controllers

The application groups routes by resource. Express `Router` instances are mounted in `server.js` under the `/api` prefix.

1. **`authController.js`**: Handles user registration, login (password hashing and JWT issuance), and fetching the current authenticated profile.
2. **`jobController.js`**: Handles CRUD operations for Jobs. Uses Mongoose queries to support keyword search and filtering.
3. **`companyController.js`**: Manages the recruiter's company profile.
4. **`applicationController.js`**: Handles job applications. Manages the transition of application status (ATS pipeline).
5. **`aiController.js`**: The most complex controller. Interacts directly with the `@google/generative-ai` SDK. It injects dynamic job descriptions and resume text into structured prompt templates, executing inference on the `gemini-flash-latest` model and parsing the JSON output.

---

## 🛡 Middleware

### 1. Authentication (`protect`)
Located in `authMiddleware.js`. This function extracts the JWT from the `Authorization: Bearer <token>` header, verifies its signature using `process.env.JWT_SECRET`, decodes the payload (which contains the user ID), and fetches the user from the database. It attaches the user object to the `req` object (`req.user = user`) for downstream controllers.

### 2. Authorization (`authorize`)
A factory function in `authMiddleware.js` that takes a role (e.g., `'recruiter'`) and returns a middleware function. It checks if `req.user.role` matches the required role, returning a `403 Forbidden` if the user lacks permissions.

### 3. Error Handling (`errorMiddleware.js`)
All unhandled errors thrown inside controllers are caught and passed to the custom `errorHandler`. This middleware formats Mongoose validation errors, duplicate key errors, and CastErrors into a standardized JSON response:
```json
{
  "message": "User friendly error message",
  "stack": "Error stack trace (hidden in production)"
}
```

---

## 🔒 Security & Validation

- **Helmet**: Secures Express apps by setting various HTTP headers (XSS Protection, Content Security Policy).
- **CORS**: Configured to allow cross-origin requests from the React frontend.
- **Bcrypt**: Used in the `User` model to salt and hash passwords before they are saved to the database.
- **Input Validation**: `express-validator` or Mongoose schema validations are utilized to ensure data integrity before writing to the database.

---

## 📂 File Uploads (Multer)

File handling is managed by `multer` in `uploadRoutes.js`.
- **Resumes (PDF, DOCX)** and **Logos (JPEG, PNG)** are validated by mimetype and extension.
- Files are saved to the local `/uploads` directory using a custom filename format: `fieldname-timestamp.ext`.
- Express serves this directory statically via `express.static(path.join(__dirname, '/uploads'))`.

*(Note: In a highly scalable production environment, this local storage approach would be replaced by an AWS S3 or Cloudinary integration to avoid stateful container issues).*
