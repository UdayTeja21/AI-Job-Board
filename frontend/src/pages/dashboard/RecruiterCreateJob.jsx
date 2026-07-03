import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { Briefcase, MapPin, IndianRupee } from 'lucide-react';

const RecruiterCreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    category: 'Software Development',
    jobType: 'Full-time',
    workMode: 'Remote',
    location: '',
    salaryMin: '',
    salaryMax: '',
    status: 'Active',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchJobDetails = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const job = res.data;
          setJobData({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements ? job.requirements.join(', ') : '',
            category: job.category || 'Software Development',
            jobType: job.jobType || 'Full-time',
            workMode: job.workMode || 'Remote',
            location: job.location || '',
            salaryMin: job.salaryRange?.min || '',
            salaryMax: job.salaryRange?.max || '',
            status: job.status || 'Active',
          });
        } catch (error) {
          console.error(error);
          toast.error('Failed to load job details');
          navigate('/dashboard/jobs');
        } finally {
          setFetching(false);
        }
      };
      fetchJobDetails();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        category: jobData.category,
        jobType: jobData.jobType,
        workMode: jobData.workMode,
        location: jobData.location,
        status: jobData.status,
        salaryRange: {
          min: Number(jobData.salaryMin),
          max: Number(jobData.salaryMax),
        },
      };

      if (isEditMode) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job updated successfully!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully!');
      }
      
      navigate('/dashboard/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center animate-pulse">Loading job data...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text font-heading">{isEditMode ? 'Edit Job Post' : 'Post a New Job'}</h1>
        <p className="text-text-muted mt-1">{isEditMode ? 'Update the details of your job opening.' : 'Fill out the details to publish a new job opening.'}</p>
      </div>

      <Card className="border-none shadow-soft">
        <CardHeader className="bg-[hsl(var(--surface-hover)/0.5)] border-b border-border/50">
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form id="create-job-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Job Title</label>
              <Input name="title" value={jobData.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><Briefcase className="h-4 w-4 text-text-muted" /> Category</label>
                <select name="category" value={jobData.category} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-border bg-[hsl(var(--surface))] text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none shadow-sm">
                  <option value="Software Development">Software Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Job Type</label>
                <select name="jobType" value={jobData.jobType} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-border bg-[hsl(var(--surface))] text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none shadow-sm">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Work Mode</label>
                <select name="workMode" value={jobData.workMode} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-border bg-[hsl(var(--surface))] text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none shadow-sm">
                  <option value="Remote">Remote</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><MapPin className="h-4 w-4 text-text-muted" /> Location</label>
                <Input name="location" value={jobData.location} onChange={handleChange} required placeholder="e.g. San Francisco, CA or Remote" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><IndianRupee className="h-4 w-4 text-text-muted" /> Min Salary</label>
                <Input type="number" name="salaryMin" value={jobData.salaryMin} onChange={handleChange} required placeholder="e.g. 80000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><IndianRupee className="h-4 w-4 text-text-muted" /> Max Salary</label>
                <Input type="number" name="salaryMax" value={jobData.salaryMax} onChange={handleChange} required placeholder="e.g. 120000" />
              </div>
              
              {isEditMode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Job Status</label>
                  <select name="status" value={jobData.status} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-border bg-[hsl(var(--surface))] text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none shadow-sm">
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Job Description</label>
              <textarea 
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                className="w-full min-h-[120px] rounded-lg border border-border bg-[hsl(var(--surface))] px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                placeholder="Describe the responsibilities and expectations..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Requirements (comma-separated)</label>
              <textarea 
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                required
                className="w-full min-h-[80px] rounded-lg border border-border bg-[hsl(var(--surface))] px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                placeholder="e.g. React, Node.js, 3+ years experience"
              ></textarea>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border/50 mt-4 py-6 px-6 gap-3 bg-[hsl(var(--surface-hover)/0.3)]">
          <Button variant="outline" type="button" onClick={() => navigate('/dashboard/jobs')}>Cancel</Button>
          <Button form="create-job-form" type="submit" isLoading={loading} className="shadow-md shadow-primary/20 hover:shadow-primary/40">
            {isEditMode ? 'Update Job' : 'Publish Job'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecruiterCreateJob;
