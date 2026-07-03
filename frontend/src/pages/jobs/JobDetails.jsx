import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Briefcase, IndianRupee, Calendar, Sparkles, Building2, Bot, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/utils';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  useEffect(() => {
    const fetchJobAndApplicationStatus = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          (user && user.role === 'seeker') ? api.get('/applications/my-applications') : Promise.resolve({ data: [] })
        ]);
        
        setJob(jobRes.data);
        
        if (user && user.role === 'seeker') {
          const applied = appsRes.data.some(app => app.job?._id === id || app.job === id);
          setHasApplied(applied);
        }
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplicationStatus();
  }, [id, user]);

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

  const generateCoverLetter = () => {
    if (!user) return toast.error('Please login first');
    setIsGeneratingCoverLetter(true);
    setCoverLetter('');
    
    // Simulate typing animation
    const text = `Dear Hiring Manager,\n\nI am thrilled to apply for the ${job.title} position at ${job.company?.name}. With my strong background in ${job.category} and my passion for delivering high-quality results, I am confident in my ability to make an immediate impact at your organization.\n\nThroughout my career, I have honed the skills listed in your requirements, and I am excited about the opportunity to bring my expertise to your team.\n\nThank you for considering my application. I look forward to discussing how my skills and experiences align with your needs.\n\nSincerely,\n${user.name}`;
    
    let i = 0;
    const intervalId = setInterval(() => {
      setCoverLetter(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsGeneratingCoverLetter(false);
        toast.success('AI Cover Letter Generated!');
      }
    }, 15);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile && !user?.resume) {
      return toast.error('Please upload a resume');
    }

    setApplying(true);
    try {
      let finalResumeUrl = user?.resume || '';

      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        const uploadRes = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        finalResumeUrl = uploadRes.data.resumeUrl;
      }

      await api.post('/applications', {
        jobId: id,
        resume: finalResumeUrl,
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
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="flex gap-8">
          <div className="h-24 w-24 rounded-xl bg-border/60 animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-1/2 bg-border/60 animate-pulse rounded" />
            <div className="h-6 w-1/3 bg-border/60 animate-pulse rounded" />
          </div>
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
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
            <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4" /> ₹{job.salaryRange?.min.toLocaleString('en-IN')} - ₹{job.salaryRange?.max.toLocaleString('en-IN')}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="default">{job.jobType}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          {user?.role !== 'recruiter' && user?.role !== 'admin' && (
            hasApplied ? (
              <Button size="lg" className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 border-emerald-200 cursor-not-allowed opacity-100" disabled>
                <CheckCircle className="w-5 h-5 mr-2" /> Already Applied
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={() => user ? setIsApplyModalOpen(true) : window.location.href = '/login'}>
                Apply Now
              </Button>
            )
          )}
          <Button variant="secondary" onClick={generateAiSummary} isLoading={loadingAi} className="w-full group">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500 group-hover:animate-pulse" />
            AI Job Summary
          </Button>
        </div>
      </div>

      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
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

      {/* Application Modal */}
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resume Document</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
              onChange={(e) => setResumeFile(e.target.files[0])}
              required={!user?.resume}
            />
            {user?.resume && !resumeFile && (
              <p className="text-xs text-text-muted mt-1">Your saved resume will be used if you don't upload a new one.</p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Cover Letter (Optional)</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={generateCoverLetter} 
                disabled={isGeneratingCoverLetter}
                className="text-primary hover:text-primary hover:bg-primary/10 h-8"
              >
                <Bot className="w-4 h-4 mr-2" />
                {isGeneratingCoverLetter ? 'Generating...' : 'Auto-Generate with AI'}
              </Button>
            </div>
            <textarea 
              className={cn(
                "w-full rounded-xl border bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all",
                isGeneratingCoverLetter ? "border-primary/50 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]" : "border-border"
              )}
              rows="6"
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
      </Modal>
    </div>
  );
};

export default JobDetails;
