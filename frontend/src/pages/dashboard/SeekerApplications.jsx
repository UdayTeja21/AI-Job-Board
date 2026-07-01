import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Building2, MapPin, Sparkles, Clock, CheckCircle, XCircle, MoreVertical, BellRing, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <Clock className="h-4 w-4" />;
      case 'Reviewing': return <Sparkles className="h-4 w-4" />;
      case 'Interview': return <Briefcase className="h-4 w-4" />;
      case 'Accepted': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Applications that need attention / have positive updates
  const activeAlerts = applications.filter(app => ['Reviewing', 'Interview', 'Accepted'].includes(app.status));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 rounded-3xl glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">My Applications</h1>
          <p className="text-text-muted mt-2 text-lg">Track and manage your job applications.</p>
        </div>
      </div>

      {/* Dynamic Status Alerts Banner */}
      {!loading && activeAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm">
              <BellRing className="w-5 h-5 animate-pulse-slow" />
            </div>
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 font-heading">Application Updates</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {activeAlerts.map(alertApp => (
              <div key={`alert-${alertApp._id}`} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-slate-700/50 flex items-start gap-3">
                {alertApp.status === 'Interview' ? (
                  <CalendarDays className="w-8 h-8 text-indigo-500 shrink-0 mt-1" />
                ) : alertApp.status === 'Accepted' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 mt-1" />
                ) : (
                  <Sparkles className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                )}
                <div>
                  <h4 className="font-semibold text-text line-clamp-1">{alertApp.job?.title || 'Unknown Role'}</h4>
                  <p className="text-sm text-text-muted mt-0.5 line-clamp-1">{alertApp.job?.company?.name || 'Unknown Company'}</p>
                  <p className={`text-xs font-bold mt-2 px-2 py-1 rounded inline-block ${
                    alertApp.status === 'Interview' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                    alertApp.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {alertApp.status === 'Interview' ? 'Interview Scheduled!' : 
                     alertApp.status === 'Accepted' ? 'Offer Extended!' :
                     'Application Under Review'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => <Card key={i} className="animate-pulse h-32 border-none" />)
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-[hsl(var(--surface)/0.6)] rounded-3xl border border-border/50 border-dashed backdrop-blur-sm">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
              <Briefcase className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-heading font-medium mb-2">No applications yet</h3>
            <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">Start your career journey by applying to relevant positions.</p>
            <Link to="/jobs">
              <Button size="lg" className="shadow-lg shadow-primary/20">Browse Open Jobs</Button>
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <Card hoverEffect key={app._id} className="border-border/50 shadow-sm group">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-5 flex-1">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="text-xl font-heading font-bold text-text group-hover:text-primary transition-colors">
                      {app.job?.title || 'Unknown Role'}
                    </Link>
                    <div className="text-text-muted font-medium mb-3 mt-1">{app.job?.company?.name || 'Unknown Company'}</div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted font-medium bg-[hsl(var(--surface-hover)/0.5)] px-4 py-2 rounded-xl w-fit">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {app.job?.location || 'Remote'}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {app.job?.workMode || 'Full-time'}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-5 md:pt-0 border-border/50">
                  {app.aiMatchScore && (
                    <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
                      <Sparkles className="h-4 w-4" />
                      {app.aiMatchScore}% Match
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded-sm uppercase tracking-wider ml-1">Beta</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-sm
                    ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : 
                      app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800/30' : 
                      app.status === 'Interview' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/30' : 
                      app.status === 'Reviewing' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30' : 
                      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                    {getStatusIcon(app.status)}
                    <span className="tracking-wide uppercase text-xs">{app.status}</span>
                  </div>
                  <button className="text-text-muted hover:text-primary p-2 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-colors border border-transparent hover:border-border/50">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SeekerApplications;
