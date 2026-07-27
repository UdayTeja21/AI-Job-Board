import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, MapPin, Briefcase, Filter, Building2, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [jobTypeFilters, setJobTypeFilters] = useState([]);
  const [workModeFilters, setWorkModeFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setDebouncedLocation(location);
    }, 500);
    return () => clearTimeout(timerId);
  }, [keyword, location]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let query = `/jobs?keyword=${debouncedKeyword}&location=${debouncedLocation}&pageNumber=${page}`;
        if (jobTypeFilters.length > 0) query += `&jobType=${jobTypeFilters.join(',')}`;
        if (workModeFilters.length > 0) query += `&workMode=${workModeFilters.join(',')}`;
        
        const res = await api.get(query);
        setJobs(res.data.jobs);
        setPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching jobs', error);
        toast.error('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [debouncedKeyword, debouncedLocation, page, jobTypeFilters, workModeFilters]);

  const toggleFilter = (setFilterState, value) => {
    setFilterState(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-heading font-bold mb-8 tracking-tight">Find your next opportunity</h1>
          
          <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2 border border-border/60 shadow-premium">
            <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input 
                placeholder="Job title or keyword" 
                className="pl-12 h-14 border-none shadow-none focus:ring-0 bg-transparent text-base rounded-xl" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-border self-center"></div>
            <div className="w-full relative border-t md:border-t-0 border-border">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input 
                placeholder="Location" 
                className="pl-12 h-14 border-none shadow-none focus:ring-0 bg-transparent text-base rounded-xl" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button className="w-full md:w-auto h-14 px-8 m-1 rounded-xl shrink-0">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8 shrink-0 sticky top-24 self-start">
            <div className="flex items-center gap-2 font-heading font-bold text-lg pb-4 border-b border-border">
              <Filter className="h-5 w-5 text-primary" />
              <h3>Filters</h3>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Job Type</h4>
              <div className="space-y-3">
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm text-text cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${jobTypeFilters.includes(type) ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}>
                      {jobTypeFilters.includes(type) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={jobTypeFilters.includes(type)}
                      onChange={() => toggleFilter(setJobTypeFilters, type)}
                    />
                    <span className="group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Work Mode</h4>
              <div className="space-y-3">
                {['Remote', 'Onsite', 'Hybrid'].map((mode) => (
                  <label key={mode} className="flex items-center gap-3 text-sm text-text cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${workModeFilters.includes(mode) ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}>
                      {workModeFilters.includes(mode) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={workModeFilters.includes(mode)}
                      onChange={() => toggleFilter(setWorkModeFilters, mode)}
                    />
                    <span className="group-hover:text-primary transition-colors">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="flex-1 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState 
                icon={Briefcase} 
                title="No jobs found" 
                description="We couldn't find any jobs matching your criteria. Try adjusting your filters or search term."
                actionLabel="Clear Filters"
                onAction={() => {
                  setKeyword('');
                  setLocation('');
                  setJobTypeFilters([]);
                  setWorkModeFilters([]);
                }}
              />
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={job._id}
                  >
                    <Card className="hover:shadow-premium transition-all duration-300 group border-border/60 bg-surface hover:bg-[hsl(var(--surface-hover))] cursor-pointer">
                      <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative">
                        <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/10 group-hover:border-primary/30 transition-colors">
                          <span className="text-2xl font-bold text-primary">{job.company?.name?.charAt(0) || 'C'}</span>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <Link to={`/jobs/${job._id}`} className="text-xl font-heading font-bold group-hover:text-primary transition-colors before:absolute before:inset-0">
                            {job.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted font-medium">
                            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {job.company?.name || 'Company Name'}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.workMode}</span>
                          </div>
                          <div className="flex gap-2 pt-3">
                            <Badge variant="secondary" className="bg-background">{job.category}</Badge>
                            <Badge variant="outline" className="border-primary/20 text-primary">{job.jobType}</Badge>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-background border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12 pt-8 border-t border-border">
                    {[...Array(pages).keys()].map((p) => (
                      <Button
                        key={p + 1}
                        variant={page === p + 1 ? 'primary' : 'outline'}
                        size="sm"
                        className={page === p + 1 ? '' : 'bg-surface'}
                        onClick={() => setPage(p + 1)}
                      >
                        {p + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
