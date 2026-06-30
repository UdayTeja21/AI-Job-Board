import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timerId);
  }, [keyword]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs?keyword=${debouncedKeyword}&pageNumber=${page}`);
        setJobs(res.data.jobs);
        setPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [debouncedKeyword, page]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Find your next opportunity</h1>
        
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <Input 
              placeholder="Job title or keyword" 
              className="pl-10" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <Input placeholder="Location" className="pl-10" />
          </div>
          <Button className="md:w-auto w-full">Search</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="flex items-center gap-2 font-semibold pb-2 border-b border-border">
            <Filter className="h-5 w-5" />
            <h3>Filters</h3>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Job Type</h4>
            {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                {type}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Work Mode</h4>
            {['Remote', 'Onsite', 'Hybrid'].map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                {mode}
              </label>
            ))}
          </div>
        </aside>

        {/* Job Listings */}
        <main className="flex-1 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-32" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-border">
              <Briefcase className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-text-muted text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              {jobs.map((job) => (
                <Card key={job._id} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      {/* Logo placeholder */}
                      <span className="text-2xl font-bold text-gray-400">{job.company?.name?.charAt(0) || 'C'}</span>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <Link to={`/jobs/${job._id}`} className="text-lg font-semibold hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                        <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.company?.name || 'Company Name'}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.workMode}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Badge variant="outline">{job.category}</Badge>
                        <Badge variant="default">{job.jobType}</Badge>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <Link to={`/jobs/${job._id}`} className="w-full">
                        <Button className="w-full">Apply Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(pages).keys()].map((p) => (
                    <Button
                      key={p + 1}
                      variant={page === p + 1 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setPage(p + 1)}
                    >
                      {p + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Temporary icon since we didn't import Building2 here
const Building2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);

export default JobSearch;
