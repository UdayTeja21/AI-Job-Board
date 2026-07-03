# Folder Structure Documentation

This document explains the organization of the AI Job Board monorepo. The repository is split into two primary domains: `backend` and `frontend`.

---

## 📁 Root Directory
```text
AI-Job-Board/
├── .github/          # Contains GitHub Actions CI/CD workflows
├── backend/          # Node.js / Express backend application
├── docs/             # Comprehensive engineering documentation
├── frontend/         # React / Vite frontend application
└── README.md         # High-level entry point for the repository
```

---

## 💻 Backend Directory (`/backend`)
The backend is structured around the MVC (Model-View-Controller) design pattern.

```text
backend/
├── src/
│   ├── config/             # Database and external service configurations
│   │   └── db.js           # MongoDB connection logic
│   ├── controllers/        # Core business logic
│   │   ├── aiController.js         # Interacts with Gemini API
│   │   ├── applicationController.js# Handles job applications and ATS states
│   │   ├── authController.js       # Login and Registration logic
│   │   ├── companyController.js    # Company profile management
│   │   └── jobController.js        # CRUD operations for jobs
│   ├── middleware/         # Express middleware interceptors
│   │   ├── authMiddleware.js       # JWT validation & Role authorization
│   │   └── errorMiddleware.js      # Global error handling and 404s
│   ├── models/             # Mongoose schemas (Data definition)
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Notification.js
│   │   └── User.js
│   ├── routes/             # Express API route definitions
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   └── uploadRoutes.js
│   └── utils/              # Helper functions and external integrations
│       ├── emailTemplates.js
│       └── sendEmail.js
├── uploads/                # Local storage for user uploads (Resumes/Logos)
├── .env                    # Environment variables (Git-ignored)
├── package.json            # Node.js dependencies and scripts
└── server.js               # Entry point of the Express application
```

---

## 🎨 Frontend Directory (`/frontend`)
The frontend is a Vite-powered React application focusing on component reusability.

```text
frontend/
├── public/                 # Static assets (Favicon, robots.txt)
├── src/
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Structural wrappers
│   │   │   ├── DashboardLayout.jsx # Role-based dashboard sidebar
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   └── ui/             # Dumb/Presentational UI components
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       └── Skeleton.jsx
│   ├── context/            # React Context API state providers
│   │   └── AuthContext.jsx # Global user session state
│   ├── pages/              # Heavy page components mapped to routes
│   │   ├── auth/           # Login.jsx, Register.jsx
│   │   ├── dashboard/      # Role-specific dashboard views (Seeker/Recruiter)
│   │   └── jobs/           # JobSearch.jsx, JobDetails.jsx
│   ├── services/           # External API communication
│   │   └── api.js          # Configured Axios instance with interceptors
│   ├── App.jsx             # Root React component containing React Router
│   ├── index.css           # Global Tailwind CSS entry point
│   └── main.jsx            # Application mount point
├── .env                    # Environment variables (Git-ignored)
├── eslint.config.js        # Linter configuration
├── index.html              # HTML entry point
├── package.json            # Frontend dependencies
├── tailwind.config.js      # Tailwind CSS theme and styling rules
└── vite.config.js          # Vite build configuration
```
