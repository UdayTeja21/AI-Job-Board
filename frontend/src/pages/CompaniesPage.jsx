import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, MapPin, Users, Globe, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data);
      } catch (error) {
        console.error('Error fetching companies', error);
        toast.error('Failed to load companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Section */}
      <div className="bg-surface border-b border-border py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-4 tracking-tight text-text">
              Actively Hiring Companies
            </h1>
            <p className="text-lg text-text-muted">
              Discover top organizations that are currently looking for talent like you. 
              These companies have active job listings open right now.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12 max-w-7xl">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-surface rounded-2xl border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No Companies Found"
            description="There are currently no companies with active job listings. Please check back later!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={company._id}
              >
                <Card className="h-full hover:shadow-premium transition-all duration-300 group border-border/60 bg-surface hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col h-full relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-primary/10"></div>
                    
                    <div className="flex items-start gap-4 mb-5">
                      <div className="h-14 w-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm text-primary font-bold text-xl">
                        {company.name ? company.name.charAt(0) : 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
                          {company.name}
                        </h3>
                        <p className="text-sm text-text-muted mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{company.location || 'Location not specified'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-muted line-clamp-3 mb-6 flex-grow">
                      {company.description || 'No description provided for this company.'}
                    </p>
                    
                    <div className="pt-5 border-t border-border/50 flex flex-wrap gap-4 mt-auto">
                      {company.companySize && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{company.companySize}</span>
                        </div>
                      )}
                      
                      {company.website && (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-xs font-semibold text-text hover:text-primary transition-colors"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
