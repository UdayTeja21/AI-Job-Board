import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Users, Search, TrendingUp, UserPlus, ChevronRight, Briefcase, Calendar, CheckCircle, XCircle, Clock, CalendarDays, ExternalLink, Mail, X, Download, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [funnel, setFunnel] = useState({ sourced: 0, screening: 0, interviewing: 0, hired: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ availableSlots: '', meetingLink: '', message: '' });
  const [isScanningAts, setIsScanningAts] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/recruiter'),
        api.get('/applications/recruiter')
      ]);
      
      // Calculate real applicant counts per job
      const apps = appsRes.data;
      const jobsWithCounts = jobsRes.data.map(job => ({
        ...job,
        applicantCount: apps.filter(a => a.job?._id === job._id).length
      }));
      setJobs(jobsWithCounts.slice(0, 3)); // show top 3 jobs

      const formattedApplicants = apps.map(app => ({
        _id: app._id,
        name: app.applicant?.name || 'Unknown',
        role: app.applicant?.title || 'Candidate',
        jobTitle: app.job?.title || 'Unknown Job',
        match: Math.floor(Math.random() * 20 + 75), // mockup match
        appliedDate: new Date(app.createdAt).toLocaleDateString(),
        status: app.status,
        email: app.applicant?.email,
        skills: app.applicant?.skills || [],
        resume: app.resume,
        aiMatchScore: app.aiMatchScore,
        aiAnalysis: app.aiAnalysis
      }));
      setRecentApplicants(formattedApplicants);

      // calculate funnel
      setFunnel({
        sourced: apps.length,
        screening: apps.filter(a => a.status === 'Reviewing').length,
        interviewing: apps.filter(a => a.status === 'Interview').length,
        hired: apps.filter(a => a.status === 'Accepted').length
      });

    } catch (error) {
      console.error('Error fetching dashboard data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId, newStatus, payload = {}) => {
    try {
      setIsUpdatingStatus(true);
      await api.put(`/applications/${appId}/status`, { status: newStatus, ...payload });
      toast.success(newStatus === 'Interview' ? 'Interview Scheduled & Candidate Notified!' : `Candidate status updated to ${newStatus}`);
      
      // Close modal and refresh data
      setSelectedApp(null);
      setIsInterviewModalOpen(false);
      setInterviewForm({ availableSlots: '', meetingLink: '', message: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const exportToCSV = () => {
    if (recentApplicants.length === 0) return toast.error('No applicants to export');
    
    const headers = ['Name', 'Email', 'Job Title', 'Applied Date', 'Status', 'Match Score'];
    const csvContent = [
      headers.join(','),
      ...recentApplicants.map(app => 
        `"${app.name}","${app.email}","${app.jobTitle}","${app.appliedDate}","${app.status}","${app.match}%"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Candidates exported successfully');
  };

  const handleAtsScan = async (appId) => {
    setIsScanningAts(true);
    try {
      const res = await api.post('/ai/match-score', { applicationId: appId });
      const { score, analysis } = res.data;
      
      // Update local state
      setRecentApplicants(prev => prev.map(app => app._id === appId ? { ...app, aiMatchScore: score, aiAnalysis: analysis } : app));
      
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp({ ...selectedApp, aiMatchScore: score, aiAnalysis: analysis });
      }
      toast.success('ATS Scan Complete');
    } catch (error) {
      toast.error('ATS Scan failed');
    } finally {
      setIsScanningAts(false);
    }
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    updateApplicationStatus(selectedApp._id, 'Interview', interviewForm);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Applied</Badge>;
      case 'Reviewing': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Screening</Badge>;
      case 'Interview': return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Interviewing</Badge>;
      case 'Rejected': return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'Accepted': return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Hired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 rounded-3xl glass-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3"></div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">Recruitment Hub</h1>
          <p className="text-text-muted mt-2 text-lg">Manage your job postings and hiring pipeline with ease.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto z-10">
          <Button variant="secondary" className="flex-1 sm:flex-none shadow-sm" asChild>
            <Link to="/dashboard/candidates"><Search className="w-4 h-4 mr-2" /> Find Talent</Link>
          </Button>
          <Button size="lg" className="flex-1 sm:flex-none shadow-lg shadow-primary/20 hover:shadow-primary/40" asChild>
            <Link to="/dashboard/jobs/new"><Briefcase className="w-5 h-5 mr-2" /> Post a Job</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Pipeline & Jobs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hiring Funnel Overview - Sleek Blue/Indigo Palette */}
          <Card hoverEffect className="border-none shadow-soft overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-4 border-b border-border/50 relative z-10 bg-[hsl(var(--surface-hover)/0.5)]">
              <CardTitle className="text-xl flex items-center justify-between font-heading">
                <span>Hiring Pipeline</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="flex flex-col items-center p-5 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-800/10 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden group/item">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
                  <span className="text-4xl font-heading font-bold text-slate-700 dark:text-slate-300 group-hover/item:scale-110 transition-transform duration-300">{funnel.sourced}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Total Apps</span>
                </div>
                <div className="flex flex-col items-center p-5 bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 shadow-sm relative overflow-hidden group/item">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                  <span className="text-4xl font-heading font-bold text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300">{funnel.screening}</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-2">Screening</span>
                </div>
                <div className="flex flex-col items-center p-5 bg-gradient-to-b from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm relative overflow-hidden group/item">
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                  <span className="text-4xl font-heading font-bold text-indigo-600 dark:text-indigo-400 group-hover/item:scale-110 transition-transform duration-300">{funnel.interviewing}</span>
                  <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mt-2">Interviewing</span>
                </div>
                <div className="flex flex-col items-center p-5 bg-gradient-to-b from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 rounded-2xl border border-primary/20 dark:border-primary/20 shadow-sm relative overflow-hidden group/item">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <span className="text-4xl font-heading font-bold text-primary group-hover/item:scale-110 transition-transform duration-300">{funnel.hired}</span>
                  <span className="text-sm font-medium text-primary mt-2">Hired</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Jobs Summary */}
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-xl font-heading font-bold">Your Active Jobs</h2>
              <Link to="/dashboard/jobs" className="text-sm text-primary hover:underline font-medium">Manage all</Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <Card key={i} className="animate-pulse h-28" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-[hsl(var(--surface)/0.6)] rounded-3xl border border-border/50 border-dashed backdrop-blur-sm">
                <Briefcase className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium">No jobs posted yet</h3>
                <p className="text-text-muted text-sm mt-1 mb-6 max-w-md mx-auto">Post your first job to start building your hiring pipeline and receive applications from top talent.</p>
                <Button size="lg" className="shadow-lg shadow-primary/20" asChild><Link to="/dashboard/jobs/new">Create Job Post</Link></Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card hoverEffect key={job._id} className="border-border/50 group/job">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div className="flex-1 space-y-1.5">
                        <Link to={`/jobs/${job._id}`} className="text-lg font-semibold group-hover/job:text-primary transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-sm text-text-muted flex items-center gap-3">
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-text-muted" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          <span className="flex items-center">{job.jobType}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 bg-[hsl(var(--surface-hover))] py-2 px-6 rounded-xl border border-border/50">
                        <div className="text-center">
                          <span className="block text-2xl font-heading font-bold text-primary">{job.applicantCount || 0}</span>
                          <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">Applicants</span>
                        </div>
                        <div className="w-px h-10 bg-border/50"></div>
                        <Badge variant={job.status === 'Active' ? 'success' : 'default'} className="hidden sm:inline-flex shadow-sm">{job.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Applicants */}
        <div className="lg:col-span-1">
          <Card className="shadow-soft h-full flex flex-col border-none overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <CardHeader className="pb-4 border-b border-border/50 bg-[hsl(var(--surface-hover)/0.5)] relative z-10 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center font-heading m-0">
                <span>Recent Applicants</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={exportToCSV} className="h-8 px-2 text-text-muted hover:text-primary">
                <Download className="w-4 h-4 mr-1.5" /> Export
              </Button>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col gap-5 relative z-10">
              {recentApplicants.length === 0 ? (
                <div className="text-center text-text-muted py-10 flex flex-col items-center">
                  <Users className="w-10 h-10 text-border mb-3" />
                  <span>No recent applicants</span>
                </div>
              ) : recentApplicants.slice(0, 5).map((applicant) => (
                <div 
                  key={applicant._id} 
                  className="flex gap-4 items-start p-3 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-all duration-300 border border-transparent hover:border-border/50 cursor-pointer group"
                  onClick={() => setSelectedApp(applicant)}
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold flex-shrink-0 uppercase shadow-sm group-hover:scale-110 transition-transform">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-text truncate group-hover:text-primary transition-colors">{applicant.name}</h4>
                      <span className="text-[10px] text-text-muted whitespace-nowrap ml-2 font-medium bg-[hsl(var(--surface-hover))] px-1.5 py-0.5 rounded">{applicant.appliedDate}</span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">{applicant.role}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-medium text-text-muted truncate max-w-[120px]">{applicant.jobTitle}</span>
                      {getStatusBadge(applicant.status)}
                    </div>
                  </div>
                </div>
              ))}
              {recentApplicants.length > 5 && (
                <div className="mt-auto pt-6 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-sm font-medium hover:text-primary group">
                    View all candidates <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Actions Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-border relative">
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted hover:text-text z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 pb-6 border-b border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl uppercase shadow-lg">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text">{selectedApp.name}</h2>
                  <p className="text-text-muted font-medium">{selectedApp.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs bg-[hsl(var(--surface-hover))]">{selectedApp.jobTitle}</Badge>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {/* ATS & Resume Section */}
              <div className="bg-[hsl(var(--surface-hover))] p-5 rounded-2xl border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" /> ATS Analysis
                  </h3>
                  {selectedApp.resume && (
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold">
                      <a href={selectedApp.resume.startsWith('http') ? selectedApp.resume : `http://localhost:5000${selectedApp.resume}`} target="_blank" rel="noreferrer">
                        View Resume <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
                
                {selectedApp.aiMatchScore ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-4 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-600 dark:text-emerald-400">
                        {selectedApp.aiMatchScore}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedApp.aiMatchScore}%` }}></div>
                        </div>
                        <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">Excellent Match</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted bg-background p-3 rounded-xl border border-border/50">
                      {selectedApp.aiAnalysis}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3 bg-background rounded-xl border border-border/50">
                    <p className="text-sm text-text-muted">Scan resume with AI to generate a match score against the job requirements.</p>
                    <Button 
                      variant="primary" 
                      onClick={() => handleAtsScan(selectedApp._id)} 
                      isLoading={isScanningAts}
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Scan with ATS
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--surface-hover))] border border-border/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${selectedApp.email}`} className="text-text font-medium hover:text-primary transition-colors">{selectedApp.email}</a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Application Pipeline Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className={cn("justify-start", selectedApp.status === 'Reviewing' && 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800')}
                    onClick={() => updateApplicationStatus(selectedApp._id, 'Reviewing')}
                    disabled={isUpdatingStatus || selectedApp.status === 'Reviewing'}
                  >
                    <Search className="w-4 h-4 mr-2 text-blue-500" /> Start Screening
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("justify-start", selectedApp.status === 'Interview' && 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800')}
                    onClick={() => setIsInterviewModalOpen(true)}
                    disabled={isUpdatingStatus || selectedApp.status === 'Interview'}
                  >
                    <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" /> Schedule Interview
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("justify-start", selectedApp.status === 'Rejected' && 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800')}
                    onClick={() => updateApplicationStatus(selectedApp._id, 'Rejected')}
                    disabled={isUpdatingStatus || selectedApp.status === 'Rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2 text-red-500" /> Reject Candidate
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("justify-start", selectedApp.status === 'Accepted' && 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800')}
                    onClick={() => updateApplicationStatus(selectedApp._id, 'Accepted')}
                    disabled={isUpdatingStatus || selectedApp.status === 'Accepted'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Hire Candidate
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border/50 bg-[hsl(var(--surface-hover)/0.5)] flex justify-between items-center">
              <Button variant="ghost" className="text-text-muted" asChild>
                <a href={`/dashboard/applications/${selectedApp._id}`}><ExternalLink className="w-4 h-4 mr-2" /> View Full Profile</a>
              </Button>
              <Button variant="secondary" onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-border relative">
            <div className="p-6 border-b border-border/50 bg-[hsl(var(--surface-hover)/0.5)]">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                Schedule Interview with {selectedApp.name}
              </h2>
            </div>
            <form onSubmit={handleScheduleInterview}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Proposed Time Slots</label>
                  <textarea 
                    required
                    placeholder="e.g. Monday 10:00 AM EST, Thursday 2:00 PM EST"
                    className="w-full min-h-[80px] rounded-xl border border-border bg-[hsl(var(--surface))] px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                    value={interviewForm.availableSlots}
                    onChange={(e) => setInterviewForm({...interviewForm, availableSlots: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Meeting Link</label>
                  <input 
                    type="url"
                    required
                    placeholder="https://meet.google.com/..."
                    className="w-full h-11 rounded-xl border border-border bg-[hsl(var(--surface))] px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Message to Candidate (Optional)</label>
                  <textarea 
                    placeholder="Looking forward to chatting!"
                    className="w-full min-h-[80px] rounded-xl border border-border bg-[hsl(var(--surface))] px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                    value={interviewForm.message}
                    onChange={(e) => setInterviewForm({...interviewForm, message: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border/50 bg-[hsl(var(--surface-hover)/0.5)] flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsInterviewModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isUpdatingStatus} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterDashboard;
