import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Building2, MapPin, Sparkles, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'default';
      case 'Reviewing': return 'warning';
      case 'Interview': return 'success';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">My Applications</h1>
        <p className="text-text-muted mt-1">Track and manage your job applications.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <Card key={i} className="animate-pulse h-32" />)
        ) : applications.length === 0 ? (
          <Card className="text-center py-16 bg-surface/50">
            <CardContent>
              <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-text mb-2">No applications yet</h3>
              <p className="text-text-muted mb-6">Start your career journey by applying to relevant positions.</p>
              <Link to="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app._id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-text-muted" />
                  </div>
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="text-lg font-semibold hover:text-primary transition-colors text-text group-hover:text-primary">
                      {app.job?.title || 'Unknown Role'}
                    </Link>
                    <div className="text-text-muted text-sm mb-2">{app.job?.company?.name || 'Unknown Company'}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted font-medium">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.job?.location || 'Remote'}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {app.job?.workMode || 'Full-time'}</span>
                      <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
                  {app.aiMatchScore && (
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full dark:bg-emerald-900/20 dark:text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                      {app.aiMatchScore}% Match
                    </div>
                  )}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium
                    ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : 
                      app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800/30' : 
                      app.status === 'Interview' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30' : 
                      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </div>
                  <button className="text-text-muted hover:text-text p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
