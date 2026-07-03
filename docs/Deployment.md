# Deployment Documentation

The AI Job Board is engineered for modern cloud infrastructure, separating the frontend and backend deployments to leverage platforms optimized for static assets and Node.js environments respectively.

---

## 1. Frontend Deployment (Vercel)

The React SPA is deployed on **Vercel**, which acts as a global CDN, providing near-instant load times for static assets.

### Configuration
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `frontend`

### Environment Variables
In the Vercel dashboard, the following environment variables must be configured:
- `VITE_API_URL`: The production URL of the Render backend (e.g., `https://my-backend.onrender.com/api`).
  - *Note: The application includes a safeguard in `api.js` that automatically appends `/api` if omitted.*

### Deployment Flow
1. Code is pushed to the `master` or `dev` branch on GitHub.
2. Vercel automatically detects the push, clones the repository, navigates to the `frontend` root, and runs `npm run build`.
3. The resulting `dist/` folder is distributed across Vercel's Edge Network.

---

## 2. Backend Deployment (Render)

The Node.js Express server is deployed on **Render** as a "Web Service", which provides a persistent runtime environment for API execution.

### Configuration
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start` (executes `node server.js`)
- **Root Directory**: `backend`

*Note: Since the backend does not require a compile step (like React), a dummy `"build": "echo 'No build step required'"` script exists in `backend/package.json` to satisfy Render's default build expectations.*

### Environment Variables
In the Render dashboard, the following variables must be configured to match production services:
- `PORT`: (Render sets this automatically, but usually `10000`)
- `NODE_ENV`: `production`
- `MONGO_URI`: The connection string to the production MongoDB Atlas cluster.
- `JWT_SECRET`: A secure, cryptographically random string.
- `JWT_EXPIRE`: Token lifespan (e.g., `30d`).
- `GEMINI_API_KEY`: Production API key for Google Gemini.

---

## 3. Database Deployment (MongoDB Atlas)

The database is hosted on **MongoDB Atlas**, providing a fully managed cloud NoSQL database.

### Configuration
- **Network Access**: IP Access Lists must be configured to allow incoming connections from Render's IP addresses (or configured to allow `0.0.0.0/0` if relying entirely on credential security).
- **Database User**: A specific database user must be created with read/write privileges to the specific Job Board database.

---

## 🛠 Common Issues & Troubleshooting

### CORS Errors
If the frontend encounters Cross-Origin Resource Sharing (CORS) errors, ensure that the frontend's Vercel domain is added to the allowed origins array in `backend/server.js`.

### 404 API Not Found
If the frontend throws `Not Found - /auth/login` errors, verify that the `VITE_API_URL` environment variable accurately points to the Render instance and includes the `/api` route prefix.

### Failed File Uploads
Currently, the application uses Multer to store uploaded resumes and logos on the local file system (`/uploads` directory). **Render Web Services use ephemeral file systems**. This means that when the Render server restarts or spins down due to inactivity, local files in `/uploads` will be deleted.
- **Troubleshooting**: For a true production environment, Multer must be reconfigured to stream uploads directly to an external object storage bucket like **AWS S3** or **Cloudinary**.
