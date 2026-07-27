import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './context/AuthContext';
import { CardSkeleton } from './components/ui/Skeleton';

// Lazy loaded pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const JobSearch = React.lazy(() => import('./pages/jobs/JobSearch'));
const JobDetails = React.lazy(() => import('./pages/jobs/JobDetails'));
const CompaniesPage = React.lazy(() => import('./pages/CompaniesPage'));

// Static Public Pages
const AboutPage = React.lazy(() => import('./pages/public/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const BlogPage = React.lazy(() => import('./pages/public/BlogPage'));
const PricingPage = React.lazy(() => import('./pages/public/PricingPage'));
const LegalPage = React.lazy(() => import('./pages/public/LegalPage'));

const SeekerDashboard = React.lazy(() => import('./pages/dashboard/SeekerDashboard'));
const SeekerApplications = React.lazy(() => import('./pages/dashboard/SeekerApplications'));
const SeekerSavedJobs = React.lazy(() => import('./pages/dashboard/SeekerSavedJobs'));
const SeekerNotifications = React.lazy(() => import('./pages/dashboard/SeekerNotifications'));
const RecruiterDashboard = React.lazy(() => import('./pages/dashboard/RecruiterDashboard'));
const RecruiterJobs = React.lazy(() => import('./pages/dashboard/RecruiterJobs'));
const RecruiterCompany = React.lazy(() => import('./pages/dashboard/RecruiterCompany'));
const RecruiterCreateJob = React.lazy(() => import('./pages/dashboard/RecruiterCreateJob'));
const FindCandidates = React.lazy(() => import('./pages/dashboard/FindCandidates'));
const DashboardSettings = React.lazy(() => import('./pages/dashboard/DashboardSettings'));
const RecruiterKanban = React.lazy(() => import('./pages/dashboard/RecruiterKanban'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));

const PageLoader = () => (
  <div className="container mx-auto p-8 max-w-4xl">
    <CardSkeleton />
  </div>
);

// A simple wrapper to render the correct dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'recruiter') return <RecruiterDashboard />;
  if (user?.role === 'admin') return <div className="p-8 font-bold text-2xl">Admin Dashboard (Coming soon)</div>;
  return <SeekerDashboard />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-text">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/companies" element={<CompaniesPage />} />
              
              {/* Public Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
              <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
              <Route path="/cookie-policy" element={<LegalPage type="cookie" />} />
              
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardRouter />} />
                <Route path="applications" element={<SeekerApplications />} />
                <Route path="saved" element={<SeekerSavedJobs />} />
                <Route path="notifications" element={<SeekerNotifications />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="jobs" element={<RecruiterJobs />} />
                <Route path="jobs/new" element={<RecruiterCreateJob />} />
                <Route path="jobs/:id/edit" element={<RecruiterCreateJob />} />
                <Route path="ats-board" element={<RecruiterKanban />} />
                <Route path="company" element={<RecruiterCompany />} />
                <Route path="candidates" element={<FindCandidates />} />
              </Route>
              
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-surface text-text border border-border shadow-premium',
            style: {
              borderRadius: '12px',
              background: 'var(--surface)',
              color: 'var(--text)',
            },
          }} 
        />
      </div>
    </Router>
  );
}

export default App;
