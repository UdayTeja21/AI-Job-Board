import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Building2, MapPin, Sparkles, Clock, CheckCircle, XCircle, MoreVertical, BellRing, CalendarDays, ExternalLink } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
              <BellRing className="w-5 h-5 animate-pulse-slow" />
            </div>
            <h2 className="text-lg font-bold text-blue-900 font-heading">Application Updates</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {activeAlerts.map(alertApp => (
              <div key={`alert-${alertApp._id}`} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm flex items-start gap-3">
                {alertApp.status === 'Interview' ? (
                  <CalendarDays className="w-8 h-8 text-indigo-500 shrink-0 mt-1" />
                ) : alertApp.status === 'Accepted' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 mt-1" />
                ) : (
                  <Sparkles className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{alertApp.job?.title || 'Unknown Role'}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{alertApp.job?.company?.name || 'Unknown Company'}</p>
                  <p 
                    className={`text-xs font-bold mt-2 px-2 py-1 rounded inline-block ${
                      alertApp.status === 'Interview' ? 'bg-indigo-100 border border-indigo-200' :
                      alertApp.status === 'Accepted' ? 'bg-emerald-100 border border-emerald-200' :
                      'bg-blue-100 border border-blue-200'
                    }`}
                    style={{
                      color: alertApp.status === 'Interview' ? '#3730a3' :
                             alertApp.status === 'Accepted' ? '#065f46' :
                             '#1e40af'
                    }}
                  >
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
                
                <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-5 md:pt-0 border-border/50 gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {app.aiMatchScore && (
                      <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
                        <Sparkles className="h-4 w-4" />
                        {app.aiMatchScore}% Match
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded-sm uppercase tracking-wider ml-1">Beta</span>
                      </div>
                    )}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span 
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border
                        ${app.status === 'Accepted' ? 'bg-emerald-50 border-emerald-200' : 
                          app.status === 'Rejected' ? 'bg-red-50 border-red-200' : 
                          app.status === 'Interview' ? 'bg-indigo-50 border-indigo-200' : 
                          app.status === 'Reviewing' ? 'bg-blue-50 border-blue-200' : 
                          'bg-slate-50 border-slate-200'}`}
                        style={{
                          color: app.status === 'Accepted' ? '#065f46' :
                                 app.status === 'Rejected' ? '#991b1b' :
                                 app.status === 'Interview' ? '#3730a3' :
                                 app.status === 'Reviewing' ? '#92400e' :
                                 '#1e40af'
                        }}
                      >
                        {getStatusIcon(app.status)}
                        <span className="tracking-wide uppercase text-xs">{app.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  {app.status === 'Interview' && app.interviewDetails && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-xl w-full max-w-sm ml-auto mt-2 text-sm text-indigo-900 dark:text-indigo-200">
                      <p className="font-semibold mb-2 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Interview Scheduled</p>
                      <p className="whitespace-pre-wrap mb-3 text-xs opacity-90">{app.interviewDetails.availableSlots}</p>
                      {app.interviewDetails.meetingLink && (
                        <a href={app.interviewDetails.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-xs">
                          <ExternalLink className="w-3.5 h-3.5" /> Join Meeting
                        </a>
                      )}
                    </div>
                  )}
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
