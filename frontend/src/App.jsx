import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobSearch from './pages/jobs/JobSearch';
import JobDetails from './pages/jobs/JobDetails';
import DashboardLayout from './components/layout/DashboardLayout';
import SeekerDashboard from './pages/dashboard/SeekerDashboard';
import SeekerApplications from './pages/dashboard/SeekerApplications';
import SeekerSavedJobs from './pages/dashboard/SeekerSavedJobs';
import SeekerNotifications from './pages/dashboard/SeekerNotifications';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import RecruiterJobs from './pages/dashboard/RecruiterJobs';
import RecruiterCompany from './pages/dashboard/RecruiterCompany';
import RecruiterCreateJob from './pages/dashboard/RecruiterCreateJob';
import FindCandidates from './pages/dashboard/FindCandidates';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import RecruiterKanban from './pages/dashboard/RecruiterKanban';
import { useAuth } from './context/AuthContext';

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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardRouter />} />
              <Route path="applications" element={<SeekerApplications />} />
              <Route path="saved" element={<SeekerSavedJobs />} />
              <Route path="notifications" element={<SeekerNotifications />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="jobs" element={<RecruiterJobs />} />
              <Route path="jobs/new" element={<RecruiterCreateJob />} />
              <Route path="jobs/:id/edit" element={<RecruiterCreateJob />} />
              <Route path="kanban" element={<RecruiterKanban />} />
              <Route path="company" element={<RecruiterCompany />} />
              <Route path="candidates" element={<FindCandidates />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
