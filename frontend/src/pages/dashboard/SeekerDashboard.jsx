import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Briefcase, Clock, FileText, CheckCircle, ChevronRight, TrendingUp, Search } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { useSocket } from '../../context/SocketContext';

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        api.get('/applications/my-applications'),
        api.get('/jobs?pageNumber=1')
      ]);
      setApplications(appsRes.data);
      const activeJobs = jobsRes.data.jobs.slice(0, 3).map(job => ({
        ...job,
        match: Math.floor(Math.random() * (95 - 75 + 1)) + 75
      }));
      setRecommendedJobs(activeJobs);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = () => {
        // Refresh dashboard data when a notification (like application update) occurs
        fetchData();
      };
      socket.on('new_notification', handleNewNotification);
      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [socket]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return { className: 'bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800', style: { color: '#1e40af' } };
      case 'Reviewing': return { className: 'bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800', style: { color: '#92400e' } };
      case 'Interview': return { className: 'bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800', style: { color: '#6b21a8' } };
      case 'Rejected': return { className: 'bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800', style: { color: '#991b1b' } };
      case 'Accepted': return { className: 'bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800', style: { color: '#065f46' } };
      default: return { className: 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700', style: { color: '#1f2937' } };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 rounded-3xl glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">Welcome back!</h1>
          <p className="text-text-muted mt-2 text-lg">Here's what's happening with your job search today.</p>
        </div>
        <Button size="lg" asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40">
          <Link to="/jobs"><Search className="w-5 h-5 mr-2" /> Find Jobs</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card hoverEffect className="group relative overflow-hidden border-none shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Applications</p>
              <h3 className="text-3xl font-heading font-bold text-text mt-1">{applications.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card hoverEffect className="group relative overflow-hidden border-none shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">In Review</p>
              <h3 className="text-3xl font-heading font-bold text-text mt-1">{applications.filter(a => a.status === 'Applied' || a.status === 'Reviewing').length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect className="group relative overflow-hidden border-none shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Interviews</p>
              <h3 className="text-3xl font-heading font-bold text-text mt-1">{applications.filter(a => a.status === 'Interview').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-heading font-bold">Recent Applications</h2>
            <Link to="/dashboard/applications" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Card key={i} className="animate-pulse h-24" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-[hsl(var(--surface)/0.5)] rounded-2xl border border-border border-dashed backdrop-blur-sm">
              <h3 className="text-lg font-medium">No applications yet</h3>
              <p className="text-text-muted text-sm mt-1 mb-4">Start applying to jobs to see them here.</p>
              <Button asChild><Link to="/jobs">Browse Jobs</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <Card hoverEffect key={app._id} className="border-border/50">
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-lg hover:text-primary transition-colors">
                          {app.job?.title || 'Unknown Job'}
                        </Link>
                        <p className="text-sm text-text-muted">{app.job?.company?.name || 'Unknown Company'} • {app.job?.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                      <span style={getStatusColor(app.status).style} className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs border font-medium", getStatusColor(app.status).className)}>
                        {app.status}
                      </span>
                      <span className="text-xs text-text-muted">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <Card className="shadow-soft h-full flex flex-col border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <CardHeader className="pb-4 border-b border-border/50 bg-[hsl(var(--surface-hover)/0.5)] relative z-10">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="font-heading">Recommended for You</span>
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col gap-4 relative z-10">
            {recommendedJobs.length === 0 ? (
              <div className="text-sm text-text-muted text-center py-8">No recommendations available at this time.</div>
            ) : recommendedJobs.map((job) => (
              <div key={job._id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-all duration-300 border border-transparent hover:border-border/50 cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform flex-shrink-0 shadow-sm">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text truncate group-hover:text-primary transition-colors">{job.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                      {job.match}% Match
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded-sm uppercase tracking-wider">Beta</span>
                    </span>
                  </div>
                  <div className="text-sm text-text-muted flex items-center gap-2 mt-1.5">
                    <span className="truncate max-w-[90px] font-medium">{job.company?.name || 'Unknown'}</span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-auto pt-4 border-t border-border/50">
              <Button variant="ghost" className="w-full text-sm font-medium hover:text-primary">
                View all matches <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerDashboard;
