import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Clock, Sparkles, CheckCircle, XCircle, GripVertical, CalendarDays, ExternalLink, Mail, UserPlus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import Button from '../../components/ui/Button';

const STAGES = [
  { id: 'Applied', label: 'Applied', color: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/50', icon: Clock },
  { id: 'Reviewing', label: 'Screening', color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/50', icon: Sparkles },
  { id: 'Interview', label: 'Interview', color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50', icon: CalendarDays },
  { id: 'Accepted', label: 'Hired', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50', icon: CheckCircle },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50', icon: XCircle },
];

const RecruiterKanban = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ availableSlots: '', meetingLink: '', message: '' });
  const [pendingDrop, setPendingDrop] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isScanningAts, setIsScanningAts] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, jobsRes] = await Promise.all([
        api.get('/applications/recruiter'),
        api.get('/jobs/recruiter')
      ]);
      setApplications(appsRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching Kanban data', error);
      toast.error('Failed to load ATS data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('applicationId', id);
    // Needed for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (!id || !newStatus) return;

    const currentApp = applications.find(app => app._id === id);
    if (currentApp && currentApp.status === newStatus) return; // No change

    if (newStatus === 'Interview') {
      setPendingDrop({ id, newStatus });
      setIsInterviewModalOpen(true);
      return;
    }

    await processStatusUpdate(id, newStatus);
  };

  const processStatusUpdate = async (id, newStatus, payload = {}) => {
    // Optimistic UI update
    setApplications(apps => apps.map(app => 
      app._id === id ? { ...app, status: newStatus } : app
    ));
    setDraggingId(null);
    setPendingDrop(null);

    try {
      await api.put(`/applications/${id}/status`, { status: newStatus, ...payload });
      toast.success(`Moved to ${STAGES.find(s => s.id === newStatus).label}`);
    } catch (error) {
      console.error('Error updating status', error);
      toast.error('Failed to update status');
      toast.error('Failed to update status');
    }
  };

  const handleAtsScan = async (appId) => {
    setIsScanningAts(true);
    try {
      const res = await api.post('/ai/match-score', { applicationId: appId });
      const { score, analysis } = res.data;
      
      // Update local state
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, aiMatchScore: score, aiAnalysis: analysis } : app));
      
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

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (pendingDrop) {
      processStatusUpdate(pendingDrop.id, pendingDrop.newStatus, interviewForm);
    }
    setIsInterviewModalOpen(false);
    setInterviewForm({ availableSlots: '', meetingLink: '', message: '' });
  };

  const filteredApps = selectedJobId === 'all' 
    ? applications 
    : applications.filter(app => app.job?._id === selectedJobId);

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[hsl(var(--surface-hover)/0.5)] p-6 rounded-2xl border border-border/50 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">ATS Board</h1>
          <p className="text-text-muted mt-1 text-sm">Drag and drop candidates to update their hiring stage.</p>
        </div>
        <div className="w-full sm:w-auto min-w-[250px]">
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full h-10 px-4 rounded-xl border border-border bg-[hsl(var(--surface))] text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none shadow-sm cursor-pointer"
          >
            <option value="all">All Jobs ({applications.length} candidates)</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.title} ({applications.filter(a => a.job?._id === job._id).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20 bg-[hsl(var(--surface)/0.6)] rounded-3xl border border-border/50 border-dashed max-w-lg w-full">
            <UserPlus className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium">No applicants yet</h3>
            <p className="text-text-muted text-sm mt-1 mb-6 px-8">When candidates apply to your jobs, they will appear on this board.</p>
          </div>
        </div>
      ) : (
        /* Kanban Board Columns */
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {STAGES.map(stage => {
            const stageApps = filteredApps.filter(app => app.status === stage.id);
            const StageIcon = stage.icon;
            
            return (
              <div 
                key={stage.id}
                className={cn(
                  "flex-shrink-0 w-80 flex flex-col rounded-2xl border bg-[hsl(var(--surface-hover)/0.3)] snap-center transition-colors duration-200",
                  stage.color,
                  "shadow-sm"
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-inherit flex items-center justify-between bg-white/40 dark:bg-black/10 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <StageIcon className="w-4 h-4" />
                    <h3 className="font-heading font-semibold tracking-wide">{stage.label}</h3>
                  </div>
                  <span className="bg-white dark:bg-black/20 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {stageApps.length}
                  </span>
                </div>
                
                {/* Column Body (Dropzone) */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[500px]">
                  {stageApps.map(app => (
                    <div
                      key={app._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app._id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={cn(
                        "bg-[hsl(var(--surface))] p-4 rounded-xl shadow-sm border border-border/50 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-md transition-all group relative",
                        draggingId === app._id && "opacity-50 scale-95 border-primary"
                      )}
                    >
                      <div className="absolute top-4 right-4 text-border group-hover:text-text-muted transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3 pr-6">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase shrink-0">
                          {app.applicant?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="truncate">
                          <h4 className="font-semibold text-text truncate leading-tight group-hover:text-primary transition-colors">
                            {app.applicant?.name || 'Unknown'}
                          </h4>
                          <p className="text-xs text-text-muted truncate mt-0.5">{app.applicant?.title || 'Candidate'}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-text-muted font-medium bg-[hsl(var(--surface-hover))] px-2.5 py-1.5 rounded-lg mb-3 truncate border border-border/50">
                        {app.job?.title || 'Unknown Job'}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs font-medium bg-background" asChild>
                          <a href={`mailto:${app.applicant?.email}`}>
                            <Mail className="w-3 h-3 mr-1.5" /> Email
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" className="px-2 h-8" title="View Application" onClick={() => setSelectedApp(app)}>
                          <ExternalLink className="w-3.5 h-3.5 text-text-muted hover:text-text" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {stageApps.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-inherit flex items-center justify-center text-sm font-medium opacity-50">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ATS & Resume Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-border relative">
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted hover:text-text z-10"
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <div className="p-8 pb-6 border-b border-border/50 bg-[hsl(var(--surface-hover)/0.5)]">
              <h2 className="text-2xl font-heading font-bold text-text">{selectedApp.applicant?.name}</h2>
              <p className="text-text-muted font-medium">{selectedApp.applicant?.title || 'Candidate'}</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-[hsl(var(--surface-hover))] p-5 rounded-2xl border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" /> ATS Analysis
                  </h3>
                  {selectedApp.resume && (
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold">
                      <a href={selectedApp.resume.startsWith('http') ? selectedApp.resume : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')}${selectedApp.resume}`} target="_blank" rel="noreferrer">
                        View Resume <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
                
                {selectedApp.aiMatchScore !== null && selectedApp.aiMatchScore !== undefined ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-4 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-600 dark:text-emerald-400">
                        {selectedApp.aiMatchScore}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedApp.aiMatchScore}%` }}></div>
                        </div>
                        <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">Match Score</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted bg-background p-3 rounded-xl border border-border/50">
                      {selectedApp.aiAnalysis}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3 bg-background rounded-xl border border-border/50">
                    <p className="text-sm text-text-muted">Scan resume with AI to generate a match score.</p>
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
            </div>
            
            <div className="p-6 border-t border-border/50 bg-[hsl(var(--surface-hover)/0.5)] flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-border relative">
            <div className="p-6 border-b border-border/50 bg-[hsl(var(--surface-hover)/0.5)]">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                Schedule Interview
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
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
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

export default RecruiterKanban;
