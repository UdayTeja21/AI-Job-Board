import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, Plus, Edit, Trash, Users, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/recruiter'),
        api.get('/applications/recruiter')
      ]);

      const apps = appsRes.data;
      const jobsWithCounts = jobsRes.data.map(job => ({
        ...job,
        applicantCount: apps.filter(a => a.job?._id === job._id).length
      }));
      setJobs(jobsWithCounts);
    } catch (error) {
      console.error('Error fetching jobs', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await api.delete(`/jobs/${id}`);
        toast.success('Job deleted successfully');
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        console.error('Error deleting job', error);
        toast.error('Failed to delete job');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[hsl(var(--surface-hover)/0.5)] p-6 rounded-2xl border border-border/50">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Manage Jobs</h1>
          <p className="text-text-muted mt-1 text-sm">Create, edit, and manage your job postings.</p>
        </div>
        <Link to="/dashboard/jobs/new">
          <Button className="flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
            <Plus className="h-4 w-4" /> Post a New Job
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-text-muted animate-pulse">Loading your jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-[hsl(var(--surface)/0.6)]">
              <Briefcase className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium">No jobs posted yet</h3>
              <p className="text-text-muted text-sm mt-1 mb-6 max-w-md mx-auto">Post your first job to start building your hiring pipeline.</p>
              <Link to="/dashboard/jobs/new">
                <Button>Create Job Post</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[hsl(var(--surface-hover)/0.3)]">
                  <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-[hsl(var(--surface-hover)/0.5)] transition-colors group">
                    <td className="px-6 py-5">
                      <Link to={`/jobs/${job._id}`} className="font-semibold text-text hover:text-primary transition-colors block text-lg font-heading">
                        {job.title}
                      </Link>
                      <div className="text-sm text-text-muted mt-1 flex items-center gap-2">
                        <span>{job.jobType}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        job.status === 'Active' ? 'bg-white text-green-600 dark:bg-transparent dark:text-green-500' : 'bg-white text-gray-600 dark:bg-transparent dark:text-gray-400'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-text font-medium bg-[hsl(var(--surface))] w-fit px-3 py-1.5 rounded-lg border border-border/50">
                        <Users className="h-4 w-4 text-primary" />
                        {job.applicantCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-text-muted font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => navigate(`/dashboard/jobs/${job._id}/edit`)}
                          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10 shadow-sm border border-transparent hover:border-primary/20 bg-[hsl(var(--surface))]"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="p-2 text-text-muted hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm border border-transparent hover:border-red-200 bg-[hsl(var(--surface))]"
                          title="Delete Job"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecruiterJobs;
