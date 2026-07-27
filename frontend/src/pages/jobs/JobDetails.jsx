import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Briefcase, IndianRupee, Calendar, Sparkles, Building2, Bot, CheckCircle, ArrowLeft, ChevronRight, Globe, Users, Clock } from 'lucide-react';
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
        
        const uploadRes = await api.post('/upload', formData);
        finalResumeUrl = uploadRes.data.resumeUrl;
      }

      await api.post('/applications', {
        jobId: id,
        resume: finalResumeUrl,
        coverLetter
      });
      toast.success('Successfully applied for the job!');
      setIsApplyModalOpen(false);
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        <div className="flex gap-8">
          <div className="h-28 w-28 rounded-2xl bg-border/60 animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 bg-border/60 animate-pulse rounded-lg" />
            <div className="h-6 w-1/3 bg-border/60 animate-pulse rounded-md" />
            <div className="flex gap-4 pt-2">
              <div className="h-6 w-24 bg-border/60 animate-pulse rounded-full" />
              <div className="h-6 w-24 bg-border/60 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Job not found</h2>
        <p className="text-text-muted mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-surface border-b border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
        
        <div className="container mx-auto px-4 max-w-5xl py-8">
          <Link to="/jobs" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to jobs
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-24 w-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20">
                 <span className="text-4xl font-heading font-bold text-primary">{job.company?.name?.charAt(0) || 'C'}</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-text leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-text-muted">
                  <span className="flex items-center gap-1.5 hover:text-text transition-colors">
                    <Building2 className="h-4 w-4" /> {job.company?.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4" /> ₹{job.salaryRange?.min.toLocaleString('en-IN')} - ₹{job.salaryRange?.max.toLocaleString('en-IN')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Badge variant="secondary" className="bg-background border-border shadow-sm">{job.category}</Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{job.jobType}</Badge>
                  <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5">{job.workMode}</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              {user?.role !== 'recruiter' && user?.role !== 'admin' && (
                hasApplied ? (
                  <Button size="lg" className="w-full md:w-auto bg-emerald-50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 border border-emerald-200 cursor-default opacity-100 shadow-none">
                    <CheckCircle className="w-5 h-5 mr-2" /> Applied
                  </Button>
                ) : (
                  <Button size="lg" className="w-full md:w-auto px-8 shadow-premium" onClick={() => user ? setIsApplyModalOpen(true) : window.location.href = '/login'}>
                    Apply Now
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* AI Summary Banner */}
            <div className="relative">
              {!aiSummary ? (
                <div className="glass-panel rounded-2xl p-6 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent">
                  <div>
                    <h3 className="font-semibold text-text flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Too long to read?
                    </h3>
                    <p className="text-sm text-text-muted mt-1">Get an AI-generated TL;DR of this job description and core requirements.</p>
                  </div>
                  <Button variant="secondary" onClick={generateAiSummary} isLoading={loadingAi} className="shrink-0 bg-background hover:bg-[hsl(var(--surface-hover))]">
                    <Bot className="w-4 h-4 mr-2" /> Generate Summary
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-primary/30 bg-primary/5 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                        <Sparkles className="h-5 w-5" />
                        <h3>AI Generated Summary</h3>
                      </div>
                      <p className="text-text leading-relaxed text-sm md:text-base">{aiSummary}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" /> About the Role
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-text-muted leading-relaxed whitespace-pre-wrap text-base">
                {job.description}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" /> Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-text-muted leading-relaxed text-base">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24 border-border/60 bg-surface shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-lg mb-6 pb-4 border-b border-border/60 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> About the Company
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-primary/20">
                     <span className="text-2xl font-bold text-primary">{job.company?.name?.charAt(0) || 'C'}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{job.company?.name}</h4>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                      <Users className="w-3.5 h-3.5" /> 50-200 Employees
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-text-muted mb-6 leading-relaxed">
                  <p>{job.company?.description || 'A fast-growing technology company building innovative solutions for the modern world.'}</p>
                </div>

                {job.company?.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-[hsl(var(--surface-hover))] text-sm font-medium transition-colors group text-text">
                    <Globe className="w-4 h-4 mr-2 text-text-muted group-hover:text-primary transition-colors" />
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApply} className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text text-sm">{job.company?.name}</h4>
                <p className="text-xs text-text-muted mt-0.5">You are applying for the {job.title} position.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Resume Document</label>
            <div className="relative group">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors file:transition-colors file:cursor-pointer cursor-pointer text-text-muted hover:border-primary/50" 
                onChange={(e) => setResumeFile(e.target.files[0])}
                required={!user?.resume}
              />
            </div>
            {user?.resume && !resumeFile && (
              <p className="text-xs text-text-muted flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                Using your saved resume profile. Upload a new one to replace it.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-text">Cover Letter (Optional)</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={generateCoverLetter} 
                disabled={isGeneratingCoverLetter}
                className="text-primary hover:text-primary hover:bg-primary/10 h-8 text-xs font-semibold uppercase tracking-wider"
              >
                <Bot className="w-4 h-4 mr-2" />
                {isGeneratingCoverLetter ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>
            <textarea 
              className={cn(
                "w-full rounded-xl border bg-background px-4 py-3 text-sm text-text focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 resize-y min-h-[160px]",
                isGeneratingCoverLetter ? "border-primary/50 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]" : "border-border hover:border-primary/50"
              )}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Hi there, I'm excited to apply for this role because..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={applying} className="px-8 shadow-premium">Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
