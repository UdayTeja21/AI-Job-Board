import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users, Eye, MousePointerClick } from 'lucide-react';
import Button from '../../components/ui/Button';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd have a specific endpoint for "my posted jobs"
    // Here we'll just fetch all jobs and filter on the backend normally
    // but for mock purposes we'll simulate it by calling /jobs
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        // Pretend these are the recruiter's jobs
        setJobs(res.data.jobs.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <Button>Post New Job</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-surface">
          <CardContent className="p-6">
            <h3 className="text-text-muted font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" /> Total Job Views
            </h3>
            <p className="text-4xl font-bold mt-2 text-text">1,248</p>
          </CardContent>
        </Card>
        <Card className="bg-surface">
          <CardContent className="p-6">
            <h3 className="text-text-muted font-medium flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" /> Total Clicks
            </h3>
            <p className="text-4xl font-bold mt-2 text-text">432</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="text-text-muted font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Applicants
            </h3>
            <p className="text-4xl font-bold mt-2 text-primary">64</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold pt-4">Your Active Jobs</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <Card key={i} className="animate-pulse h-24" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-border">
          <h3 className="text-lg font-medium">No jobs posted yet</h3>
          <p className="text-text-muted text-sm mt-1 mb-4">Post a job to start receiving applications.</p>
          <Button>Post your first job</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 space-y-1">
                  <Link to={`/jobs/${job._id}`} className="text-lg font-semibold hover:text-primary transition-colors">
                    {job.title}
                  </Link>
                  <p className="text-sm text-text-muted">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 border-r border-border">
                    <span className="block text-2xl font-bold text-primary">12</span>
                    <span className="text-xs text-text-muted uppercase tracking-wider">Applicants</span>
                  </div>
                  <Badge variant={job.status === 'Active' ? 'success' : 'default'}>{job.status}</Badge>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
