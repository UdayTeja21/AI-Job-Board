import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Building2, MapPin, Sparkles } from 'lucide-react';

const SeekerDashboard = () => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="p-6">
            <h3 className="text-blue-100 font-medium">Total Applications</h3>
            <p className="text-4xl font-bold mt-2">{applications.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface">
          <CardContent className="p-6">
            <h3 className="text-text-muted font-medium">Interviews</h3>
            <p className="text-4xl font-bold mt-2 text-text">
              {applications.filter(a => a.status === 'Interview').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface">
          <CardContent className="p-6">
            <h3 className="text-text-muted font-medium">Profile Views</h3>
            <p className="text-4xl font-bold mt-2 text-text">24</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold pt-4">Recent Applications</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <Card key={i} className="animate-pulse h-24" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-border">
          <h3 className="text-lg font-medium">No applications yet</h3>
          <p className="text-text-muted text-sm mt-1 mb-4">Start applying to jobs to see them here.</p>
          <Link to="/jobs" className="text-primary hover:underline font-medium">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 space-y-1">
                  <Link to={`/jobs/${app.job?._id}`} className="text-lg font-semibold hover:text-primary transition-colors">
                    {app.job?.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {app.job?.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {app.job?.workMode}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {app.aiMatchScore && (
                    <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full dark:bg-emerald-900/20 dark:text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                      {app.aiMatchScore}% Match
                    </div>
                  )}
                  <Badge variant={getStatusColor(app.status)}>{app.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
