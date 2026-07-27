# Authentication Documentation

The AI Job Board implements a robust, stateless authentication system using **JSON Web Tokens (JWT)**. This approach ensures scalability, as the backend does not need to store session data in memory or a database.

---

## 🔑 JWT Authentication Flow

1. **Client Submission**: The user enters their email and password on the React frontend.
2. **Server Verification**: The Express backend searches the `User` collection for the email. It uses `bcrypt.compare` to verify the provided password against the hashed password stored in the database.
3. **Token Issuance**: If valid, the backend generates a JWT using `jsonwebtoken`. The payload contains the user's database `ObjectId`. The token is signed using a secret (`JWT_SECRET`) and returned to the client.
4. **Client Storage**: The frontend stores the token in the browser's `localStorage`.
5. **Authenticated Requests**: For any protected route, the frontend `axios` interceptor automatically attaches the token to the `Authorization` header as a `Bearer` token.
6. **Server Validation**: The backend's `protect` middleware intercepts the request, verifies the token's signature, decodes the user ID, and fetches the user object, attaching it to `req.user`.

---

## 🚪 Login Flow

**Frontend `Login.jsx`:**
- Accepts `email` and `password`.
- Calls `login()` from `AuthContext.jsx`.
- If successful, saves token to `localStorage` and redirects to `/dashboard`.
- Conditionally renders a loading state while awaiting the API response.

**Backend `/api/auth/login`:**
- Validates input.
- Finds user by email.
- Verifies password using `user.matchPassword(enteredPassword)`.
- Returns user object (excluding hash) and JWT.

---

## 📝 Registration Flow

**Frontend `Register.jsx`:**
- Accepts `name`, `email`, `password`, and `role` (Seeker/Recruiter).
- Calls `register()` from `AuthContext.jsx`.
- Stores JWT and redirects to dashboard.

**Backend `/api/auth/register`:**
- Checks if user exists via email (returns 400 if true).
- Creates new User document.
- The `User` Mongoose schema utilizes a `pre('save')` hook to automatically salt (10 rounds) and hash the password before inserting the record into MongoDB.
- Returns user object and JWT.

---

## 🛡 Protected Routes & Authorization

### The `protect` Middleware
Used to ensure a user is logged in. 
```javascript
router.route('/profile').get(protect, getUserProfile);
```
If the token is missing, expired, or tampered with, the middleware throws a `401 Not Authorized` error.

### The `authorize` Middleware
Used to enforce Role-Based Access Control (RBAC). It must be placed *after* the `protect` middleware.
```javascript
router.route('/').post(protect, authorize('recruiter'), createJob);
```
If a Seeker attempts to hit this endpoint, the middleware throws a `403 Forbidden` error because their `req.user.role` does not match `'recruiter'`.

---

## 🔐 Security Best Practices Implemented

1. **Password Hashing**: Plaintext passwords are never stored. `bcrypt` provides one-way hashing with built-in salting to defend against rainbow table attacks.
2. **Stateless Sessions**: JWTs are self-contained. The server does not maintain session state, preventing session hijacking via server-side vulnerabilities.
3. **Token Expiration**: JWTs are issued with an expiration time (e.g., `30d`), forcing users to re-authenticate periodically, reducing the window of opportunity if a token is compromised.
4. **No Sensitive Data in Payload**: The JWT payload only contains the non-sensitive `id` field. It does not contain passwords or PII (Personally Identifiable Information).
