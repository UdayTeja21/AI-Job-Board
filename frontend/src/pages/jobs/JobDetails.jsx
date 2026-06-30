import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, Building2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resume, setResume] = useState(user?.resume || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const generateAiSummary = async () => {
    setLoadingAi(true);
    try {
      const res = await api.post('/ai/job-summary', { jobId: id });
      setAiSummary(res.data.summary);
    } catch (error) {
      toast.error('Failed to generate AI summary');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post('/applications', {
        jobId: id,
        resume,
        coverLetter
      });
      toast.success('Successfully applied for the job!');
      setIsApplyModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!job) {
    return <div className="text-center py-20 text-xl font-semibold">Job not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
           <span className="text-4xl font-bold text-gray-400">{job.company?.name?.charAt(0) || 'C'}</span>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-lg text-text-muted font-medium">
              <Building2 className="h-5 w-5" />
              {job.company?.name}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.workMode}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> ${job.salaryRange?.min.toLocaleString()} - ${job.salaryRange?.max.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="default">{job.jobType}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          {user?.role !== 'recruiter' && user?.role !== 'admin' && (
            <Button size="lg" className="w-full" onClick={() => user ? setIsApplyModalOpen(true) : window.location.href = '/login'}>
              Apply Now
            </Button>
          )}
          <Button variant="secondary" onClick={generateAiSummary} isLoading={loadingAi} className="w-full group">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500 group-hover:animate-pulse" />
            AI Job Summary
          </Button>
        </div>
      </div>

      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Sparkles className="h-5 w-5" />
                <h3>AI Generated Summary</h3>
              </div>
              <p className="text-text leading-relaxed">{aiSummary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-border pb-2">About the Role</h2>
            <div className="prose dark:prose-invert max-w-none text-text-muted leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-border pb-2">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 text-text-muted">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">About the Company</h3>
              <p className="text-sm text-text-muted">{job.company?.description || 'No description provided.'}</p>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline block mt-2">
                  Visit Website &rarr;
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Modal (simplified implementation without creating a separate Modal component file if not strictly necessary, or I will create it in a moment) */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold">Apply for {job.title}</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-text-muted hover:text-text">✕</button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resume URL</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Link to your resume/portfolio"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                <textarea 
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a great fit?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={applying}>Submit Application</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
