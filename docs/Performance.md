# Performance Documentation

Optimizing for performance ensures a snappy user experience and reduces server load. The AI Job Board implements several techniques across the stack to achieve high Lighthouse scores and fast API responses.

---

## ⚡ Frontend Optimization

### 1. Code Splitting & Lazy Loading
The React frontend avoids downloading a massive monolithic JavaScript bundle on the initial paint. Using `React.lazy()` and React Router's dynamic imports, page components (like `SeekerDashboard` or `RecruiterKanban`) are separated into distinct chunks. These chunks are only fetched from the Vercel CDN when the user actually navigates to that route. A `Suspense` boundary displays a skeleton loader during the fetch.

### 2. Reusable Components
Instead of duplicating JSX, the application relies heavily on strict reusable components (`Card`, `Button`, `Input`). This reduces the overall size of the compiled JavaScript and ensures consistent rendering paths.

### 3. Vite Build Optimizations
Vite (built on Rollup) automatically minifies HTML, CSS, and JS. It performs tree-shaking to eliminate dead code (e.g., removing unused Lucide icons from the final bundle).

### 4. Image Optimization
Logos and user avatars are presented in consistent aspect ratios using CSS object-fit to prevent layout shifts (Cumulative Layout Shift - CLS) as images load.

---

## 🚀 Backend & API Optimization

### 1. Database Indexing
MongoDB Atlas is configured with indexes on frequently queried fields. 
- The `email` field on the User collection is indexed for instant login lookups.
- Compound and text indexes exist on the Jobs collection to ensure that keyword filtering and location searches execute in milliseconds rather than scanning the entire collection.

### 2. Payload Reduction (Projections)
Mongoose queries utilize projections to limit the data sent over the wire. For instance, when the frontend requests the current user profile (`/api/auth/profile`), the backend uses `.select('-password')` to ensure the hashed password string is never transmitted or serialized.

### 3. Optimistic UI Updates
In certain areas like the Kanban ATS board, when a recruiter drags a candidate to a new status column, the frontend updates the UI state *immediately* (optimistically) while the Axios `PUT` request fires asynchronously in the background. This makes the application feel instantaneous, regardless of network latency.

### 4. Pagination
To prevent memory exhaustion on both the server and the client, the `GET /api/jobs` endpoint implements pagination. It accepts `pageNumber` and `keyword` queries, returning a limited subset of jobs along with metadata (`page`, `pages`) to render pagination controls on the frontend.
